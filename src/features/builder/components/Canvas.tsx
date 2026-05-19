"use client";
import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useBuilderStore } from '../store/builder.store';
import { NodeRenderer } from './NodeRenderer';
import type { MoveTarget, NodeType } from '../schema/node.types';

interface BuilderDndContextProps {
    children: React.ReactNode;
}

interface PaletteDragData {
    kind: 'palette';
    type: NodeType;
}

interface CanvasDropData {
    kind: 'canvas-drop-zone';
    parentId: string;
    position: MoveTarget['position'];
    index?: number;
}

function isPaletteDragData(data: unknown): data is PaletteDragData {
    return Boolean(data && typeof data === 'object' && (data as PaletteDragData).kind === 'palette');
}

function isCanvasDropData(data: unknown): data is CanvasDropData {
    return Boolean(data && typeof data === 'object' && (data as CanvasDropData).kind === 'canvas-drop-zone');
}

export const BuilderDndContext = ({ children }: BuilderDndContextProps) => {
    const addNode = useBuilderStore((state) => state.addNode);
    const moveNode = useBuilderStore((state) => state.moveNode);
    const schema = useBuilderStore((state) => state.schema);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        if (isPaletteDragData(activeData)) {
            if (isCanvasDropData(overData)) {
                const insertIndex = getDropInsertIndex(overData);
                addNode(overData.parentId, activeData.type, undefined, insertIndex);
                return;
            }

            addNode(String(over.id), activeData.type);
            return;
        }

        if (isCanvasDropData(overData)) {
            const target = getMoveTarget(overData);
            if (target) {
                moveNode(String(active.id), target);
            }
            return;
        }

        moveNode(String(active.id), String(over.id));
    }

    function getDropInsertIndex(overData: CanvasDropData) {
        if (overData.position === 'before') return overData.index;
        if (overData.position === 'after' && typeof overData.index === 'number') {
            return overData.index + 1;
        }
        return undefined;
    }

    function getMoveTarget(overData: CanvasDropData): MoveTarget | null {
        if (overData.position === 'inside') {
            return {
                overId: overData.parentId,
                position: 'inside',
            };
        }

        const parent = schema[overData.parentId];
        if (!parent || typeof overData.index !== 'number') return null;

        const overId = parent.children[overData.index];
        if (!overId) {
            return {
                overId: overData.parentId,
                position: 'inside',
            };
        }

        return {
            overId,
            position: overData.position,
        };
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            {children}
        </DndContext>
    );
};

export const Canvas = () => {
    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex-1 p-8 bg-gray-100 overflow-auto">
                <div className="bg-white min-h-[500px] shadow-sm">
                    <NodeRenderer nodeId="root" />
                </div>
            </div>
        </div>
    );
};
