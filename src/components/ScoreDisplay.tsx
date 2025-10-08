"use client";

import { GameScore } from "@/types/game";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trophy, Target, Timer, RotateCcw } from "lucide-react";

interface ScoreDisplayProps {
  gameScore: GameScore;
  gameStats: {
    totalGames: number;
    winRate: number;
    averageGameDuration: number;
  };
  onResetStats: () => void;
}

export function ScoreDisplay({
  gameScore,
  gameStats,
  onResetStats,
}: ScoreDisplayProps) {
  const streakColors = {
    win: "text-green-600 dark:text-green-400",
    loss: "text-red-600 dark:text-red-400",
    draw: "text-yellow-600 dark:text-yellow-400",
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5" />
          Score & Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Win/Loss/Draw Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {gameScore.playerWins}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Wins</div>
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

        <Separator />

        {/* Current Streak */}
        {gameScore.currentStreak > 0 && gameScore.streakType && (
          <div className="text-center">
            <div className="text-sm font-medium mb-1">Current Streak</div>
            <div
              className={`text-xl font-bold ${
                streakColors[gameScore.streakType]
              }`}
            >
              {gameScore.currentStreak}{" "}
              {gameScore.streakType === "win"
                ? "🔥"
                : gameScore.streakType === "loss"
                ? "❄️"
                : "🤝"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {gameScore.streakType}
              {gameScore.currentStreak > 1 ? "s" : ""} in a row
            </div>
          </div>
        )}

        {/* Win Rate Display */}
        {gameStats.totalGames > 0 && (
          <>
            <Separator />
            <div className="text-center">
              <div className="text-sm font-medium mb-1">Win Rate</div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {gameStats.winRate.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Total Games: {gameStats.totalGames}
              </div>
            </div>
          </>
        )}

        {/* Detailed Game Statistics */}
        {gameStats.totalGames > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Win Rate
                </span>
                <span className="font-medium">
                  {gameStats.winRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Timer className="h-3 w-3" />
                  Avg Game
                </span>
                <span className="font-medium">
                  {gameStats.averageGameDuration}s
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Total Games</span>
                <span className="font-medium">{gameStats.totalGames}</span>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Reset Stats Button */}
        <Button
          onClick={onResetStats}
          variant="outline"
          size="sm"
          className="w-full text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
        >
          <RotateCcw className="h-3 w-3 mr-2" />
          Reset Stats
        </Button>
      </CardContent>
    </Card>
  );
}
