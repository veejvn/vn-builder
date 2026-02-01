
import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { NodeProps } from '../schema/node.types';

export const ButtonComponent = (props: NodeProps) => {
    return (
        <ShadcnButton
            variant={props.variant || 'default'}
            size={props.size || 'default'}
            className={props.className}
            style={props.style}
        >
            {props.content || 'Button'}
        </ShadcnButton>
    );
};
