"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import type { MovePosition } from '../schema/node.types';

interface CanvasDropZoneProps {
    parentId: string;
    position?: MovePosition;
    index?: number;
    isEmpty?: boolean;
}

export const CanvasDropZone = ({
    parentId,
    position = 'inside',
    index,
    isEmpty = false,
}: CanvasDropZoneProps) => {
    const id = `drop:${parentId}:${position}:${index ?? 'end'}`;
    const { isOver, setNodeRef } = useDroppable({
        id,
        data: {
            kind: 'canvas-drop-zone',
            parentId,
            position,
            index,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "transition-colors",
                isEmpty
                    ? "min-h-16 border border-dashed border-slate-300 bg-slate-50/70 flex items-center justify-center text-xs text-slate-400"
                    : "h-3",
                isOver && "border-blue-500 bg-blue-50 text-blue-500"
            )}
        >
            {isEmpty ? 'Drop component here' : null}
        </div>
    );
};
