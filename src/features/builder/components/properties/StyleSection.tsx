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
            {/* Header */}
            <div className="flex items-center justify-between p-3 bg-[#111418]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#9da8b9] uppercase tracking-wider">
                    <Palette size={14} />
                    <span>Appearance</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">

                {/* --- TYPOGRAPHY --- */}
                <div className="space-y-2">
                    <div className="text-[10px] font-bold text-[#5c6b7f] uppercase tracking-wider mb-2">Typography</div>

                    {/* Color */}
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] text-[#9da8b9]">Color</label>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded-full border border-[#282f39]"
                                style={{ backgroundColor: formState.style?.color || '#ffffff' }}
                            />
                            <input
                                type="text"
                                value={formState.style?.color || ''}
                                onChange={(e) => handleStyleChange('color', e.target.value)}
                                className="w-20 bg-[#1c2128] border border-[#282f39] text-xs rounded p-1 text-right focus:border-blue-500 focus:outline-none"
                                placeholder="#ffffff"
                            />
                        </div>
                    </div>

                    {/* Font Size & Weight */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Size (px)</label>
                            <input
                                type="text"
                                value={formState.style?.fontSize || ''}
                                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                                placeholder="16px"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Weight</label>
                            <select
                                value={formState.style?.fontWeight || '400'}
                                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="300">Light</option>
                                <option value="400">Regular</option>
                                <option value="500">Medium</option>
                                <option value="600">Semibold</option>
                                <option value="700">Bold</option>
                                <option value="900">Black</option>
                            </select>
                        </div>
                    </div>

                    {/* Align & Decoration */}
                    <div className="space-y-1">
                        <label className="text-[10px] text-[#9da8b9]">Align</label>
                        <div className="flex bg-[#1c2128] rounded border border-[#282f39] p-1">
                            {['left', 'center', 'right', 'justify'].map((align) => (
                                <button
                                    key={align}
                                    onClick={() => handleStyleChange('textAlign', align)}
                                    className={`flex-1 flex justify-center py-1 rounded hover:bg-[#282f39] ${formState.style?.textAlign === align ? 'bg-[#282f39] text-white' : 'text-[#5c6b7f]'}`}
                                >
                                    <span className="text-[10px] capitalize">{align}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="h-px bg-[#282f39]"></div>

                {/* --- BACKGROUND & DIMENSIONS --- */}
                <div className="space-y-2">
                    <div className="text-[10px] font-bold text-[#5c6b7f] uppercase tracking-wider mb-2">Sizing & Background</div>

                    <div className="space-y-1">
                        <label className="text-[10px] text-[#9da8b9]">Background</label>
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

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Width</label>
                            <input
                                type="text"
                                value={formState.style?.width || ''}
                                onChange={(e) => handleStyleChange('width', e.target.value)}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                                placeholder="auto"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Height</label>
                            <input
                                type="text"
                                value={formState.style?.height || ''}
                                onChange={(e) => handleStyleChange('height', e.target.value)}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                                placeholder="auto"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Padding</label>
                            <input
                                type="text"
                                value={formState.style?.padding || ''}
                                onChange={(e) => handleStyleChange('padding', e.target.value)}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                                placeholder="0px"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Margin</label>
                            <input
                                type="text"
                                value={formState.style?.margin || ''}
                                onChange={(e) => handleStyleChange('margin', e.target.value)}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                                placeholder="0px"
                            />
                        </div>
                    </div>
                </div>

                <div className="h-px bg-[#282f39]"></div>

                {/* --- BORDER & RADIUS --- */}
                <div className="space-y-2">
                    <div className="text-[10px] font-bold text-[#5c6b7f] uppercase tracking-wider mb-2">Border</div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Radius</label>
                            <input
                                type="text"
                                value={formState.style?.borderRadius || ''}
                                onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                                placeholder="0px"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Width</label>
                            <input
                                type="text"
                                value={formState.style?.borderWidth || ''}
                                onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                                placeholder="0px"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-[#9da8b9]">Color</label>
                        <div className="flex gap-2">
                            <div
                                className="w-8 h-8 rounded border border-[#282f39]"
                                style={{ backgroundColor: formState.style?.borderColor || 'transparent' }}
                            ></div>
                            <input
                                type="text"
                                value={formState.style?.borderColor || ''}
                                onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                                className="flex-1 bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                                placeholder="transparent"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-[#9da8b9]">Style</label>
                        <select
                            value={formState.style?.borderStyle || 'none'}
                            onChange={(e) => handleStyleChange('borderStyle', e.target.value)}
                            className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                        >
                            <option value="none">None</option>
                            <option value="solid">Solid</option>
                            <option value="dashed">Dashed</option>
                            <option value="dotted">Dotted</option>
                        </select>
                    </div>
                </div>

                <div className="h-px bg-[#282f39]"></div>

                {/* --- EFFECTS --- */}
                <div className="space-y-2">
                    <div className="text-[10px] font-bold text-[#5c6b7f] uppercase tracking-wider mb-2">Effects</div>

                    <div className="space-y-1">
                        <label className="text-[10px] text-[#9da8b9]">Opacity</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={formState.style?.opacity !== undefined ? formState.style.opacity : 1}
                                onChange={(e) => handleStyleChange('opacity', e.target.value)}
                                className="flex-1"
                            />
                            <span className="text-xs text-[#9da8b9] w-8 text-right">
                                {formState.style?.opacity !== undefined ? formState.style.opacity : 1}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] text-[#9da8b9]">Shadow</label>
                        <input
                            type="text"
                            value={formState.style?.boxShadow || ''}
                            onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
                            className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                            placeholder="none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] text-[#9da8b9]">Cursor</label>
                        <select
                            value={formState.style?.cursor || 'auto'}
                            onChange={(e) => handleStyleChange('cursor', e.target.value)}
                            className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                        >
                            <option value="auto">Auto</option>
                            <option value="pointer">Pointer</option>
                            <option value="text">Text</option>
                            <option value="move">Move</option>
                            <option value="not-allowed">Not Allowed</option>
                        </select>
                    </div>
                </div>

                <div className="h-px bg-[#282f39]"></div>

                {/* --- EXTRA --- */}
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
