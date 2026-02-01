import React from 'react';
import { Palette, ChevronDown, ChevronRight, X } from 'lucide-react';

interface StyleSectionProps {
    formState: any;
    handleStyleChange: (key: string, value: any) => void;
    handleChange: (key: string, value: any) => void;
}

export const StyleSection = ({ formState, handleStyleChange, handleChange }: StyleSectionProps) => {
    return (
        <div className="border-b border-[#282f39]">
            <div className="flex items-center justify-between p-3 bg-[#111418]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#9da8b9] uppercase tracking-wider">
                    <Palette size={14} />
                    <span>Appearance</span>
                </div>
            </div>
            <div className="p-4 space-y-3">
                <div className="space-y-1">
                    <label className="text-[10px] text-[#9da8b9]">Background Color</label>
                    <div className="flex gap-2">
                        <div
                            className="w-8 h-8 rounded border border-[#282f39]"
                            style={{ backgroundColor: formState.style?.backgroundColor || 'transparent' }}
                        ></div>
                        <input
                            type="text"
                            value={formState.style?.backgroundColor || ''}
                            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                            className="flex-1 bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                            placeholder="#ffffff or transparent"
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-[#9da8b9]">Padding</label>
                    <input
                        type="text"
                        value={formState.style?.padding || ''}
                        onChange={(e) => handleStyleChange('padding', e.target.value)}
                        className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                        placeholder="e.g. 10px or 10px 20px"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-[#9da8b9]">Margin</label>
                    <input
                        type="text"
                        value={formState.style?.margin || ''}
                        onChange={(e) => handleStyleChange('margin', e.target.value)}
                        className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                        placeholder="e.g. 10px or 10px 20px"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-[#9da8b9]">Width</label>
                    <input
                        type="text"
                        value={formState.style?.width || ''}
                        onChange={(e) => handleStyleChange('width', e.target.value)}
                        className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                        placeholder="e.g. 100% or 200px"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-[#9da8b9]">Height</label>
                    <input
                        type="text"
                        value={formState.style?.height || ''}
                        onChange={(e) => handleStyleChange('height', e.target.value)}
                        className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                        placeholder="e.g. auto or 200px"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-[#9da8b9]">Tailwind Classes</label>
                    <input
                        type="text"
                        value={formState.className || ''}
                        onChange={(e) => handleChange('className', e.target.value)}
                        className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                        placeholder="p-4 bg-red-500..."
                    />
                </div>
            </div>
        </div>
    );
};
