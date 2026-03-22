
import { create } from 'zustand';
import { BuilderSchema, BuilderNode, NodeType, NodeProps } from '../schema/node.types';
import { nanoid } from 'nanoid';

interface BuilderState {
    schema: BuilderSchema;
    activeNodeId: string | null;

    // Actions
    initializeSchema: () => void;
    setSchema: (schema: BuilderSchema) => void;
    addNode: (parentId: string, type: NodeType, props?: NodeProps) => void;
    updateNode: (id: string, props: NodeProps) => void;
    moveNode: (activeId: string, overId: string) => void;
    deleteNode: (id: string) => void;
    selectNode: (id: string | null) => void;
    loadSchemaFromIndexedDB: (projectId: string) => Promise<boolean>; // Returns true if loaded
}

export const DEFAULT_SCHEMA: BuilderSchema = {
    root: {
        id: 'root',
        type: 'page',
        props: {
            className: 'min-h-screen bg-white text-black p-8',
        },
        children: [], // Initially empty
        parentId: null,
    },
};

export const useBuilderStore = create<BuilderState>((set, get) => ({
    schema: DEFAULT_SCHEMA,
    activeNodeId: null,

    initializeSchema: () => {
        set({ schema: DEFAULT_SCHEMA });
    },

    setSchema: (schema) => set({ schema }),

    addNode: (parentId, type, props = {}) => {
        const newNodeId = nanoid();
        const newNode: BuilderNode = {
            id: newNodeId,
            type,
            props,
            children: [],
            parentId,
        };

        set((state) => {
            const parentNode = state.schema[parentId];
            if (!parentNode) return state;

            return {
                schema: {
                    ...state.schema,
                    [parentId]: {
                        ...parentNode,
                        children: [...parentNode.children, newNodeId],
                    },
                    [newNodeId]: newNode,
                },
            };
        });
    },

    updateNode: (id, props) => {
        set((state) => {
            const node = state.schema[id];
            if (!node) return state;

            return {
                schema: {
                    ...state.schema,
                    [id]: {
                        ...node,
                        props: { ...node.props, ...props },
                    },
                },
            };
        });
    },

    moveNode: (activeId, overId) => {
        set((state) => {
            if (activeId === overId) return state;

            const activeNode = state.schema[activeId];
            const overNode = state.schema[overId];

            if (!activeNode || !overNode) return state;

            const activeParentId = activeNode.parentId;
            const overParentId = overNode.parentId;

            // Case 1: Reordering within the same parent
            if (activeParentId && activeParentId === overParentId) {
                const parentNode = state.schema[activeParentId];
                const oldIndex = parentNode.children.indexOf(activeId);
                const newIndex = parentNode.children.indexOf(overId);

                if (oldIndex !== -1 && newIndex !== -1) {
                    const newChildren = [...parentNode.children];
                    // Manual array move implementation since we don't want to import another util just for this if not needed, 
                    // but wait, I can just use splice.
                    newChildren.splice(oldIndex, 1);
                    newChildren.splice(newIndex, 0, activeId);

                    return {
                        schema: {
                            ...state.schema,
                            [activeParentId]: {
                                ...parentNode,
                                children: newChildren,
                            },
                        },
                    };
                }
            }

            return state;
        });
    },

    deleteNode: (id) => {
        set((state) => {
            const node = state.schema[id];
            if (!node || !node.parentId) return state; // Can't delete root

            const parentNode = state.schema[node.parentId];

            const newSchema = { ...state.schema };
            delete newSchema[id];

            return {
                schema: {
                    ...newSchema,
                    [node.parentId]: {
                        ...parentNode,
                        children: parentNode.children.filter((childId) => childId !== id),
                    },
                },
                activeNodeId: state.activeNodeId === id ? null : state.activeNodeId,
            };
        });
    },

    selectNode: (id) => set({ activeNodeId: id }),
    loadSchemaFromIndexedDB: async (projectId) => {
        if (typeof window === 'undefined') return false;

        try {
            const { indexedDBService } = await import('../services/indexedDB.service');
            const schema = await indexedDBService.loadSchema(projectId);

            if (schema && typeof schema === 'object' && schema.root) {
                set({ schema });
                return true;
            }
        } catch (error) {
            console.error('Failed to load schema from IndexedDB:', error);
        }

        return false;
    },
}));
