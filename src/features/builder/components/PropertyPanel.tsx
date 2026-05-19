import React, { useState } from 'react';
import { useBuilderStore } from '../store/builder.store';
import { StyleSection } from './properties/StyleSection';
import { ContentSection } from './properties/ContentSection';
import { LayoutSection } from './properties/LayoutSection';
import { NodeProps } from '../schema/node.types';

export const PropertyPanel = () => {
    const activeNodeId = useBuilderStore((state) => state.activeNodeId);
    const schema = useBuilderStore((state) => state.schema);
    const updateNode = useBuilderStore((state) => state.updateNode);

    const [formState, setFormState] = useState<NodeProps>({});

    const activeNode = activeNodeId ? schema[activeNodeId] : null;

    const [prevActiveNodeId, setPrevActiveNodeId] = useState<string | null>(null);
    const [prevActiveNodeProps, setPrevActiveNodeProps] = useState<string>('');

    const currentPropsStr = JSON.stringify(activeNode?.props || {});

    // Sync form state when active node changes or its props change externally
    if (activeNodeId !== prevActiveNodeId || currentPropsStr !== prevActiveNodeProps) {
        setPrevActiveNodeId(activeNodeId);
        setPrevActiveNodeProps(currentPropsStr);
        setFormState(activeNode?.props || {});
    }

    const handleChange = (key: string, value: unknown) => {
        if (!activeNodeId) return;

        const newProps = { ...formState, [key]: value };
        setFormState(newProps);
        updateNode(activeNodeId, { [key]: value });
    };

    const handleStyleChange = (key: string, value: unknown) => {
        if (!activeNodeId) return;

        const currentStyle = typeof formState.style === 'object' && formState.style !== null ? formState.style : {};
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
