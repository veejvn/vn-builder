import React from 'react';
import * as LucideIcons from 'lucide-react';
import { NodeProps } from '../schema/node.types';
import { cn } from '@/lib/utils';

export const IconComponent = (props: NodeProps) => {
    const IconName = (props.icon as keyof typeof LucideIcons) || 'Star';
    // Use type assertion to silence TypeScript error about dynamic access if strict
    const IconResult = LucideIcons[IconName] as React.ElementType;

    if (!IconResult) {
        return <span>Icon not found</span>;
    }

    return (
        <IconResult
            className={cn(props.className)}
            size={props.size || 24}
            color={props.color || 'currentColor'}
            style={props.style}
            strokeWidth={props.strokeWidth}
        />
    );
};
