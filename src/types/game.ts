/**
 * Core types for TicTacToe game
 */

// Player types
export type Player = "X" | "O";
export type Cell = Player | null;

// Board representation (dynamic size)
export type Board = Cell[][];

// Game difficulty levels
export type Difficulty = "easy" | "hard";

// Game status
export type GameStatus = "playing" | "won" | "draw";

// Board size options (minimum 3, maximum 10)
export type BoardSize = 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// Winning combinations for dynamic board sizes
export type WinningLine = [number, number][];

// Game state interface
export interface GameState {
  board: Board;
  boardSize: BoardSize;
  currentPlayer: Player;
  gameStatus: GameStatus;
  winner: Player | null;
  winningLine: WinningLine | null;
  isPlayerTurn: boolean;
  difficulty: Difficulty;
}

// Score tracking
export interface GameScore {
  playerWins: number;
  aiWins: number;
  draws: number;
  currentStreak: number;
  streakType: "win" | "loss" | "draw" | null;
}

// AI performance metrics
export interface AIMetrics {
  positionsEvaluated: number;
  thinkingTime: number; // milliseconds
  lastMoveScore: number; // minimax score
}

// Move interface for AI and game logic
export interface Move {
  row: number;
  col: number;
  score?: number; // For minimax evaluation
}

// Game settings
export interface GameSettings {
  difficulty: Difficulty;
  playerSymbol: Player; // Player always starts as X or O
  aiSymbol: Player;
  boardSize: BoardSize;
}

// Game history for advanced features
export interface GameHistory {
  moves: Move[];
  duration: number; // Game duration in milliseconds
  winner: Player | null;
  difficulty: Difficulty;
  timestamp: number;
}

// Complete game context
export interface GameContext {
  gameState: GameState;
  gameScore: GameScore;
  aiMetrics: AIMetrics;
  gameSettings: GameSettings;
  gameHistory: GameHistory[];
}

// Minimax algorithm types
export interface MinimaxResult {
  score: number;
  move: Move | null;
  positionsEvaluated: number;
}

// Constants
export const EMPTY_CELL: Cell = null;
export const PLAYER_X: Player = "X";
export const PLAYER_O: Player = "O";

// Default values
export const DEFAULT_GAME_STATE: GameState = {
  board: [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
  boardSize: 3,
  currentPlayer: PLAYER_X,
  gameStatus: "playing",
  winner: null,
  winningLine: null,
  isPlayerTurn: true,
  difficulty: "easy",
};

export const DEFAULT_SCORE: GameScore = {
  playerWins: 0,
  aiWins: 0,
  draws: 0,
  currentStreak: 0,
  streakType: null,
};

export const DEFAULT_AI_METRICS: AIMetrics = {
  positionsEvaluated: 0,
  thinkingTime: 0,
  lastMoveScore: 0,
};

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  difficulty: "easy",
  playerSymbol: PLAYER_X,
  aiSymbol: PLAYER_O,
  boardSize: 3,
};
