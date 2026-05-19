import React from 'react';
import { NodeProps } from '../schema/node.types';
import { cn } from '@/lib/utils';

export const BoxComponent = ({ children, className, style = {}, tag = 'div', debug, ...props }: NodeProps & { children?: React.ReactNode, tag?: React.ElementType }) => {
    const isFlex = (props.display || (style as any).display || 'flex') === 'flex';
    const Tag = tag;

    // Build computed styles, prioritizing explicit props and the style object
    const computedStyle: React.CSSProperties = {
        // Box properties
        padding: props.padding,
        margin: props.margin,
        width: props.width,
        height: props.height,
        backgroundColor: props.backgroundColor,
        borderRadius: props.borderRadius,

        // Flex properties (only if isFlex is true)
        ...(isFlex && {
            flexDirection: props.direction,
            justifyContent: props.justify,
            alignItems: props.align,
            gap: props.gap,
        }),

        ...style,
    };

    return (
        <Tag
            className={cn(
                'min-h-[50px] transition-all',
                isFlex ? 'flex' : 'block',
                // Default width if not specified in style or props
                (!computedStyle.width && !className?.includes('w-')) && 'w-full',
                debug !== false && 'border border-dashed border-gray-200 p-4',
                className
            )}
            style={computedStyle}
        >
            {children}
        </Tag>
    );
};
