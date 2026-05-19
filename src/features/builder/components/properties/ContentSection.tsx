import React from 'react';
import { Type } from 'lucide-react';
import { NodeProps, NodeType } from '../../schema/node.types';

interface ContentSectionProps {
    nodeType: NodeType;
    formState: NodeProps;
    handleChange: (key: string, value: unknown) => void;
}

export const ContentSection = ({ nodeType, formState, handleChange }: ContentSectionProps) => {
    if (nodeType !== 'text' && nodeType !== 'button' && nodeType !== 'image' && nodeType !== 'icon' && nodeType !== 'input') return null;

    const handleOptionalNumberChange = (key: string, value: string) => {
        if (value === '') {
            handleChange(key, '');
            return;
        }

        const parsed = Number(value);
        handleChange(key, Number.isFinite(parsed) ? parsed : value);
    };

    return (
        <div className="border-b border-[#282f39]">
            <div className="flex items-center justify-between p-3 bg-[#111418]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#9da8b9] uppercase tracking-wider">
                    <Type size={14} />
                    <span>Content</span>
                </div>
            </div>
            <div className="p-4 space-y-3">
                {(nodeType === 'text' || nodeType === 'button') && (
                    <div className="space-y-1">
                        <label className="text-[10px] text-[#9da8b9]">Text</label>
                        <input
                            type="text"
                            value={formState.content || ''}
                            onChange={(e) => handleChange('content', e.target.value)}
                            className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                )}

                {nodeType === 'image' && (
                    <>
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Source URL</label>
                            <input
                                type="text"
                                value={formState.src || ''}
                                onChange={(e) => handleChange('src', e.target.value)}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Alt Text</label>
                            <input
                                type="text"
                                value={formState.alt || ''}
                                onChange={(e) => handleChange('alt', e.target.value)}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Object Fit</label>
                            <select
                                value={formState.objectFit || 'cover'}
                                onChange={(e) => handleChange('objectFit', e.target.value)}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="contain">Contain</option>
                                <option value="cover">Cover</option>
                                <option value="fill">Fill</option>
                                <option value="none">None</option>
                            </select>
                        </div>
                    </>
                )}

                {nodeType === 'icon' && (
                    <>
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Icon Name (Lucide)</label>
                            <input
                                type="text"
                                value={formState.icon ?? ''}
                                onChange={(e) => handleChange('icon', e.target.value)}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                                placeholder="e.g. Star, Heart, User..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="text-[10px] text-[#9da8b9]">Size</label>
                                <input
                                    type="number"
                                    value={formState.size ?? ''}
                                    onChange={(e) => handleOptionalNumberChange('size', e.target.value)}
                                    className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-[#9da8b9]">Color</label>
                                <input
                                    type="text"
                                    value={formState.color ?? ''}
                                    onChange={(e) => handleChange('color', e.target.value)}
                                    className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                                    placeholder="currentColor"
                                />
                            </div>
                        </div>
                    </>
                )}

                {nodeType === 'input' && (
                    <>
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Input Type</label>
                            <select
                                value={formState.type ?? 'text'}
                                onChange={(e) => handleChange('type', e.target.value)}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="email">Email</option>
                                <option value="password">Password</option>
                                <option value="tel">Telephone</option>
                                <option value="url">URL</option>
                                <option value="date">Date</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Placeholder</label>
                            <input
                                type="text"
                                value={formState.placeholder || ''}
                                onChange={(e) => handleChange('placeholder', e.target.value)}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                                placeholder="Type here..."
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Default Value</label>
                            <input
                                type="text"
                                value={formState.defaultValue || ''}
                                onChange={(e) => handleChange('defaultValue', e.target.value)}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
