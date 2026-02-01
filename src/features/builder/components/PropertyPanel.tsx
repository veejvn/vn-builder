import React, { useEffect, useState } from 'react';
import { useBuilderStore } from '../store/builder.store';
import { StyleSection } from './properties/StyleSection';
import { ContentSection } from './properties/ContentSection';
import { LayoutSection } from './properties/LayoutSection';

export const PropertyPanel = () => {
    const activeNodeId = useBuilderStore((state) => state.activeNodeId);
    const schema = useBuilderStore((state) => state.schema);
    const updateNode = useBuilderStore((state) => state.updateNode);

    const [formState, setFormState] = useState<any>({});

    const activeNode = activeNodeId ? schema[activeNodeId] : null;

    // Sync form state when active node changes
    useEffect(() => {
        if (activeNode) {
            setFormState(activeNode.props || {});
        }
    }, [activeNodeId, activeNode]);

    const handleChange = (key: string, value: any) => {
        if (!activeNodeId) return;

        const newProps = { ...formState, [key]: value };
        setFormState(newProps);
        updateNode(activeNodeId, { [key]: value });
    };

    const handleStyleChange = (key: string, value: any) => {
        if (!activeNodeId) return;

        const currentStyle = formState.style || {};
        const newStyle = { ...currentStyle, [key]: value };

        handleChange('style', newStyle);
    };


    if (!activeNode) {
        return (
            <div className="p-4 text-center text-[#9da8b9] text-sm italic">
                Select an element to edit properties
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#111418] text-white overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b border-[#282f39] bg-[#1c2128]">
                <h3 className="text-sm font-bold capitalize">{activeNode.type} Properties</h3>
                <span className="text-[10px] text-[#5c6b7f]">ID: {activeNode.id}</span>
            </div>

            <ContentSection
                nodeType={activeNode.type}
                formState={formState}
                handleChange={handleChange}
                handleStyleChange={handleStyleChange}
            />

            <LayoutSection
                nodeType={activeNode.type}
                formState={formState}
                handleStyleChange={handleStyleChange}
            />

            <StyleSection
                formState={formState}
                handleChange={handleChange}
                handleStyleChange={handleStyleChange}
            />
        </div>
    );
};
