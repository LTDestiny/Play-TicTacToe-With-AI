"use client";

import {
  Difficulty,
  GameSettings as GameSettingsType,
  BoardSize,
} from "@/types/game";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Settings } from "lucide-react";
import { BoardSizeSelector } from "./BoardSizeSelector";

interface GameSettingsProps {
  gameSettings: GameSettingsType;
  onNewGame: () => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onPlayerSymbolSwitch: () => void;
  onBoardSizeChange: (size: BoardSize) => void;
  isGameActive: boolean;
}

export function GameSettings({
  gameSettings,
  onNewGame,
  onDifficultyChange,
  onPlayerSymbolSwitch,
  onBoardSizeChange,
  isGameActive,
}: GameSettingsProps) {
  const difficultyColors = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5" />
          Game Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* New Game Button */}
        <Button
          onClick={onNewGame}
          className="w-full"
          size="lg"
          variant={isGameActive ? "outline" : "default"}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          New Game
        </Button>

        <Separator />

        {/* Difficulty Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Difficulty</label>
            <Badge
              variant="secondary"
              className={difficultyColors[gameSettings.difficulty]}
            >
              {gameSettings.difficulty.toUpperCase()}
            </Badge>
          </div>

          <div className="flex space-x-2">
            <Button
              variant={
                gameSettings.difficulty === "easy" ? "default" : "outline"
              }
              size="sm"
              onClick={() => onDifficultyChange("easy")}
              className="flex-1"
            >
              Easy
            </Button>
            <Button
              variant={
                gameSettings.difficulty === "hard" ? "default" : "outline"
              }
              size="sm"
              onClick={() => onDifficultyChange("hard")}
              className="flex-1"
            >
              Hard
            </Button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            {gameSettings.difficulty === "easy"
              ? "AI makes random moves - good for beginners"
              : "AI uses minimax algorithm - challenging!"}
          </div>
        </div>

        <Separator />

        {/* Player Symbol Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">You play as</label>
            <div className="flex items-center space-x-2">
              <span
                className={`font-bold ${
                  gameSettings.playerSymbol === "X"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-400"
                }`}
              >
                X
              </span>
              <Switch
                checked={gameSettings.playerSymbol === "O"}
                onCheckedChange={onPlayerSymbolSwitch}
              />
              <span
                className={`font-bold ${
                  gameSettings.playerSymbol === "O"
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-400"
                }`}
              >
                O
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            X always goes first, O goes second
          </div>
        </div>

        <Separator />

        {/* Board Size Selection */}
        <BoardSizeSelector
          currentSize={gameSettings.boardSize}
          onSizeChange={onBoardSizeChange}
        />
      </CardContent>
    </Card>
  );
}
