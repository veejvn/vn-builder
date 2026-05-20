
import React, { useMemo, useState } from 'react';
import { useBuilderStore } from '../store/builder.store';
import { ChevronRight, ChevronDown, Box, Type, MousePointer2, LayoutTemplate, Trash2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NodeType, type BuilderSchema } from '../schema/node.types';
import { collectDescendantIds } from '../schema/schema.utils';

interface TreeNodeProps {
    nodeId: string;
    depth?: number;
    query: string;
    collapsedNodeIds: Set<string>;
    onToggleCollapse: (nodeId: string) => void;
    isNodeVisible: (nodeId: string) => boolean;
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

const nodeMatchesQuery = (schema: BuilderSchema, nodeId: string, query: string) => {
    if (!query) return true;

    const node = schema[nodeId];
    if (!node) return false;

    const normalizedQuery = query.toLowerCase();
    const idQuery = normalizedQuery.startsWith('#') ? normalizedQuery.slice(1) : normalizedQuery;
    const content = node.props?.content;

    return (
        node.type.toLowerCase().includes(normalizedQuery) ||
        node.id.toLowerCase().startsWith(idQuery) ||
        (typeof content === 'string' && content.toLowerCase().includes(normalizedQuery))
    );
};

const hasMatchingDescendant = (schema: BuilderSchema, nodeId: string, query: string) => {
    return collectDescendantIds(schema, nodeId).some((descendantId) =>
        nodeMatchesQuery(schema, descendantId, query)
    );
};

const TreeNode = ({
    nodeId,
    depth = 0,
    query,
    collapsedNodeIds,
    onToggleCollapse,
    isNodeVisible,
}: TreeNodeProps) => {
    const schema = useBuilderStore((state) => state.schema);
    const activeNodeId = useBuilderStore((state) => state.activeNodeId);
    const deleteNode = useBuilderStore((state) => state.deleteNode);
    const selectNode = useBuilderStore((state) => state.selectNode);

    const node = schema[nodeId];
    if (!node) return null;

    const isSelected = activeNodeId === nodeId;
    const isRoot = nodeId === 'root';
    const hasChildren = node.children && node.children.length > 0;
    const isCollapsed = collapsedNodeIds.has(nodeId);
    const isSearching = query.length > 0;
    const isExpanded = hasChildren && (!isCollapsed || isSearching);
    const visibleChildren = hasChildren ? node.children.filter(isNodeVisible) : [];

    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(nodeId);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        const descendantCount = collectDescendantIds(schema, nodeId).length;
        const childWarning = descendantCount > 0
            ? ` This will also delete ${descendantCount} child node${descendantCount === 1 ? '' : 's'}.`
            : '';

        if (window.confirm(`Are you sure you want to delete this ${node.type}?${childWarning}`)) {
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
                {hasChildren ? (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleCollapse(nodeId);
                        }}
                        className="p-0.5 -ml-1 rounded hover:bg-[#373e47] text-[#9da8b9] hover:text-white transition-colors"
                        aria-label={isCollapsed ? `Expand ${node.type}` : `Collapse ${node.type}`}
                    >
                        {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    </button>
                ) : (
                    <span className="w-[17px]" aria-hidden="true" />
                )}
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

            {visibleChildren.length > 0 && isExpanded && (
                <div>
                    {visibleChildren.map(childId => (
                        <TreeNode
                            key={childId}
                            nodeId={childId}
                            depth={depth + 1}
                            query={query}
                            collapsedNodeIds={collapsedNodeIds}
                            onToggleCollapse={onToggleCollapse}
                            isNodeVisible={isNodeVisible}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const LayoutTree = () => {
    const [query, setQuery] = useState('');
    const [collapsedNodeIds, setCollapsedNodeIds] = useState<Set<string>>(() => new Set());
    const schema = useBuilderStore((state) => state.schema);
    const normalizedQuery = query.trim().toLowerCase();

    const visibleNodeIds = useMemo(() => {
        if (!normalizedQuery) return new Set(Object.keys(schema));

        return new Set(
            Object.keys(schema).filter((nodeId) =>
                nodeMatchesQuery(schema, nodeId, normalizedQuery) ||
                hasMatchingDescendant(schema, nodeId, normalizedQuery)
            )
        );
    }, [schema, normalizedQuery]);

    const toggleCollapse = (nodeId: string) => {
        setCollapsedNodeIds((current) => {
            const next = new Set(current);
            if (next.has(nodeId)) {
                next.delete(nodeId);
            } else {
                next.add(nodeId);
            }
            return next;
        });
    };

    return (
        <div className="flex flex-col h-full bg-[#111418]">
            <div className="p-3 border-b border-[#282f39] text-xs font-bold text-[#9da8b9] uppercase tracking-wider">
                Layers
            </div>
            <div className="p-3 border-b border-[#282f39]">
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9da8b9]"
                    />
                    <input
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search layers..."
                        className="w-full bg-[#1c2128] border border-[#282f39] text-white text-xs rounded h-8 pl-8 pr-3 focus:outline-none focus:border-primary placeholder-[#5c6b7f]"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-auto p-2">
                {visibleNodeIds.has('root') ? (
                    <TreeNode
                        nodeId="root"
                        query={normalizedQuery}
                        collapsedNodeIds={collapsedNodeIds}
                        onToggleCollapse={toggleCollapse}
                        isNodeVisible={(nodeId) => visibleNodeIds.has(nodeId)}
                    />
                ) : (
                    <div className="px-2 py-3 text-xs text-[#5c6b7f]">
                        No layers found
                    </div>
                )}
            </div>
        </div>
    );
};
