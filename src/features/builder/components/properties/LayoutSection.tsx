import React from 'react';
import { Layout } from 'lucide-react';
import { NodeProps, NodeType } from '../../schema/node.types';

interface LayoutSectionProps {
    nodeType: NodeType;
    formState: NodeProps;
    handleStyleChange: (key: string, value: unknown) => void;
}

const LENGTH_PATTERN = /^-?\d+(\.\d+)?$/;

const normalizeCssLength = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return '';
    return LENGTH_PATTERN.test(trimmed) ? `${trimmed}px` : value;
};

const getStyle = (formState: NodeProps) => (
    typeof formState.style === 'object' && formState.style !== null
        ? formState.style as Record<string, unknown>
        : {}
);

const stringValue = (value: unknown, fallback = '') => (
    typeof value === 'string' || typeof value === 'number' ? String(value) : fallback
);

export const LayoutSection = ({ nodeType, formState, handleStyleChange }: LayoutSectionProps) => {
    // Only show for containers, pages, flex, or grid
    if (['container', 'flex', 'page', 'grid'].indexOf(nodeType) === -1) return null;

    const isGrid = nodeType === 'grid';
    const style = getStyle(formState);
    const defaultDisplay = isGrid ? 'grid' : 'flex';
    const currentDisplay = stringValue(style.display, defaultDisplay);
    // For container and flex, we check the style.display or mapped defaults
    // But for simplicity, we show Flex Controls if it's meant to be flex.
    // However, our new BoxComponent logic is 'display' based. 
    // Let's assume user wants to edit layout props if it is one of these types.

    return (
        <div className="border-b border-[#282f39]">
            <div className="flex items-center justify-between p-3 bg-[#111418]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#9da8b9] uppercase tracking-wider">
                    <Layout size={14} />
                    <span>{isGrid ? 'Grid Layout' : 'Flex Layout'}</span>
                </div>
            </div>
            <div className="p-4 space-y-3">
                <div className="space-y-1">
                    <label className="text-[10px] text-[#9da8b9]">Display</label>
                    <select
                        value={currentDisplay}
                        onChange={(e) => handleStyleChange('display', e.target.value)}
                        className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                    >
                        <option value="flex">Flex</option>
                        <option value="grid">Grid</option>
                        <option value="block">Block</option>
                        <option value="inline-flex">Inline Flex</option>
                        <option value="none">None</option>
                    </select>
                </div>

                {isGrid ? (
                    <>
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Columns Template</label>
                            <input
                                type="text"
                                value={stringValue(style.gridTemplateColumns, 'repeat(2, 1fr)')}
                                onChange={(e) => handleStyleChange('gridTemplateColumns', e.target.value)}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                                placeholder="repeat(2, 1fr)"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Gap (px)</label>
                            <input
                                type="text"
                                value={stringValue(style.gap)}
                                onChange={(e) => handleStyleChange('gap', e.target.value)}
                                onBlur={(e) => handleStyleChange('gap', normalizeCssLength(e.target.value))}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Direction</label>
                            <select
                                value={stringValue(style.flexDirection, 'row')}
                                onChange={(e) => handleStyleChange('flexDirection', e.target.value)}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="row">Row</option>
                                <option value="column">Column</option>
                                <option value="row-reverse">Row Reverse</option>
                                <option value="column-reverse">Column Reverse</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Justify</label>
                            <select
                                value={stringValue(style.justifyContent, 'flex-start')}
                                onChange={(e) => handleStyleChange('justifyContent', e.target.value)}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="flex-start">Start</option>
                                <option value="center">Center</option>
                                <option value="flex-end">End</option>
                                <option value="space-between">Space Between</option>
                                <option value="space-around">Space Around</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Align Items</label>
                            <select
                                value={stringValue(style.alignItems, 'stretch')}
                                onChange={(e) => handleStyleChange('alignItems', e.target.value)}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="stretch">Stretch</option>
                                <option value="flex-start">Start</option>
                                <option value="center">Center</option>
                                <option value="flex-end">End</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Gap (px)</label>
                            <input
                                type="text"
                                value={stringValue(style.gap)}
                                onChange={(e) => handleStyleChange('gap', e.target.value)}
                                onBlur={(e) => handleStyleChange('gap', normalizeCssLength(e.target.value))}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
