import {
  Board,
  Player,
  Move,
  Difficulty,
  MinimaxResult,
  BoardSize,
} from "@/types/game";
import {
  getAvailableMoves,
  makeMove,
  evaluateBoard,
  isGameOver,
  getOpponent,
  getRandomMove,
  getCenterPosition,
  getCornerPositions,
  isValidMove,
} from "@/utils/gameLogic";

/**
 * AI Engine for TicTacToe with Easy and Hard difficulty modes
 */

export class TicTacToeAI {
  private positionsEvaluated: number = 0;
  private startTime: number = 0;
  private maxThinkingTime: number = 500; // 500ms max - much faster
  private timeoutReached: boolean = false;

  /**
   * Gets the best move for the AI based on difficulty level
   */
  public getBestMove(
    board: Board,
    aiPlayer: Player,
    difficulty: Difficulty
  ): {
    move: Move | null;
    metrics: {
      positionsEvaluated: number;
      thinkingTime: number;
      lastMoveScore: number;
    };
  } {
    this.positionsEvaluated = 0;
    this.startTime = performance.now();
    this.timeoutReached = false;

    let move: Move | null = null;
    let score = 0;

    const boardSize = board.length;

    if (difficulty === "easy") {
      move = this.getEasyMove(board);
      score = 0; // Random moves don't have scores
    } else {
      // For larger boards, use optimized strategy with early return
      if (boardSize > 3) {
        move = this.getOptimizedMove(board, aiPlayer);
        score = 0;
      } else {
        const result = this.getHardMove(board, aiPlayer);
        move = result.move;
        score = result.score;
      }
    }

    const thinkingTime = performance.now() - this.startTime;

    // Log AI decision for debugging
    console.log(`🤖 AI (${difficulty.toUpperCase()}) Decision:`);
    console.log(
      `   Move: ${move ? `[${move.row}, ${move.col}]` : "No move available"}`
    );
    console.log(`   Score: ${score}`);
    console.log(`   Positions evaluated: ${this.positionsEvaluated}`);
    console.log(`   Thinking time: ${thinkingTime.toFixed(2)}ms`);

    return {
      move,
      metrics: {
        positionsEvaluated: this.positionsEvaluated,
        thinkingTime: Math.round(thinkingTime),
        lastMoveScore: score,
      },
    };
  }

  /**
   * Easy mode: Random moves with occasional mistakes
   */
  private getEasyMove(board: Board): Move | null {
    this.positionsEvaluated = 1; // Just checking available moves
    const boardSize = board.length as BoardSize;

    const availableMoves = getAvailableMoves(board);

    if (availableMoves.length === 0) {
      return null;
    }

    // 70% chance of random move, 30% chance of slightly better move
    if (Math.random() < 0.7) {
      return getRandomMove(board);
    }

    // Slightly better logic: prefer center, then corners, then edges
    const centerPos = getCenterPosition(boardSize);
    if (isValidMove(board, centerPos.row, centerPos.col)) {
      return centerPos;
    }

    const cornerPositions = getCornerPositions(boardSize);
    const availableCorners = cornerPositions.filter((pos) =>
      isValidMove(board, pos.row, pos.col)
    );

    if (availableCorners.length > 0) {
      const randomCorner = Math.floor(Math.random() * availableCorners.length);
      return availableCorners[randomCorner];
    }

    // Fallback to random move
    return getRandomMove(board);
  }

  /**
   * Hard mode: Full minimax implementation with depth limiting for performance
   */
  private getHardMove(
    board: Board,
    aiPlayer: Player
  ): { move: Move | null; score: number } {
    const boardSize = board.length;
    const availableMoves = getAvailableMoves(board);

    // Much more aggressive depth limiting based on board size
    let maxDepth: number;
    if (boardSize === 3) {
      maxDepth = 9; // Full depth for 3x3
    } else if (boardSize === 4) {
      maxDepth = availableMoves.length > 8 ? 2 : 3; // Very limited for 4x4
    } else if (boardSize === 5) {
      maxDepth = 2; // Minimal depth for 5x5
    } else {
      // For boards larger than 5x5, use optimized heuristic instead
      return { move: this.getOptimizedMove(board, aiPlayer), score: 0 };
    }

    const result = this.minimax(
      board,
      0,
      true,
      aiPlayer,
      -Infinity,
      Infinity,
      maxDepth
    );
    return {
      move: result.move,
      score: result.score,
    };
  }

