"use client";

import { Board, Player, WinningLine } from "@/types/game";
import { isWinningPosition } from "@/utils/gameLogic";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GameBoardProps {
  board: Board;
  onCellClick: (row: number, col: number) => void;
  isPlayerTurn: boolean;
  isAIThinking: boolean;
  winningLine: WinningLine | null;
  disabled?: boolean;
}

export function GameBoard({
  board,
  onCellClick,
  isPlayerTurn,
  isAIThinking,
  winningLine,
  disabled = false,
}: GameBoardProps) {
  const handleCellClick = (row: number, col: number) => {
    if (disabled || !isPlayerTurn || isAIThinking || board[row][col] !== null) {
      return;
    }
    onCellClick(row, col);
  };

  const getCellClasses = (row: number, col: number, cell: Player | null) => {
    const isWinning = isWinningPosition(row, col, winningLine);
    const isEmpty = cell === null;
    const isClickable = isEmpty && isPlayerTurn && !isAIThinking && !disabled;
    const boardSize = board.length;

    return cn(
      // Base styles - dynamic sizing based on board size
      boardSize <= 3
        ? "h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24"
        : boardSize <= 5
        ? "h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20"
        : boardSize <= 7
        ? "h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16"
        : "h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12",

      "border-2 border-gray-300 dark:border-gray-600",
      "flex items-center justify-center",

      // Dynamic text size based on board size
      boardSize <= 3
        ? "text-2xl sm:text-3xl md:text-4xl font-bold"
        : boardSize <= 5
        ? "text-xl sm:text-2xl md:text-3xl font-bold"
        : boardSize <= 7
        ? "text-lg sm:text-xl md:text-2xl font-bold"
        : "text-sm sm:text-lg md:text-xl font-bold",

      "transition-all duration-200 ease-in-out",
      "relative overflow-hidden",

      // Hover and click states
      isClickable && [
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "hover:border-blue-400",
        "cursor-pointer",
        "active:scale-95",
      ],

      // Disabled state
      !isClickable && isEmpty && ["cursor-not-allowed", "opacity-60"],

      // Winning position highlight
      isWinning && [
        "bg-green-100 dark:bg-green-900/30",
        "border-green-500",
        "animate-pulse",
      ],

      // Player X styling
      cell === "X" && [
        "text-blue-600 dark:text-blue-400",
        !isWinning && "bg-blue-50 dark:bg-blue-950/30",
      ],

      // Player O styling
      cell === "O" && [
        "text-red-600 dark:text-red-400",
        !isWinning && "bg-red-50 dark:bg-red-950/30",
      ],

      // Border radius for grid corners - dynamic based on board size
      row === 0 && col === 0 && "rounded-tl-lg",
      row === 0 && col === boardSize - 1 && "rounded-tr-lg",
      row === boardSize - 1 && col === 0 && "rounded-bl-lg",
      row === boardSize - 1 && col === boardSize - 1 && "rounded-br-lg"
    );
  };

  const getCellContent = (cell: Player | null) => {
    if (cell === null) return "";

    return <span className="relative z-10 select-none">{cell}</span>;
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Game Status */}
      <div className="text-center">
        {isAIThinking ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
              AI is thinking...
            </span>
          </div>
        ) : (
          <div className="text-lg font-medium">
            {isPlayerTurn ? (
              <span className="text-blue-600 dark:text-blue-400">
                Your turn
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400">
                AI&apos;s turn
              </span>
            )}
          </div>
        )}
      </div>

      {/* Game Board Grid */}
      <div
        className={cn(
          "grid gap-1 p-4 bg-gray-200 dark:bg-gray-700 rounded-xl shadow-lg mx-auto",
          // Dynamic max width based on board size
          board.length <= 3
            ? "max-w-md"
            : board.length <= 5
            ? "max-w-lg"
            : board.length <= 7
            ? "max-w-xl"
            : "max-w-2xl"
        )}
        style={{
          gridTemplateColumns: `repeat(${board.length}, minmax(0, 1fr))`,
          maxWidth: board.length > 7 ? "600px" : undefined,
        }}
        role="grid"
        aria-label={`${board.length}x${board.length} TicTacToe game board`}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Button
              key={`${rowIndex}-${colIndex}`}
              variant="ghost"
              className={getCellClasses(rowIndex, colIndex, cell)}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              disabled={
                disabled || !isPlayerTurn || isAIThinking || cell !== null
              }
              role="gridcell"
              aria-label={
                cell
                  ? `Cell ${rowIndex + 1}, ${colIndex + 1}, occupied by ${cell}`
                  : `Cell ${rowIndex + 1}, ${colIndex + 1}, empty`
              }
            >
              {getCellContent(cell)}

              {/* Winning line animation overlay */}
              {isWinningPosition(rowIndex, colIndex, winningLine) && (
                <div className="absolute inset-0 bg-green-400/20 animate-pulse rounded" />
              )}
            </Button>
          ))
        )}
      </div>

      {/* Game Instructions */}
      <div className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
        {isPlayerTurn &&
          !isAIThinking &&
          !disabled &&
          "Click on an empty cell to make your move"}
        {!isPlayerTurn &&
          !isAIThinking &&
          !disabled &&
          "Wait for the AI to make its move"}
        {disabled && "Game over - Start a new game to play again"}
      </div>
    </div>
  );
}
