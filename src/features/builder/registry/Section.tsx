import React from 'react';
import { NodeProps } from '../schema/node.types';
import { BoxComponent } from './Box';

export const SectionComponent = (props: NodeProps) => {
    return <BoxComponent {...props} tag="section" />;
};
