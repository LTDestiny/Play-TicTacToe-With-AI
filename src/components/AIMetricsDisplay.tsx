"use client";

import { AIMetrics, Difficulty } from "@/types/game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, Target, TrendingUp } from "lucide-react";

interface AIMetricsDisplayProps {
  aiMetrics: AIMetrics;
  difficulty: Difficulty;
  isAIThinking: boolean;
}

export function AIMetricsDisplay({
  aiMetrics,
  difficulty,
  isAIThinking,
}: AIMetricsDisplayProps) {
  const getScoreInterpretation = (
    score: number
  ): { text: string; color: string } => {
    if (score > 5) {
      return { text: "Winning", color: "text-green-600 dark:text-green-400" };
    } else if (score > 0) {
      return { text: "Advantage", color: "text-blue-600 dark:text-blue-400" };
    } else if (score === 0) {
      return { text: "Equal", color: "text-yellow-600 dark:text-yellow-400" };
    } else {
      return { text: "Defending", color: "text-red-600 dark:text-red-400" };
    }
  };

  const scoreInterpretation = getScoreInterpretation(aiMetrics.lastMoveScore);

  if (difficulty === "easy") {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-5 h-5" />
            AI Status
            <Badge
              variant="secondary"
              className="text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-300"
            >
              EASY
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-center">
            {isAIThinking ? (
              <>
                <div className="w-8 h-8 mx-auto border-b-2 border-green-600 rounded-full animate-spin"></div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Making random move...
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                AI uses random strategy in easy mode.
                <br />
                No advanced metrics available.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="w-5 h-5" />
          AI Analytics
          <Badge
            variant="secondary"
            className="text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-300"
          >
            HARD
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAIThinking ? (
          <div className="space-y-3 text-center">
            <div className="w-8 h-8 mx-auto border-b-2 border-red-600 rounded-full animate-spin"></div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Analyzing positions...
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Using minimax algorithm with alpha-beta pruning
            </div>
          </div>
        ) : (
          <>
            {/* Last Move Analysis */}
            {aiMetrics.positionsEvaluated > 0 && (
              <div className="space-y-3">
                <div className="mb-2 text-sm font-medium">
                  Last Move Analysis
                </div>

                {/* Position Evaluation Score */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <Target className="w-3 h-3" />
                    Position Score
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium ${scoreInterpretation.color}`}
                    >
                      {aiMetrics.lastMoveScore}
                    </span>
                    <Badge
                      variant="outline"
                      className={scoreInterpretation.color}
                    >
                      {scoreInterpretation.text}
                    </Badge>
                  </div>
                </div>

                {/* Positions Evaluated */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-3 h-3" />
                    Positions Analyzed
                  </span>
                  <span className="font-medium">
                    {aiMetrics.positionsEvaluated.toLocaleString()}
                  </span>
                </div>

                {/* Thinking Time */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <Clock className="w-3 h-3" />
                    Thinking Time
                  </span>
                  <span className="font-medium">
                    {aiMetrics.thinkingTime}ms
                  </span>
                </div>

                {/* Performance Metrics */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <div>
                      Rate:{" "}
                      {aiMetrics.thinkingTime > 0
                        ? Math.round(
                            (aiMetrics.positionsEvaluated /
                              aiMetrics.thinkingTime) *
                              1000
                          ).toLocaleString()
                        : "0"}{" "}
                      positions/sec
                    </div>
                    <div>Algorithm: Minimax with α-β pruning</div>
                  </div>
                </div>

                {/* Score Explanation */}
                <div className="p-2 mt-3 text-xs rounded bg-gray-50 dark:bg-gray-800">
                  <div className="mb-1 font-medium">Score Guide:</div>
                  <div className="space-y-0.5 text-gray-600 dark:text-gray-400">
                    <div>+10: AI can win</div>
                    <div>0: Draw or neutral</div>
                    <div>-10: Player can win</div>
                  </div>
                </div>
              </div>
            )}

            {/* No data state */}
            {aiMetrics.positionsEvaluated === 0 && (
              <div className="text-sm text-center text-gray-500 dark:text-gray-400">
                AI metrics will appear after the first move.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
