import React, { useState } from 'react';
import { LayoutTree } from './LayoutTree';
import { Type, MousePointer2, LayoutTemplate, Box, FileImage, Layers, Plus, ALargeSmall, Star, SquareDashed, Heading, Footprints, type LucideIcon } from 'lucide-react';
import { useBuilderStore } from '../store/builder.store';
import { NODE_METADATA, type NodeCategory } from '../schema/node.metadata';
import { canAcceptChild } from '../schema/schema.utils';
import type { BuilderSchema, NodeType } from '../schema/node.types';
import { DraggableComponentItem } from './DraggableComponentItem';

type Tab = 'add' | 'layers' | 'assets';

const CATEGORY_LABELS: Record<NodeCategory, string> = {
    layout: 'Layout',
    basic: 'Basic',
    form: 'Form',
    media: 'Media',
};

const CATEGORY_ORDER: NodeCategory[] = ['layout', 'basic', 'form', 'media'];

const NODE_ICONS: Record<NodeType, LucideIcon> = {
    page: LayoutTemplate,
    container: LayoutTemplate,
    section: SquareDashed,
    header: Heading,
    footer: Footprints,
    flex: Layers,
    grid: Box,
    text: Type,
    button: MousePointer2,
    icon: Star,
    input: ALargeSmall,
    image: FileImage,
};

function findNearestAcceptingParent(schema: BuilderSchema, startId: string | null, childType: NodeType) {
    let currentId: string | null = startId && schema[startId] ? startId : 'root';

    while (currentId) {
        const nodeId: string = currentId;
        const node: BuilderSchema[string] | undefined = schema[nodeId];
        if (canAcceptChild(node, childType)) return currentId;
        currentId = node?.parentId ?? null;
    }

    return canAcceptChild(schema.root, childType) ? 'root' : null;
}

export const LeftSidebar = () => {
    const [activeTab, setActiveTab] = useState<Tab>('add');
    const addNode = useBuilderStore((state) => state.addNode);
    const activeNodeId = useBuilderStore((state) => state.activeNodeId);
    const schema = useBuilderStore((state) => state.schema);

    const handleAddNode = (type: NodeType) => {
        const parentId = findNearestAcceptingParent(schema, activeNodeId, type);
        if (!parentId) return;
        addNode(parentId, type);
    };

    const renderAddTab = () => {
        const items = Object.values(NODE_METADATA).filter((item) => item.type !== 'page');

        return (
            <div className="p-4 space-y-6">
                {CATEGORY_ORDER.map((category) => (
                    <div key={category}>
                        <h3 className="text-xs font-semibold text-[#5c6b7f] uppercase tracking-wider mb-3 px-1">{CATEGORY_LABELS[category]}</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {items
                                .filter((item) => item.category === category)
                                .map((item) => (
                                <DraggableComponentItem
                                    key={item.type}
                                    type={item.type}
                                    label={item.label}
                                    icon={NODE_ICONS[item.type]}
                                    onAdd={handleAddNode}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderAssetsTab = () => (
        <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-[#1c2128] rounded border border-[#282f39] flex items-center justify-center text-[#9da8b9]">
                        <FileImage size={24} className="opacity-50" />
                    </div>
                ))}
            </div>
            <div className="mt-4 text-center text-xs text-[#5c6b7f]">
                More assets coming soon
            </div>
        </div>
    );

    return (
        <aside className="w-65 flex-col border-r border-border-dark bg-[#111418] shrink-0 z-10 hidden lg:flex h-full">
            {/* Tabs */}
            <div className="flex border-b border-border-dark">
                <button
                    onClick={() => setActiveTab('add')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'add'
                        ? 'text-white border-b-2 border-primary bg-[#1c2128]'
                        : 'text-[#9da8b9] hover:text-white hover:bg-[#1c2128]/50'
                        }`}
                >
                    <Plus size={16} />
                    Add
                </button>
                <button
                    onClick={() => setActiveTab('layers')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'layers'
                        ? 'text-white border-b-2 border-primary bg-[#1c2128]'
                        : 'text-[#9da8b9] hover:text-white hover:bg-[#1c2128]/50'
                        }`}
                >
                    <Layers size={16} />
                    Layers
                </button>
                <button
                    onClick={() => setActiveTab('assets')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'assets'
                        ? 'text-white border-b-2 border-primary bg-[#1c2128]'
                        : 'text-[#9da8b9] hover:text-white hover:bg-[#1c2128]/50'
                        }`}
                >
                    <FileImage size={16} />
                    Assets
                </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'add' && renderAddTab()}
                {activeTab === 'layers' && <LayoutTree />}
                {activeTab === 'assets' && renderAssetsTab()}
            </div>
        </aside>
    );
};
