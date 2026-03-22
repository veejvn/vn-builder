
import React from 'react';
import { useBuilderStore } from '../store/builder.store';
import { ChevronRight, ChevronDown, Box, Type, MousePointer2, LayoutTemplate, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NodeType } from '../schema/node.types';

interface TreeNodeProps {
    nodeId: string;
    depth?: number;
}

const getNodeIcon = (type: NodeType) => {
    switch (type) {
        case 'text': return <Type size={14} />;
        case 'button': return <MousePointer2 size={14} />;
        case 'container':
        case 'flex':
        case 'page':
            return <LayoutTemplate size={14} />;
        default: return <Box size={14} />;
    }
};

const TreeNode = ({ nodeId, depth = 0 }: TreeNodeProps) => {
    const schema = useBuilderStore((state) => state.schema);
    const activeNodeId = useBuilderStore((state) => state.activeNodeId);
    const deleteNode = useBuilderStore((state) => state.deleteNode);
    const selectNode = useBuilderStore((state) => state.selectNode);

    const node = schema[nodeId];
    if (!node) return null;

    const isSelected = activeNodeId === nodeId;
    const isRoot = nodeId === 'root';
    const hasChildren = node.children && node.children.length > 0;
    // For now, always expanded. In future, add local state for collapse/expand.
    const isExpanded = true;

    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(nodeId);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete this ${node.type}?`)) {
            deleteNode(nodeId);
        }
    };

    return (
        <div>
            <div
                className={cn(
                    "flex items-center gap-2 py-1.5 px-2 cursor-pointer hover:bg-[#1c2128] text-sm transition-colors rounded-sm select-none group",
                    isSelected ? "bg-[#282f39] text-white font-medium" : "text-[#9da8b9]"
                )}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
                onClick={handleSelect}
            >
                <span className="opacity-70">
                    {getNodeIcon(node.type)}
                </span>
                <span className="flex-1 truncate">
                    {node.type} <span className="text-[10px] opacity-50 ml-1">#{node.id.slice(0, 4)}</span>
                </span>

                {!isRoot && (
                    <button
                        onClick={handleDelete}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#373e47] rounded transition-all text-[#9da8b9] hover:text-red-400"
                    >
                        <Trash2 size={12} />
                    </button>
                )}
            </div>

            {hasChildren && isExpanded && (
                <div>
                    {node.children.map(childId => (
                        <TreeNode key={childId} nodeId={childId} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

export const LayoutTree = () => {
    return (
        <div className="flex flex-col h-full bg-[#111418]">
            <div className="p-3 border-b border-[#282f39] text-xs font-bold text-[#9da8b9] uppercase tracking-wider">
                Layers
            </div>
            <div className="flex-1 overflow-auto p-2">
                <TreeNode nodeId="root" />
            </div>
        </div>
    );
};
