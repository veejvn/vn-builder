
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableNodeProps {
    id: string;
    children: React.ReactNode;
    disabled?: boolean;
}

export const SortableNode = ({ id, children, disabled = false }: SortableNodeProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id, disabled });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: 'relative' as const,
    };

    return (
        <div ref={setNodeRef} style={style} className="group">
            {!disabled && (
                <button
                    type="button"
                    title="Drag node"
                    aria-label="Drag node"
                    className="absolute right-1 top-1 z-20 inline-flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-white/90 text-slate-500 opacity-0 shadow-sm transition hover:border-blue-300 hover:text-blue-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 group-hover:opacity-100"
                    onClick={(event) => event.stopPropagation()}
                    onPointerDown={(event) => event.stopPropagation()}
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
            )}
            {children}
        </div>
    );
};
