import React from 'react';
import { Palette } from 'lucide-react';
import { NodeProps } from '../../schema/node.types';

interface StyleSectionProps {
    formState: NodeProps;
    handleStyleChange: (key: string, value: unknown) => void;
    handleChange: (key: string, value: unknown) => void;
}

const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;
const LENGTH_PATTERN = /^-?\d+(\.\d+)?$/;

const toColorInputValue = (value: unknown, fallback: string) => (
    typeof value === 'string' && HEX_COLOR_PATTERN.test(value) ? value : fallback
);

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

const ColorControl = ({
    label,
    value,
    fallback,
    placeholder,
    onChange,
}: {
    label: string;
    value: string;
    fallback: string;
    placeholder: string;
    onChange: (value: string) => void;
}) => (
    <div className="space-y-1">
        <label className="text-[10px] text-[#9da8b9]">{label}</label>
        <div className="flex gap-2">
            <input
                type="color"
                value={toColorInputValue(value, fallback)}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 w-9 shrink-0 cursor-pointer rounded border border-[#282f39] bg-[#1c2128] p-1"
                aria-label={`${label} picker`}
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="min-w-0 flex-1 bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                placeholder={placeholder}
            />
        </div>
    </div>
);

const LengthInput = ({
    label,
    value,
    placeholder,
    onChange,
}: {
    label: string;
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
}) => (
    <div className="space-y-1">
        <label className="text-[10px] text-[#9da8b9]">{label}</label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => onChange(normalizeCssLength(e.target.value))}
            className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
            placeholder={placeholder}
        />
    </div>
);

const SpacingControls = ({
    title,
    prefix,
    style,
    handleStyleChange,
}: {
    title: string;
    prefix: 'padding' | 'margin';
    style: Record<string, unknown>;
    handleStyleChange: (key: string, value: unknown) => void;
}) => {
    const sides = [
        ['Top', 'T'],
        ['Right', 'R'],
        ['Bottom', 'B'],
        ['Left', 'L'],
    ] as const;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-[10px] text-[#9da8b9]">{title}</label>
                <input
                    type="text"
                    value={stringValue(style[prefix])}
                    onChange={(e) => handleStyleChange(prefix, e.target.value)}
                    onBlur={(e) => handleStyleChange(prefix, normalizeCssLength(e.target.value))}
                    className="w-24 bg-[#1c2128] border border-[#282f39] text-xs rounded p-1.5 text-right focus:border-blue-500 focus:outline-none"
                    placeholder="all"
                />
            </div>
            <div className="grid grid-cols-4 gap-1.5">
                {sides.map(([side, shortLabel]) => {
                    const key = `${prefix}${side}`;
                    return (
                        <div className="space-y-1" key={key}>
                            <label className="block text-center text-[9px] text-[#5c6b7f]">{shortLabel}</label>
                            <input
                                type="text"
                                value={stringValue(style[key])}
                                onChange={(e) => handleStyleChange(key, e.target.value)}
                                onBlur={(e) => handleStyleChange(key, normalizeCssLength(e.target.value))}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-[11px] rounded p-1.5 text-center focus:border-blue-500 focus:outline-none"
                                placeholder="0"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const StyleSection = ({ formState, handleStyleChange, handleChange }: StyleSectionProps) => {
    const style = getStyle(formState);

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

                    <ColorControl
                        label="Color"
                        value={stringValue(style.color)}
                        fallback="#ffffff"
                        placeholder="#ffffff"
                        onChange={(value) => handleStyleChange('color', value)}
                    />

                    {/* Font Size & Weight */}
                    <div className="grid grid-cols-2 gap-2">
                        <LengthInput
                            label="Size"
                            value={stringValue(style.fontSize)}
                            onChange={(value) => handleStyleChange('fontSize', value)}
                            placeholder="16px"
                        />
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Weight</label>
                            <select
                                value={stringValue(style.fontWeight, '400')}
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
                                    className={`flex-1 flex justify-center py-1 rounded hover:bg-[#282f39] ${style.textAlign === align ? 'bg-[#282f39] text-white' : 'text-[#5c6b7f]'}`}
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

                    <ColorControl
                        label="Background"
                        value={stringValue(style.backgroundColor)}
                        fallback="#ffffff"
                        placeholder="#ffffff or transparent"
                        onChange={(value) => handleStyleChange('backgroundColor', value)}
                    />

                    <div className="grid grid-cols-2 gap-2">
                        <LengthInput
                            label="Width"
                            value={stringValue(style.width)}
                            onChange={(value) => handleStyleChange('width', value)}
                            placeholder="auto"
                        />
                        <LengthInput
                            label="Height"
                            value={stringValue(style.height)}
                            onChange={(value) => handleStyleChange('height', value)}
                            placeholder="auto"
                        />
                    </div>

                    <SpacingControls title="Padding" prefix="padding" style={style} handleStyleChange={handleStyleChange} />
                    <SpacingControls title="Margin" prefix="margin" style={style} handleStyleChange={handleStyleChange} />
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
                                value={stringValue(style.borderRadius)}
                                onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                                onBlur={(e) => handleStyleChange('borderRadius', normalizeCssLength(e.target.value))}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                                placeholder="0px"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-[#9da8b9]">Width</label>
                            <input
                                type="text"
                                value={stringValue(style.borderWidth)}
                                onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
                                onBlur={(e) => handleStyleChange('borderWidth', normalizeCssLength(e.target.value))}
                                className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                                placeholder="0px"
                            />
                        </div>
                    </div>
                    <ColorControl
                        label="Color"
                        value={stringValue(style.borderColor)}
                        fallback="#000000"
                        placeholder="transparent"
                        onChange={(value) => handleStyleChange('borderColor', value)}
                    />
                    <div className="space-y-1">
                        <label className="text-[10px] text-[#9da8b9]">Style</label>
                        <select
                            value={stringValue(style.borderStyle, 'none')}
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
                                value={stringValue(style.opacity, '1')}
                                onChange={(e) => handleStyleChange('opacity', e.target.value)}
                                className="flex-1"
                            />
                            <span className="text-xs text-[#9da8b9] w-8 text-right">
                                {stringValue(style.opacity, '1')}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] text-[#9da8b9]">Shadow</label>
                        <input
                            type="text"
                            value={stringValue(style.boxShadow)}
                            onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
                            className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                            placeholder="none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] text-[#9da8b9]">Cursor</label>
                        <select
                            value={stringValue(style.cursor, 'auto')}
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
                        value={stringValue(formState.className)}
                        onChange={(e) => handleChange('className', e.target.value)}
                        className="w-full bg-[#1c2128] border border-[#282f39] text-xs rounded p-2 focus:border-blue-500 focus:outline-none"
                        placeholder="p-4 bg-red-500..."
                    />
                </div>
            </div>
        </div>
    );
};
