import { create } from 'zustand';
import type { BuilderSchema, BuilderViewport, MoveTarget, NodeProps, NodeType } from '../schema/node.types';
import {
    canAcceptChild,
    collectDescendantIds,
    createBuilderNode,
    deleteNodeRecursive,
    moveNodeInSchema,
} from '../schema/schema.utils';
import { EMPTY_HISTORY, popRedo, popUndo, pushHistory, type BuilderHistory } from './builder.history';

interface BuilderState {
    schema: BuilderSchema;
    activeNodeId: string | null;
    history: BuilderHistory;
    previewMode: boolean;
    viewport: BuilderViewport;

    // Actions
    initializeSchema: () => void;
    setSchema: (schema: BuilderSchema) => void;
    addNode: (parentId: string, type: NodeType, props?: NodeProps, index?: number) => string | null;
    updateNode: (id: string, props: NodeProps) => void;
    moveNode: (activeId: string, targetOrOverId: MoveTarget | string) => boolean;
    deleteNode: (id: string) => boolean;
    selectNode: (id: string | null) => void;
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
    setPreviewMode: (enabled: boolean) => void;
    setViewport: (viewport: BuilderViewport) => void;
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
    history: EMPTY_HISTORY,
    previewMode: false,
    viewport: 'desktop',

    initializeSchema: () => {
        set({
            schema: DEFAULT_SCHEMA,
            activeNodeId: null,
            history: EMPTY_HISTORY,
        });
    },

    setSchema: (schema) => set({
        schema,
        activeNodeId: null,
        history: EMPTY_HISTORY,
    }),

    addNode: (parentId, type, props = {}, index) => {
        const state = get();
        const parentNode = state.schema[parentId];
        if (!canAcceptChild(parentNode, type)) return null;

        const newNode = createBuilderNode(type, parentId, props);
        const children = [...parentNode.children];
        const boundedIndex =
            typeof index === 'number'
                ? Math.max(0, Math.min(index, parentNode.children.length))
                : parentNode.children.length;
        children.splice(boundedIndex, 0, newNode.id);

        set({
            schema: {
                ...state.schema,
                [parentId]: {
                    ...parentNode,
                    children,
                },
                [newNode.id]: newNode,
            },
            history: pushHistory(state.history, state.schema),
        });

        return newNode.id;
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
                history: pushHistory(state.history, state.schema),
            };
        });
    },

    moveNode: (activeId, targetOrOverId) => {
        const state = get();
        const target: MoveTarget =
            typeof targetOrOverId === 'string'
                ? { overId: targetOrOverId, position: 'before' }
                : targetOrOverId;

        const nextSchema = moveNodeInSchema(state.schema, activeId, target);
        if (nextSchema === state.schema) return false;

        set({
            schema: nextSchema,
            history: pushHistory(state.history, state.schema),
        });

        return true;
    },

    deleteNode: (id) => {
        const state = get();
        const node = state.schema[id];
        if (!node || !node.parentId) return false;

        const deletedIds = [id, ...collectDescendantIds(state.schema, id)];
        const nextSchema = deleteNodeRecursive(state.schema, id);
        if (nextSchema === state.schema) return false;

        set({
            schema: nextSchema,
            activeNodeId: state.activeNodeId && deletedIds.includes(state.activeNodeId)
                ? null
                : state.activeNodeId,
            history: pushHistory(state.history, state.schema),
        });

        return true;
    },

    selectNode: (id) => set({ activeNodeId: id }),

    undo: () => {
        const state = get();
        const result = popUndo(state.history, state.schema);
        if (!result) return;

        set({
            schema: result.schema,
            activeNodeId: state.activeNodeId && result.schema[state.activeNodeId]
                ? state.activeNodeId
                : null,
            history: result.history,
        });
    },

    redo: () => {
        const state = get();
        const result = popRedo(state.history, state.schema);
        if (!result) return;

        set({
            schema: result.schema,
            activeNodeId: state.activeNodeId && result.schema[state.activeNodeId]
                ? state.activeNodeId
                : null,
            history: result.history,
        });
    },

    canUndo: () => get().history.past.length > 0,
    canRedo: () => get().history.future.length > 0,

    setPreviewMode: (enabled) => set({ previewMode: enabled }),
    setViewport: (viewport) => set({ viewport }),

    loadSchemaFromIndexedDB: async (projectId) => {
        if (typeof window === 'undefined') return false;

        try {
            const { indexedDBService } = await import('../services/indexedDB.service');
            const schema = await indexedDBService.loadSchema(projectId);

            if (schema && typeof schema === 'object' && schema.root) {
                set({
                    schema,
                    activeNodeId: null,
                    history: EMPTY_HISTORY,
                });
                return true;
            }
        } catch (error) {
            console.error('Failed to load schema from IndexedDB:', error);
        }

        return false;
    },
}));
