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

export const Canvas = () => {
    const moveNode = useBuilderStore((state) => state.moveNode);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            moveNode(active.id as string, over.id as string);
        }
    }

    return (
        <div className="flex flex-col h-full w-full">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="flex-1 p-8 bg-gray-100 overflow-auto">
                    <div className="bg-white min-h-[500px] shadow-sm">
                        <NodeRenderer nodeId="root" />
                    </div>
                </div>
            </DndContext>
        </div>
    );
};