  /**
   * Optimized move selection for larger boards using heuristics
   */
  private getOptimizedMove(board: Board, aiPlayer: Player): Move | null {
    const boardSize = board.length as BoardSize;
    const availableMoves = getAvailableMoves(board);
    const opponent = getOpponent(aiPlayer);

    if (availableMoves.length === 0) return null;

    // Early game strategy for larger boards
    if (availableMoves.length === boardSize * boardSize) {
      // First move - take center
      return getCenterPosition(boardSize);
    }

    // 1. Check for immediate winning moves (highest priority)
    for (const move of availableMoves) {
      const testBoard = makeMove(board, move.row, move.col, aiPlayer);
      if (isGameOver(testBoard)) {
        const score = evaluateBoard(testBoard, aiPlayer);
        if (score > 0) {
          // Only if it's a winning move
          return move;
        }
      }
    }

    // 2. Check for blocking opponent's winning moves (second priority)
    for (const move of availableMoves) {
      const testBoard = makeMove(board, move.row, move.col, opponent);
      if (isGameOver(testBoard)) {
        const score = evaluateBoard(testBoard, aiPlayer);
        if (score < 0) {
          // Block opponent's winning move
          return move;
        }
      }
    }

    // 3. Look for moves that create multiple winning opportunities
    const strategicMoves = this.findStrategicMoves(
      board,
      aiPlayer,
      availableMoves
    );
    if (strategicMoves.length > 0) {
      return strategicMoves[Math.floor(Math.random() * strategicMoves.length)];
    }

    // 4. Strategic positions: center > corners > edges
    const center = getCenterPosition(boardSize);
    if (isValidMove(board, center.row, center.col)) {
      return center;
    }

    const corners = getCornerPositions(boardSize);
    const availableCorners = corners.filter((pos) =>
      isValidMove(board, pos.row, pos.col)
    );
    if (availableCorners.length > 0) {
      return availableCorners[
        Math.floor(Math.random() * availableCorners.length)
      ];
    }

    // 5. Fallback to random move from available moves
    return getRandomMove(board);
  }

  /**
   * Find strategic moves that create multiple winning opportunities
   */
  private findStrategicMoves(
    board: Board,
    aiPlayer: Player,
    availableMoves: Move[]
  ): Move[] {
    const strategicMoves: Move[] = [];

    for (const move of availableMoves) {
      const testBoard = makeMove(board, move.row, move.col, aiPlayer);
      let winningOpportunities = 0;

      // Count how many ways this move could lead to a win
      const nextMoves = getAvailableMoves(testBoard);
      for (const nextMove of nextMoves) {
        const nextTestBoard = makeMove(
          testBoard,
          nextMove.row,
          nextMove.col,
          aiPlayer
        );
        if (
          isGameOver(nextTestBoard) &&
          evaluateBoard(nextTestBoard, aiPlayer) > 0
        ) {
          winningOpportunities++;
        }
      }

      // If this move creates multiple winning opportunities, it's strategic
      if (winningOpportunities >= 2) {
        strategicMoves.push(move);
      }
    }

    return strategicMoves;
  }

