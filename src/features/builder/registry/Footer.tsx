import React from 'react';
import { NodeProps } from '../schema/node.types';
import { BoxComponent } from './Box';

export const FooterComponent = (props: NodeProps) => {
    return <BoxComponent {...props} tag="footer" />;
};
