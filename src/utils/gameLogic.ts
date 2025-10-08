import { Board, Player, WinningLine, Move, BoardSize } from "@/types/game";

/**
 * Game logic utilities for TicTacToe with dynamic board sizes
 */

/**
 * Generates all possible winning combinations for a given board size
 * @param size - Board size (3 for 3x3, 4 for 4x4, etc.)
 */
export function generateWinningCombinations(size: BoardSize): WinningLine[] {
  const combinations: WinningLine[] = [];

  // Rows
  for (let row = 0; row < size; row++) {
    const line: [number, number][] = [];
    for (let col = 0; col < size; col++) {
      line.push([row, col]);
    }
    combinations.push(line);
  }

  // Columns
  for (let col = 0; col < size; col++) {
    const line: [number, number][] = [];
    for (let row = 0; row < size; row++) {
      line.push([row, col]);
    }
    combinations.push(line);
  }

  // Main diagonal (top-left to bottom-right)
  const mainDiagonal: [number, number][] = [];
  for (let i = 0; i < size; i++) {
    mainDiagonal.push([i, i]);
  }
  combinations.push(mainDiagonal);

  // Anti-diagonal (top-right to bottom-left)
  const antiDiagonal: [number, number][] = [];
  for (let i = 0; i < size; i++) {
    antiDiagonal.push([i, size - 1 - i]);
  }
  combinations.push(antiDiagonal);

  return combinations;
}

// Legacy winning combinations for 3x3 board (kept for backward compatibility)
export const WINNING_COMBINATIONS: WinningLine[] =
  generateWinningCombinations(3);

/**
 * Creates an empty board with the specified size
 * @param size - Board size (3 for 3x3, 4 for 4x4, etc.)
 */
export function createEmptyBoard(size: BoardSize = 3): Board {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));
}

/**
 * Creates a deep copy of the board
 */
export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

/**
 * Checks if a cell is valid and empty
 */
export function isValidMove(board: Board, row: number, col: number): boolean {
  const size = board.length;
  return (
    row >= 0 && row < size && col >= 0 && col < size && board[row][col] === null
  );
}

/**
 * Makes a move on the board (returns new board, doesn't mutate)
 */
export function makeMove(
  board: Board,
  row: number,
  col: number,
  player: Player
): Board {
  if (!isValidMove(board, row, col)) {
    throw new Error(`Invalid move: position [${row}, ${col}] is not available`);
  }

  const newBoard = cloneBoard(board);
  newBoard[row][col] = player;
  return newBoard;
}

/**
 * Gets all available moves on the board
 */
export function getAvailableMoves(board: Board): Move[] {
  const moves: Move[] = [];
  const size = board.length;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] === null) {
        moves.push({ row, col });
      }
    }
  }

  return moves;
}

/**
 * Checks if there's a winner and returns the winning line
 */
export function checkWinner(board: Board): {
  winner: Player | null;
  winningLine: WinningLine | null;
} {
  const size = board.length;
  const winningCombinations = generateWinningCombinations(size as BoardSize);

  for (const combination of winningCombinations) {
    // Check if all cells in the combination have the same non-null value
    const firstCell = board[combination[0][0]][combination[0][1]];

    if (
      firstCell &&
      combination.every(([row, col]) => board[row][col] === firstCell)
    ) {
      return {
        winner: firstCell,
        winningLine: combination,
      };
    }
  }

  return {
    winner: null,
    winningLine: null,
  };
}

/**
 * Checks if the board is full (draw condition)
 */
export function isBoardFull(board: Board): boolean {
  return board.every((row) => row.every((cell) => cell !== null));
}

/**
 * Checks if the game is over (win or draw)
 */
export function isGameOver(board: Board): boolean {
  const { winner } = checkWinner(board);
  return winner !== null || isBoardFull(board);
}

/**
 * Gets the opposite player
 */
export function getOpponent(player: Player): Player {
  return player === "X" ? "O" : "X";
}

/**
 * Evaluates the board for a specific player (used in minimax)
 * Returns: 10 for win, -10 for loss, 0 for draw/ongoing
 */
export function evaluateBoard(board: Board, maximizingPlayer: Player): number {
  const { winner } = checkWinner(board);

  if (winner === maximizingPlayer) {
    return 10;
  } else if (winner === getOpponent(maximizingPlayer)) {
    return -10;
  } else {
    return 0; // Draw or game ongoing
  }
}

/**
 * Gets a random move from available moves (for easy AI)
 */
export function getRandomMove(board: Board): Move | null {
  const availableMoves = getAvailableMoves(board);

  if (availableMoves.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
}

/**
 * Converts board position to display format
 */
export function positionToString(row: number, col: number): string {
  return `[${row}, ${col}]`;
}

/**
 * Gets board status as string for debugging
 */
export function getBoardString(board: Board): string {
  return board
    .map((row) => row.map((cell) => cell || "_").join(" "))
    .join("\n");
}

/**
 * Checks if a position is in the winning line
 */
export function isWinningPosition(
  row: number,
  col: number,
  winningLine: WinningLine | null
): boolean {
  if (!winningLine) return false;

  return winningLine.some(([r, c]) => r === row && c === col);
}

/**
 * Counts the number of symbols in a line
 */
export function countSymbolsInLine(
  board: Board,
  line: WinningLine,
  player: Player
): number {
  return line.reduce((count, [row, col]) => {
    return count + (board[row][col] === player ? 1 : 0);
  }, 0);
}

/**
 * Checks if a line is empty (for blocking logic)
 */
export function isLineEmpty(board: Board, line: WinningLine): boolean {
  return line.every(([row, col]) => board[row][col] === null);
}

/**
 * Gets the center position of the board
 */
export function getCenterPosition(boardSize: BoardSize = 3): Move {
  const center = Math.floor(boardSize / 2);
  return { row: center, col: center };
}

/**
 * Gets corner positions
 */
export function getCornerPositions(boardSize: BoardSize = 3): Move[] {
  const lastIndex = boardSize - 1;
  return [
    { row: 0, col: 0 },
    { row: 0, col: lastIndex },
    { row: lastIndex, col: 0 },
    { row: lastIndex, col: lastIndex },
  ];
}

/**
 * Gets edge positions (not corners or center)
 */
export function getEdgePositions(boardSize: BoardSize = 3): Move[] {
  const edges: Move[] = [];
  const lastIndex = boardSize - 1;

  // Top and bottom edges (excluding corners)
  for (let col = 1; col < lastIndex; col++) {
    edges.push({ row: 0, col });
    edges.push({ row: lastIndex, col });
  }

  // Left and right edges (excluding corners)
  for (let row = 1; row < lastIndex; row++) {
    edges.push({ row, col: 0 });
    edges.push({ row, col: lastIndex });
  }

  return edges;
}
