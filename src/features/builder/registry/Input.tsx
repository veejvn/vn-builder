import React from 'react';
import { Input } from '@/components/ui/input';
import { NodeProps } from '../schema/node.types';

export const InputComponent = (props: NodeProps) => {
    return (
        <Input
            type={props.type || 'text'}
            placeholder={props.placeholder || 'Type here...'}
            value={props.value}
            defaultValue={props.defaultValue}
            className={props.className}
            style={props.style}
            disabled={props.disabled}
        />
    );
};
