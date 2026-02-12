
import React from 'react';
import { NodeProps } from '../schema/node.types';

export const TextComponent = (props: NodeProps) => {
    const Tag = props.tag || 'p';
    return (
        <Tag className={props.className} style={props.style}>
            {props.content || 'Text block'}
        </Tag>
    );
};
