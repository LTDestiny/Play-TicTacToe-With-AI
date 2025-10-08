"use client";

import { useGameState } from "@/hooks/useGameState";
import { GameBoard } from "@/components/GameBoard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, Medal, RefreshCw, Settings, Target, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

export function TicTacToeGame() {
  const {
    gameState,
    gameScore,
    aiMetrics,
    gameSettings,
    isAIThinking,
    makePlayerMove,
    startNewGame,
    changeDifficulty,
    changeBoardSize,
    switchPlayerSymbol,
    resetStats,
    gameStats,
  } = useGameState();

  const [showGameOverDialog, setShowGameOverDialog] = useState(false);

  // Show game over dialog when game ends
  useEffect(() => {
    if (gameState.gameStatus !== "playing") {
      const timer = setTimeout(() => {
        setShowGameOverDialog(true);
      }, 1000); // Delay to show the winning animation first

      return () => clearTimeout(timer);
    }
  }, [gameState.gameStatus]);

  const getGameStatusMessage = () => {
    if (gameState.gameStatus === "won") {
      if (gameState.winner === gameSettings.playerSymbol) {
        return {
          title: "🎉 Congratulations!",
          message: "You won!",
          color: "text-green-600 dark:text-green-400",
        };
      } else {
        return {
          title: "🤖 AI Wins!",
          message: "Better luck next time!",
          color: "text-red-600 dark:text-red-400",
        };
      }
    } else if (gameState.gameStatus === "draw") {
      return {
        title: "🤝 It's a Draw!",
        message: "Great game!",
        color: "text-yellow-600 dark:text-yellow-400",
      };
    }
    return null;
  };

  const handleNewGameFromDialog = () => {
    setShowGameOverDialog(false);
    startNewGame();
  };

  const statusMessage = getGameStatusMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            TicTacToe AI
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Challenge the AI with multiple difficulty levels
          </p>
        </div>

        {/* Game Status Banner */}
        {gameState.gameStatus !== "playing" && statusMessage && (
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className={`text-center ${statusMessage.color}`}>
                <div className="text-2xl font-bold mb-1">
                  {statusMessage.title}
                </div>
                <div className="text-lg">{statusMessage.message}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Game Layout */}
        {/* Top Row - All Controls in One Card */}
        <div className="mb-8">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-xl">
                Game Controls & Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Game Controls Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Game Settings
                  </h3>
                  
                  {/* New Game Button */}
                  <Button
                    onClick={startNewGame}
                    className="w-full"
                    size="lg"
                    variant={gameState.gameStatus === "playing" ? "outline" : "default"}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    New Game
                  </Button>

                  {/* Difficulty Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Difficulty</label>
                      <Badge
                        variant="secondary"
                        className={gameSettings.difficulty === "easy" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"}
                      >
                        {gameSettings.difficulty.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant={gameSettings.difficulty === "easy" ? "default" : "outline"}
                        size="sm"
                        onClick={() => changeDifficulty("easy")}
                        className="flex-1"
                      >
                        Easy
                      </Button>
                      <Button
                        variant={gameSettings.difficulty === "hard" ? "default" : "outline"}
                        size="sm"
                        onClick={() => changeDifficulty("hard")}
                        className="flex-1"
                      >
                        Hard
                      </Button>
                    </div>
                  </div>

                  {/* Player Symbol Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">You play as</label>
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold ${gameSettings.playerSymbol === "X" ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`}>
                          X
                        </span>
                        <Switch
                          checked={gameSettings.playerSymbol === "O"}
                          onCheckedChange={switchPlayerSymbol}
                        />
                        <span className={`font-bold ${gameSettings.playerSymbol === "O" ? "text-red-600 dark:text-red-400" : "text-gray-400"}`}>
                          O
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Medal className="h-5 w-5" />
                    Score & Stats
                  </h3>
                  
                  {/* Win/Loss/Draw Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {gameScore.playerWins}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Wins
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {gameScore.aiWins}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Losses
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {gameScore.draws}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Draws
                      </div>
                    </div>
                  </div>

                  {/* Win Rate */}
                  <div className="text-center">
                    <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      Win Rate: {gameStats.winRate}%
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Total Games: {gameStats.totalGames}
                    </div>
                  </div>

                  {/* Current Streak */}
                  {gameScore.currentStreak > 0 && gameScore.streakType && (
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className={`text-sm font-medium ${
                        gameScore.streakType === "win" 
                          ? "text-green-600 dark:text-green-400"
                          : gameScore.streakType === "loss"
                          ? "text-red-600 dark:text-red-400"
                          : "text-yellow-600 dark:text-yellow-400"
                      }`}>
                        {gameScore.currentStreak} {gameScore.streakType === "win" ? "wins" : gameScore.streakType === "loss" ? "losses" : "draws"} streak
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={resetStats}
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Stats
                  </Button>
                </div>

                {/* Board Size & AI Metrics Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Board & AI
                  </h3>
                  
                  {/* Board Size Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Board Size</label>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {gameSettings.boardSize}x{gameSettings.boardSize}
                      </Badge>
                    </div>
                    
                    {/* Quick Size Buttons */}
                    <div className="grid grid-cols-4 gap-1">
                      {([3, 4, 5, 6] as const).map((size) => (
                        <Button
                          key={size}
                          variant={gameSettings.boardSize === size ? "default" : "outline"}
                          size="sm"
                          onClick={() => changeBoardSize(size)}
                          className="text-xs px-2 py-1"
                        >
                          {size}x{size}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-4 gap-1">
                      {([7, 8, 9, 10] as const).map((size) => (
                        <Button
                          key={size}
                          variant={gameSettings.boardSize === size ? "default" : "outline"}
                          size="sm"
                          onClick={() => changeBoardSize(size)}
                          className="text-xs px-2 py-1"
                        >
                          {size}x{size}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* AI Metrics */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">AI Performance</label>
                    {gameSettings.difficulty === "hard" && (
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Positions:</span>
                          <span>{aiMetrics.positionsEvaluated}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <span>{aiMetrics.thinkingTime}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Score:</span>
                          <span>{aiMetrics.lastMoveScore}</span>
                        </div>
                      </div>
                    )}
                    {isAIThinking && (
                      <div className="flex items-center justify-center py-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        <span className="text-sm">AI thinking...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row - Game Board (Full Width) */}
        <div className="flex justify-center">
          <Card className="w-full max-w-4xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2">
                <Users className="h-5 w-5" />
                Game Board ({gameSettings.boardSize}x{gameSettings.boardSize})
                {gameState.gameStatus !== "playing" && gameState.winner && (
                  <Badge variant="secondary" className="ml-2">
                    {gameState.winner === gameSettings.playerSymbol
                      ? "You Win!"
                      : "AI Wins!"}
                  </Badge>
                )}
                {gameState.gameStatus === "draw" && (
                  <Badge variant="secondary" className="ml-2">
                    Draw!
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <GameBoard
                board={gameState.board}
                onCellClick={makePlayerMove}
                isPlayerTurn={gameState.isPlayerTurn}
                isAIThinking={isAIThinking}
                winningLine={gameState.winningLine}
                disabled={gameState.gameStatus !== "playing"}
              />
            </CardContent>
          </Card>
        </div>

        {/* Game Over Dialog */}
        <Dialog open={showGameOverDialog} onOpenChange={setShowGameOverDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">
                {statusMessage && (
                  <div className={statusMessage.color}>
                    {statusMessage.title}
                  </div>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="text-center space-y-4">
              {statusMessage && (
                <div className="text-lg text-gray-600 dark:text-gray-300">
                  {statusMessage.message}
                </div>
              )}

              {/* Game stats summary */}
              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {gameScore.playerWins}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Your Wins
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {gameScore.aiWins}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    AI Wins
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {gameScore.draws}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Draws
                  </div>
                </div>
              </div>

              {/* Current streak display */}
              {gameScore.currentStreak > 1 && gameScore.streakType && (
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-lg font-medium">
                    <Medal className="h-5 w-5" />
                    {gameScore.currentStreak}{" "}
                    {gameScore.streakType === "win"
                      ? "wins"
                      : gameScore.streakType === "loss"
                      ? "losses"
                      : "draws"}{" "}
                    in a row!
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleNewGameFromDialog}
                  className="flex-1"
                  size="lg"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Play Again
                </Button>
                <Button
                  onClick={() => setShowGameOverDialog(false)}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
