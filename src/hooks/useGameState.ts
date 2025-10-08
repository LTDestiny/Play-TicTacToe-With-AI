"use client";

import { useState, useEffect, useCallback } from "react";
import {
  GameState,
  GameScore,
  AIMetrics,
  GameSettings,
  GameHistory,
  Player,
  Difficulty,
  Move,
  DEFAULT_GAME_STATE,
  DEFAULT_SCORE,
  DEFAULT_AI_METRICS,
  DEFAULT_GAME_SETTINGS,
  PLAYER_X,
  PLAYER_O,
} from "@/types/game";
import { BoardSize } from "@/types/game";
import {
  makeMove,
  checkWinner,
  isBoardFull,
  getOpponent,
  createEmptyBoard,
} from "@/utils/gameLogic";
import { aiEngine } from "@/utils/aiEngine";

/**
 * Custom hook for managing TicTacToe game state
 */
export function useGameState() {
  // Core game state
  const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE);
  const [gameScore, setGameScore] = useState<GameScore>(DEFAULT_SCORE);
  const [aiMetrics, setAIMetrics] = useState<AIMetrics>(DEFAULT_AI_METRICS);
  const [gameSettings, setGameSettings] = useState<GameSettings>(
    DEFAULT_GAME_SETTINGS
  );
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);

  // Game timing
  const [gameStartTime, setGameStartTime] = useState<number>(Date.now());
  const [isAIThinking, setIsAIThinking] = useState<boolean>(false);
  const [currentMoves, setCurrentMoves] = useState<Move[]>([]);

  // Load saved data from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedScore = localStorage.getItem("tictactoe-score");
        const savedSettings = localStorage.getItem("tictactoe-settings");
        const savedHistory = localStorage.getItem("tictactoe-history");

        if (savedScore) {
          setGameScore(JSON.parse(savedScore));
        }
        if (savedSettings) {
          setGameSettings(JSON.parse(savedSettings));
        }
        if (savedHistory) {
          setGameHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.warn("Failed to load saved game data:", error);
      }
    }
  }, []);

  // Save score to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tictactoe-score", JSON.stringify(gameScore));
    }
  }, [gameScore]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tictactoe-settings", JSON.stringify(gameSettings));
    }
  }, [gameSettings]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tictactoe-history", JSON.stringify(gameHistory));
    }
  }, [gameHistory]);

  /**
   * Updates the game score based on the winner
   */
  const updateGameScore = useCallback(
    (winner: Player | null) => {
      setGameScore((prevScore) => {
        const newScore = { ...prevScore };

        if (winner === gameSettings.playerSymbol) {
          newScore.playerWins += 1;
          newScore.currentStreak =
            prevScore.streakType === "win" ? prevScore.currentStreak + 1 : 1;
          newScore.streakType = "win";
        } else if (winner === gameSettings.aiSymbol) {
          newScore.aiWins += 1;
          newScore.currentStreak =
            prevScore.streakType === "loss" ? prevScore.currentStreak + 1 : 1;
          newScore.streakType = "loss";
        } else {
          newScore.draws += 1;
          newScore.currentStreak =
            prevScore.streakType === "draw" ? prevScore.currentStreak + 1 : 1;
          newScore.streakType = "draw";
        }

        return newScore;
      });
    },
    [gameSettings]
  );

  /**
   * Saves the completed game to history
   */
  const saveGameToHistory = useCallback(
    (moves: Move[], winner: Player | null) => {
      const gameHistoryEntry: GameHistory = {
        moves,
        duration: Date.now() - gameStartTime,
        winner,
        difficulty: gameSettings.difficulty,
        timestamp: Date.now(),
      };

      setGameHistory((prev) => [gameHistoryEntry, ...prev.slice(0, 49)]); // Keep last 50 games
    },
    [gameStartTime, gameSettings.difficulty]
  );

  /**
   * Makes a player move
   */
  const makePlayerMove = useCallback(
    (row: number, col: number): boolean => {
      if (
        gameState.gameStatus !== "playing" ||
        !gameState.isPlayerTurn ||
        isAIThinking
      ) {
        return false;
      }

      try {
        const newBoard = makeMove(
          gameState.board,
          row,
          col,
          gameSettings.playerSymbol
        );
        const { winner, winningLine } = checkWinner(newBoard);
        const isDraw = !winner && isBoardFull(newBoard);

        const newMoves = [...currentMoves, { row, col }];
        setCurrentMoves(newMoves);

        const newGameState: GameState = {
          ...gameState,
          board: newBoard,
          currentPlayer: gameSettings.aiSymbol,
          gameStatus: winner ? "won" : isDraw ? "draw" : "playing",
          winner,
          winningLine,
          isPlayerTurn: false,
        };

        setGameState(newGameState);

        // If game is over, update scores
        if (winner || isDraw) {
          updateGameScore(winner);
          saveGameToHistory(newMoves, winner);
        }

        return true;
      } catch (error) {
        console.error("Failed to make player move:", error);
        return false;
      }
    },
    [
      gameState,
      gameSettings,
      isAIThinking,
      currentMoves,
      updateGameScore,
      saveGameToHistory,
    ]
  );

  /**
   * Makes an AI move
   */
  const makeAIMove = useCallback(async (): Promise<void> => {
    if (
      gameState.gameStatus !== "playing" ||
      gameState.isPlayerTurn ||
      isAIThinking
    ) {
      return;
    }

    setIsAIThinking(true);

    // Add a small delay to show thinking state
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const aiResult = aiEngine.getBestMove(
        gameState.board,
        gameSettings.aiSymbol,
        gameSettings.difficulty
      );

      if (!aiResult.move) {
        setIsAIThinking(false);
        return;
      }

      const newBoard = makeMove(
        gameState.board,
        aiResult.move.row,
        aiResult.move.col,
        gameSettings.aiSymbol
      );

      const { winner, winningLine } = checkWinner(newBoard);
      const isDraw = !winner && isBoardFull(newBoard);

      const newMoves = [...currentMoves, aiResult.move];
      setCurrentMoves(newMoves);

      const newGameState: GameState = {
        ...gameState,
        board: newBoard,
        currentPlayer: gameSettings.playerSymbol,
        gameStatus: winner ? "won" : isDraw ? "draw" : "playing",
        winner,
        winningLine,
        isPlayerTurn: true,
      };

      setGameState(newGameState);
      setAIMetrics(aiResult.metrics);

      // If game is over, update scores
      if (winner || isDraw) {
        updateGameScore(winner);
        saveGameToHistory(newMoves, winner);
      }
    } catch (error) {
      console.error("Failed to make AI move:", error);
    } finally {
      setIsAIThinking(false);
    }
  }, [
    gameState,
    gameSettings,
    isAIThinking,
    currentMoves,
    updateGameScore,
    saveGameToHistory,
  ]);

  /**
   * Starts a new game
   */
  const startNewGame = useCallback(() => {
    setGameState({
      ...DEFAULT_GAME_STATE,
      board: createEmptyBoard(gameSettings.boardSize),
      boardSize: gameSettings.boardSize,
      currentPlayer: gameSettings.playerSymbol,
      isPlayerTurn: gameSettings.playerSymbol === PLAYER_X,
      difficulty: gameSettings.difficulty,
    });
    setAIMetrics(DEFAULT_AI_METRICS);
    setGameStartTime(Date.now());
    setCurrentMoves([]);
    setIsAIThinking(false);
    aiEngine.reset();
  }, [gameSettings]);

  /**
   * Changes the difficulty level
   */
  const changeDifficulty = useCallback((difficulty: Difficulty) => {
    setGameSettings((prev) => ({ ...prev, difficulty }));
    setGameState((prev) => ({ ...prev, difficulty }));
  }, []);

  /**
   * Changes the board size
   */
  const changeBoardSize = useCallback(
    (boardSize: BoardSize) => {
      // Validate board size
      if (boardSize < 3 || boardSize > 10) {
        console.warn(
          `Invalid board size: ${boardSize}. Must be between 3 and 10.`
        );
        return;
      }

      setGameSettings((prev) => ({ ...prev, boardSize }));
      // Start a new game with the new board size
      setGameState({
        ...DEFAULT_GAME_STATE,
        board: createEmptyBoard(boardSize),
        boardSize,
        currentPlayer: gameSettings.playerSymbol,
        isPlayerTurn: gameSettings.playerSymbol === PLAYER_X,
        difficulty: gameSettings.difficulty,
      });
      setAIMetrics(DEFAULT_AI_METRICS);
      setGameStartTime(Date.now());
      setCurrentMoves([]);
      setIsAIThinking(false);
      aiEngine.reset();
    },
    [gameSettings]
  );

  /**
   * Switches player symbols (X/O)
   */
  const switchPlayerSymbol = useCallback(() => {
    const newPlayerSymbol =
      gameSettings.playerSymbol === PLAYER_X ? PLAYER_O : PLAYER_X;
    const newAISymbol = getOpponent(newPlayerSymbol);

    setGameSettings((prev) => ({
      ...prev,
      playerSymbol: newPlayerSymbol,
      aiSymbol: newAISymbol,
    }));

    startNewGame();
  }, [gameSettings.playerSymbol, startNewGame]);

  /**
   * Resets all scores and history
   */
  const resetStats = useCallback(() => {
    setGameScore(DEFAULT_SCORE);
    setGameHistory([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("tictactoe-score");
      localStorage.removeItem("tictactoe-history");
    }
  }, []);

  /**
   * Gets current game statistics
   */
  const getGameStats = useCallback(() => {
    const totalGames =
      gameScore.playerWins + gameScore.aiWins + gameScore.draws;
    const winRate =
      totalGames > 0 ? (gameScore.playerWins / totalGames) * 100 : 0;

    return {
      totalGames,
      winRate: Math.round(winRate * 100) / 100,
      averageGameDuration:
        gameHistory.length > 0
          ? Math.round(
              gameHistory.reduce((sum, game) => sum + game.duration, 0) /
                gameHistory.length /
                1000
            )
          : 0,
    };
  }, [gameScore, gameHistory]);

  // Trigger AI move when it's AI's turn
  useEffect(() => {
    if (
      !gameState.isPlayerTurn &&
      gameState.gameStatus === "playing" &&
      !isAIThinking
    ) {
      makeAIMove();
    }
  }, [gameState.isPlayerTurn, gameState.gameStatus, isAIThinking, makeAIMove]);

  return {
    // Game state
    gameState,
    gameScore,
    aiMetrics,
    gameSettings,
    gameHistory,
    isAIThinking,

    // Actions
    makePlayerMove,
    startNewGame,
    changeDifficulty,
    changeBoardSize,
    switchPlayerSymbol,
    resetStats,

    // Computed values
    gameStats: getGameStats(),
  };
}
