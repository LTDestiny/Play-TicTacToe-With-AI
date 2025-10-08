"use client";

import { BoardSize } from "@/types/game";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface BoardSizeSelectorProps {
  currentSize: BoardSize;
  onSizeChange: (size: BoardSize) => void;
}

export function BoardSizeSelector({
  currentSize,
  onSizeChange,
}: BoardSizeSelectorProps) {
  const [customSize, setCustomSize] = useState<string>(currentSize.toString());

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Board Size</label>
        <Badge
          variant="secondary"
          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
        >
          {currentSize}x{currentSize}
        </Badge>
      </div>

      {/* Quick Size Buttons - Row 1 */}
      <div className="grid grid-cols-4 gap-2">
        {([3, 4, 5, 6] as BoardSize[]).map((size) => (
          <Button
            key={size}
            variant={currentSize === size ? "default" : "outline"}
            size="sm"
            onClick={() => onSizeChange(size)}
            className="text-xs"
          >
            {size}x{size}
          </Button>
        ))}
      </div>

      {/* Quick Size Buttons - Row 2 */}
      <div className="grid grid-cols-4 gap-2">
        {([7, 8, 9, 10] as BoardSize[]).map((size) => (
          <Button
            key={size}
            variant={currentSize === size ? "default" : "outline"}
            size="sm"
            onClick={() => onSizeChange(size)}
            className="text-xs"
          >
            {size}x{size}
          </Button>
        ))}
      </div>

      {/* Custom Size Input */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
          Custom Size (3-10):
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            min="3"
            max="10"
            value={customSize}
            onChange={(e) => setCustomSize(e.target.value)}
            className="flex-1 h-8 px-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="3-10"
          />
          <Button
            size="sm"
            onClick={() => {
              const size = parseInt(customSize);
              if (size >= 3 && size <= 10) {
                onSizeChange(size as BoardSize);
              }
            }}
            className="text-xs px-3"
          >
            Apply
          </Button>
        </div>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400">
        Larger boards increase game complexity and AI thinking time
      </div>
    </div>
  );
}
