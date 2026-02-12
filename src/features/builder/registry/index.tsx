
import React from 'react';
import { NodeType } from '../schema/node.types';
import { ButtonComponent } from './Button';
import { TextComponent } from './Text';
import { BoxComponent } from './Box';
import { ImageComponent } from './Image';
import { GridComponent } from './Grid';
import { InputComponent } from './Input';
import { SectionComponent } from './Section';
import { HeaderComponent } from './Header';
import { FooterComponent } from './Footer';
import { IconComponent } from './Icon';

export const ComponentRegistry: Record<NodeType, React.FC<any>> = {
    page: (props) => <BoxComponent {...props} display="flex" direction="column" width="100%" height="100vh" backgroundColor="white" />,
    container: (props) => <BoxComponent {...props} display="block" width="100%" />,
    flex: (props) => <BoxComponent {...props} display="flex" />,
    text: TextComponent,
    button: ButtonComponent,
    image: ImageComponent,
    grid: GridComponent,
    input: InputComponent,
    icon: IconComponent,
    section: SectionComponent,
    header: HeaderComponent,
    footer: FooterComponent,
};

export const getComponent = (type: NodeType) => {
    return ComponentRegistry[type] || (() => <div>Unknown Component: {type} </div>);
};
