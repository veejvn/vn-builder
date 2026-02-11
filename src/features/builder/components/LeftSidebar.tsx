import React, { useState } from 'react';
import { LayoutTree } from './LayoutTree';
import { Search, Type, MousePointer2, LayoutTemplate, Box, FileImage, Layers, Plus, ALargeSmall, Star, SquareDashed, Heading, Footprints } from 'lucide-react';
import { useBuilderStore } from '../store/builder.store';

type Tab = 'add' | 'layers' | 'assets';

export const LeftSidebar = () => {
    const [activeTab, setActiveTab] = useState<Tab>('add');
    const addNode = useBuilderStore((state) => state.addNode);
    const activeNodeId = useBuilderStore((state) => state.activeNodeId);

    // Default to root if no node is selected, or use the selected node as parent
    // If we want to add to root by default if nothing selected:
    const parentId = activeNodeId || 'root';

    const handleAddNode = (type: 'text' | 'button' | 'container' | 'image' | 'grid' | 'flex' | 'input' | 'icon' | 'section' | 'header' | 'footer') => {
        addNode(parentId, type, { content: `New ${type}` });
    };

    const renderAddTab = () => {
        const categories = [
            {
                title: 'Layout',
                items: [
                    { type: 'container', icon: LayoutTemplate, label: 'Container' },
                    { type: 'section', icon: SquareDashed, label: 'Section' },
                    { type: 'header', icon: Heading, label: 'Header' },
                    { type: 'footer', icon: Footprints, label: 'Footer' },
                    { type: 'flex', icon: Layers, label: 'Flex' },
                    { type: 'grid', icon: Box, label: 'Grid' },
                ]
            },
            {
                title: 'Basic',
                items: [
                    { type: 'text', icon: Type, label: 'Text' },
                    { type: 'button', icon: MousePointer2, label: 'Button' },
                    { type: 'icon', icon: Star, label: 'Icon' },
                ]
            },
            {
                title: 'Form',
                items: [
                    { type: 'input', icon: ALargeSmall, label: 'Input' },
                ]
            },
            {
                title: 'Media',
                items: [
                    { type: 'image', icon: FileImage, label: 'Image' },
                ]
            }
        ];

        return (
            <div className="p-4 space-y-6">
                {categories.map((category) => (
                    <div key={category.title}>
                        <h3 className="text-xs font-semibold text-[#5c6b7f] uppercase tracking-wider mb-3 px-1">{category.title}</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {category.items.map((item) => (
                                <button
                                    key={item.type}
                                    onClick={() => handleAddNode(item.type as any)}
                                    className="flex flex-col items-center justify-center p-4 bg-[#1c2128] hover:bg-[#282f39] border border-[#282f39] rounded-lg transition-colors gap-2 group"
                                >
                                    <div className="p-2 rounded-full bg-[#2d333b] group-hover:bg-[#373e47] text-white">
                                        <item.icon size={20} />
                                    </div>
                                    <span className="text-xs font-medium text-[#9da8b9] group-hover:text-white">{item.label}</span>
                                </button>
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

            {/* Search - Only show for Layers or Add maybe? For now keep it common or move it inside tabs if needed. 
                Original design had search always visible. Let's keep it if activeTab is layers or assets, 
                or maybe just for components. Let's keep it simple for now and only show in Layers as in original design it was above LayoutTree.
            */}
            {activeTab === 'layers' && (
                <div className="p-3 border-b border-border-dark">
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9da8b9]"
                        />
                        <input
                            type="text"
                            placeholder="Search layers..."
                            className="w-full bg-[#1c2128] border border-[#282f39] text-white text-xs rounded h-8 pl-8 pr-3 focus:outline-none focus:border-primary placeholder-[#5c6b7f]"
                        />
                    </div>
                </div>
            )}

            {/* Content area */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'add' && renderAddTab()}
                {activeTab === 'layers' && <LayoutTree />}
                {activeTab === 'assets' && renderAssetsTab()}
            </div>
        </aside>
    );
};
