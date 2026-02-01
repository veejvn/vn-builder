import React from 'react';
import { Type } from 'lucide-react';
import { NodeType } from '../../schema/node.types';

interface ContentSectionProps {
    nodeType: NodeType;
    formState: any;
    handleChange: (key: string, value: any) => void;
    handleStyleChange: (key: string, value: any) => void;
}

export const ContentSection = ({ nodeType, formState, handleChange, handleStyleChange }: ContentSectionProps) => {
    if (nodeType !== 'text' && nodeType !== 'button' && nodeType !== 'image') return null;

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
            </div>
        </div>
    );
};
