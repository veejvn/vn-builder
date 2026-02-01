
import React from 'react';
import { NodeType } from '../schema/node.types';
import { ButtonComponent } from './Button';
import { TextComponent } from './Text';
import { BoxComponent } from './Flex';
import { ImageComponent } from './Image';
import { GridComponent } from './Grid';

export const ComponentRegistry: Record<NodeType, React.FC<any>> = {
    page: (props) => <BoxComponent {...props} display="flex" direction="column" width="100%" height="100vh" backgroundColor="white" />,
    container: (props) => <BoxComponent {...props} display="block" width="100%" />,
    flex: (props) => <BoxComponent {...props} display="flex" direction="row" gap="10px" />,
    text: TextComponent,
    button: ButtonComponent,
    image: ImageComponent,
    grid: GridComponent,
};

export const getComponent = (type: NodeType) => {
    return ComponentRegistry[type] || (() => <div>Unknown Component: {type} </div>);
};
