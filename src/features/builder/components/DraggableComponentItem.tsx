"use client";

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { LucideIcon } from 'lucide-react';
import type { NodeType } from '../schema/node.types';

interface DraggableComponentItemProps {
    type: NodeType;
    label: string;
    icon: LucideIcon;
    onAdd: (type: NodeType) => void;
}

export const DraggableComponentItem = ({
    type,
    label,
    icon: Icon,
    onAdd,
}: DraggableComponentItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: `palette:${type}`,
        data: {
            kind: 'palette',
            type,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.55 : 1,
    };

    return (
        <button
            ref={setNodeRef}
            type="button"
            onClick={() => onAdd(type)}
            className="flex flex-col items-center justify-center p-4 bg-[#1c2128] hover:bg-[#282f39] border border-[#282f39] rounded-lg transition-colors gap-2 group touch-none"
            style={style}
            {...listeners}
            {...attributes}
        >
            <div className="p-2 rounded-full bg-[#2d333b] group-hover:bg-[#373e47] text-white">
                <Icon size={20} />
            </div>
            <span className="text-xs font-medium text-[#9da8b9] group-hover:text-white">{label}</span>
        </button>
    );
};
