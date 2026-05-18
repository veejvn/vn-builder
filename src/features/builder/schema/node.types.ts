
export type NodeType = 'page' | 'container' | 'text' | 'button' | 'image' | 'flex' | 'grid' | 'input' | 'icon' | 'section' | 'header' | 'footer';

export type NodeProps = Record<string, any>;

export interface BuilderNode {
    id: string;
    type: NodeType;
    props: NodeProps;
    children: string[]; // Array of child node IDs
    parentId?: string | null;
}

export type BuilderSchema = Record<string, BuilderNode>;

export interface VersionedBuilderSchema {
    version: 1;
    nodes: BuilderSchema;
}

export type BuilderSchemaInput = BuilderSchema | VersionedBuilderSchema;
