
import React from 'react';
import { useBuilderStore } from '../store/builder.store';
import { getComponent } from '../registry';
import { SortableNode } from './SortableNode';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { BuilderNode } from '../schema/node.types';

interface NodeRendererProps {
    nodeId: string;
}

export const NodeRenderer = ({ nodeId }: NodeRendererProps) => {
    const node = useBuilderStore((state) => state.schema[nodeId]);
    const activeNodeId = useBuilderStore((state) => state.activeNodeId);
    const selectNode = useBuilderStore((state) => state.selectNode);

    if (!node) return null;

    const Component = getComponent(node.type);
    const isSelected = activeNodeId === nodeId;

    // Handler for selection (stop propagation to prevent selecting parent)
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(nodeId);
    };

    // Render children
    const renderChildren = () => {
        if (!node.children || node.children.length === 0) return null;

        return (
            <SortableContext items={node.children} strategy={verticalListSortingStrategy}>
                {node.children.map((childId) => (
                    <NodeRenderer key={childId} nodeId={childId} />
                ))}
            </SortableContext>
        );
    };

    const content = (
        <div
            onClick={handleClick}
            className={cn(
                "relative group",
                isSelected && "ring-2 ring-blue-500 z-10",
                !isSelected && "hover:ring-1 hover:ring-blue-300"
            )}
        >
            <Component {...node.props}>
                {renderChildren()}
            </Component>
        </div>
    );

    // If it's the root node, we don't make it sortable/draggable (usually)
    // Or if it's the top level page container.
    if (node.id === 'root') {
        return content;
    }

    return (
        <SortableNode id={nodeId}>
            {content}
        </SortableNode>
    );
};