  /**
   * Minimax algorithm with alpha-beta pruning and depth limiting
   * @param board Current board state
   * @param depth Current depth in the game tree
   * @param isMaximizing Whether this is a maximizing player's turn
   * @param aiPlayer The AI player symbol
   * @param alpha Alpha value for pruning
   * @param beta Beta value for pruning
   * @param maxDepth Maximum search depth
   */
  private minimax(
    board: Board,
    depth: number,
    isMaximizing: boolean,
    aiPlayer: Player,
    alpha: number,
    beta: number,
    maxDepth: number = 9
  ): MinimaxResult {
    this.positionsEvaluated++;

    // Early time limit check - check every 100 evaluations for performance
    if (
      this.positionsEvaluated % 100 === 0 &&
      performance.now() - this.startTime > this.maxThinkingTime
    ) {
      this.timeoutReached = true;
      return {
        score: 0,
        move: null,
        positionsEvaluated: this.positionsEvaluated,
      };
    }

    // Depth limit reached
    if (depth >= maxDepth) {
      return {
        score: evaluateBoard(board, aiPlayer), // Use existing evaluateBoard function
        move: null,
        positionsEvaluated: this.positionsEvaluated,
      };
    }

    // Base case: game is over
    if (isGameOver(board)) {
      const score = evaluateBoard(board, aiPlayer);
      // Prefer winning quickly and losing slowly
      const adjustedScore = score > 0 ? score - depth : score + depth;
      return {
        score: adjustedScore,
        move: null,
        positionsEvaluated: this.positionsEvaluated,
      };
    }

    const availableMoves = getAvailableMoves(board);

    if (availableMoves.length === 0) {
      return {
        score: 0, // Draw
        move: null,
        positionsEvaluated: this.positionsEvaluated,
      };
    }

    let bestMove: Move | null = null;

    if (isMaximizing) {
      let maxEval = -Infinity;

      for (const move of availableMoves) {
        // Early termination if timeout reached
        if (this.timeoutReached) break;

        const newBoard = makeMove(board, move.row, move.col, aiPlayer);
        const eval_ = this.minimax(
          newBoard,
          depth + 1,
          false,
          aiPlayer,
          alpha,
          beta,
          maxDepth
        );

        if (eval_.score > maxEval) {
          maxEval = eval_.score;
          bestMove = move;
        }

        alpha = Math.max(alpha, eval_.score);
        if (beta <= alpha) {
          break; // Alpha-beta pruning
        }
      }

      return {
        score: maxEval,
        move: bestMove,
        positionsEvaluated: this.positionsEvaluated,
      };
    } else {
      let minEval = Infinity;
      const opponent = getOpponent(aiPlayer);

      for (const move of availableMoves) {
        // Early termination if timeout reached
        if (this.timeoutReached) break;

        const newBoard = makeMove(board, move.row, move.col, opponent);
        const eval_ = this.minimax(
          newBoard,
          depth + 1,
          true,
          aiPlayer,
          alpha,
          beta,
          maxDepth
        );

        if (eval_.score < minEval) {
          minEval = eval_.score;
          bestMove = move;
        }

        beta = Math.min(beta, eval_.score);
        if (beta <= alpha) {
          break; // Alpha-beta pruning
        }
      }

      return {
        score: minEval,
        move: bestMove,
        positionsEvaluated: this.positionsEvaluated,
      };
    }
  }

  /**
   * Analyzes the current board position and returns strategic insights
   */
  public analyzePosition(
    board: Board,
    aiPlayer: Player
  ): {
    evaluation: number;
    bestMoves: Move[];
    strategy: string;
  } {
    this.positionsEvaluated = 0;
    const availableMoves = getAvailableMoves(board);

    if (availableMoves.length === 0) {
      return {
        evaluation: 0,
        bestMoves: [],
        strategy: "Game over",
      };
    }

    // Evaluate all possible moves
    const moveEvaluations = availableMoves.map((move) => {
      const newBoard = makeMove(board, move.row, move.col, aiPlayer);
      const score = this.minimax(
        newBoard,
        0,
        false,
        aiPlayer,
        -Infinity,
        Infinity
      ).score;
      return { move, score };
    });

    // Sort moves by score (best first)
    moveEvaluations.sort((a, b) => b.score - a.score);

    const bestScore = moveEvaluations[0].score;
    const bestMoves = moveEvaluations
      .filter((evaluation) => evaluation.score === bestScore)
      .map((evaluation) => evaluation.move);

    // Determine strategy based on evaluation
    let strategy = "";
    if (bestScore > 5) {
      strategy = "Winning position - going for the kill!";
    } else if (bestScore > 0) {
      strategy = "Slight advantage - playing carefully";
    } else if (bestScore === 0) {
      strategy = "Equal position - aiming for draw";
    } else {
      strategy = "Defending - trying to avoid loss";
    }

    return {
      evaluation: bestScore,
      bestMoves,
      strategy,
    };
  }

  /**
   * Resets the AI metrics
   */
  public reset(): void {
    this.positionsEvaluated = 0;
    this.startTime = 0;
  }
}

// Export a singleton instance
export const aiEngine = new TicTacToeAI();
