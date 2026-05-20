import React from 'react';
import { NodeProps } from '../schema/node.types';
import { cn } from '@/lib/utils';

export const GridComponent = ({ children, className, style, debug, ...props }: NodeProps & { children?: React.ReactNode }) => {
    return (
        <div
            className={cn(
                'grid min-h-[50px] transition-all',
                debug !== false && 'border border-dashed border-gray-200 p-4',
                className
            )}
            style={{
                display: 'grid',
                gridTemplateColumns: props.gridTemplateColumns || 'repeat(2, 1fr)',
                gap: props.gap || '10px',

                // Box properties
                padding: props.padding,
                margin: props.margin,
                width: props.width || '100%',
                height: props.height,
                backgroundColor: props.backgroundColor,
                borderRadius: props.borderRadius,

                ...style,
            }}
        >
            {children}
        </div>
    );
};
