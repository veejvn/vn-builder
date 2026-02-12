import React from 'react';
import { NodeProps } from '../schema/node.types';
import { cn } from '@/lib/utils';
import { Image as ImageIcon } from 'lucide-react';

export const ImageComponent = ({ className, style, ...props }: NodeProps) => {
    const src = props.src;
    const alt = props.alt || 'Image';
    const objectFit = props.objectFit || 'cover';

    if (!src) {
        return (
            <div
                className={cn(
                    "flex flex-col items-center justify-center bg-gray-100 text-gray-400 p-4 border border-dashed border-gray-300 min-h-[100px]",
                    className
                )}
                style={{ ...style }}
            >
                <ImageIcon size={32} className="mb-2 opacity-50" />
                <span className="text-xs">No Image Source</span>
            </div>
        )
    }

    return (
        <img
            src={src}
            alt={alt}
            className={cn('max-w-full', className)}
            style={{
                width: props.width || '100%',
                height: props.height || 'auto',
                objectFit: objectFit,
                ...style,
            }}
        />
    );
};
