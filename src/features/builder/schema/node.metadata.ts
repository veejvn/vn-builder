import type { NodeProps, NodeType } from './node.types';

export type NodeCategory = 'layout' | 'basic' | 'form' | 'media';

export interface NodeMetadata {
    type: NodeType;
    label: string;
    category: NodeCategory;
    canHaveChildren: boolean;
    defaultProps: NodeProps;
}

export const NODE_METADATA: Record<NodeType, NodeMetadata> = {
    page: {
        type: 'page',
        label: 'Page',
        category: 'layout',
        canHaveChildren: true,
        defaultProps: {
            className: 'min-h-screen bg-white text-black p-8',
        },
    },
    container: {
        type: 'container',
        label: 'Container',
        category: 'layout',
        canHaveChildren: true,
        defaultProps: {
            display: 'block',
            width: '100%',
        },
    },
    section: {
        type: 'section',
        label: 'Section',
        category: 'layout',
        canHaveChildren: true,
        defaultProps: {
            display: 'block',
            width: '100%',
        },
    },
    header: {
        type: 'header',
        label: 'Header',
        category: 'layout',
        canHaveChildren: true,
        defaultProps: {
            display: 'flex',
            direction: 'row',
            align: 'center',
            justify: 'space-between',
            width: '100%',
        },
    },
    footer: {
        type: 'footer',
        label: 'Footer',
        category: 'layout',
        canHaveChildren: true,
        defaultProps: {
            display: 'flex',
            direction: 'row',
            align: 'center',
            justify: 'space-between',
            width: '100%',
        },
    },
    flex: {
        type: 'flex',
        label: 'Flex',
        category: 'layout',
        canHaveChildren: true,
        defaultProps: {
            display: 'flex',
            direction: 'row',
            gap: '12px',
        },
    },
    grid: {
        type: 'grid',
        label: 'Grid',
        category: 'layout',
        canHaveChildren: true,
        defaultProps: {
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
        },
    },
    text: {
        type: 'text',
        label: 'Text',
        category: 'basic',
        canHaveChildren: false,
        defaultProps: {
            content: 'New text',
        },
    },
    button: {
        type: 'button',
        label: 'Button',
        category: 'basic',
        canHaveChildren: false,
        defaultProps: {
            content: 'Button',
            variant: 'default',
            size: 'default',
        },
    },
    icon: {
        type: 'icon',
        label: 'Icon',
        category: 'basic',
        canHaveChildren: false,
        defaultProps: {
            icon: 'Star',
            size: 24,
        },
    },
    input: {
        type: 'input',
        label: 'Input',
        category: 'form',
        canHaveChildren: false,
        defaultProps: {
            type: 'text',
            placeholder: 'Type here...',
        },
    },
    image: {
        type: 'image',
        label: 'Image',
        category: 'media',
        canHaveChildren: false,
        defaultProps: {
            alt: 'Image',
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
        },
    },
};

export function getNodeMetadata(type: NodeType) {
    return NODE_METADATA[type];
}
