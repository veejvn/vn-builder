import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_SCHEMA, useBuilderStore } from '../builder.store';
import type { BuilderSchema } from '../../schema/node.types';

const createNestedSchema = (): BuilderSchema => ({
    root: { id: 'root', type: 'page', props: {}, children: ['section', 'button'], parentId: null },
    section: { id: 'section', type: 'section', props: {}, children: ['text'], parentId: 'root' },
    text: { id: 'text', type: 'text', props: { content: 'Hello' }, children: [], parentId: 'section' },
    button: { id: 'button', type: 'button', props: { content: 'Click' }, children: [], parentId: 'root' },
});

describe('builder store', () => {
    beforeEach(() => {
        useBuilderStore.getState().setSchema(DEFAULT_SCHEMA);
        useBuilderStore.getState().selectNode(null);
        useBuilderStore.getState().setPreviewMode(false);
        useBuilderStore.getState().setViewport('desktop');
    });

    it('rejects adding children to leaf parents', () => {
        useBuilderStore.getState().setSchema(createNestedSchema());

        const addedId = useBuilderStore.getState().addNode('text', 'button');

        expect(addedId).toBeNull();
        expect(useBuilderStore.getState().schema.text.children).toEqual([]);
        expect(useBuilderStore.getState().canUndo()).toBe(false);
    });

    it('adds nodes to valid parents and records undo history', () => {
        useBuilderStore.getState().setSchema(createNestedSchema());

        const addedId = useBuilderStore.getState().addNode('section', 'button', { content: 'New' });

        expect(addedId).toEqual(expect.any(String));
        expect(useBuilderStore.getState().schema.section.children).toContain(addedId);
        expect(useBuilderStore.getState().schema[addedId!]).toMatchObject({
            type: 'button',
            parentId: 'section',
            props: expect.objectContaining({ content: 'New' }),
        });
        expect(useBuilderStore.getState().canUndo()).toBe(true);
    });

    it('moves nodes across valid parents', () => {
        useBuilderStore.getState().setSchema(createNestedSchema());

        const moved = useBuilderStore.getState().moveNode('button', { overId: 'section', position: 'inside' });

        expect(moved).toBe(true);
        expect(useBuilderStore.getState().schema.section.children).toEqual(['text', 'button']);
        expect(useBuilderStore.getState().schema.button.parentId).toBe('section');
        expect(useBuilderStore.getState().schema.root.children).toEqual(['section']);
    });

    it('keeps legacy string move as before-over reorder', () => {
        useBuilderStore.getState().setSchema({
            ...createNestedSchema(),
            root: { id: 'root', type: 'page', props: {}, children: ['section', 'button', 'container'], parentId: null },
            container: { id: 'container', type: 'container', props: {}, children: [], parentId: 'root' },
        });

        const moved = useBuilderStore.getState().moveNode('container', 'button');

        expect(moved).toBe(true);
        expect(useBuilderStore.getState().schema.root.children).toEqual(['section', 'container', 'button']);
    });

    it('deletes nodes recursively and clears active descendants', () => {
        useBuilderStore.getState().setSchema(createNestedSchema());
        useBuilderStore.getState().selectNode('text');

        const deleted = useBuilderStore.getState().deleteNode('section');

        expect(deleted).toBe(true);
        expect(useBuilderStore.getState().schema.section).toBeUndefined();
        expect(useBuilderStore.getState().schema.text).toBeUndefined();
        expect(useBuilderStore.getState().schema.root.children).toEqual(['button']);
        expect(useBuilderStore.getState().activeNodeId).toBeNull();
    });

    it('undoes and redoes schema snapshots', () => {
        useBuilderStore.getState().setSchema(createNestedSchema());

        const addedId = useBuilderStore.getState().addNode('section', 'button');
        expect(useBuilderStore.getState().schema[addedId!]).toBeDefined();

        useBuilderStore.getState().undo();
        expect(useBuilderStore.getState().schema[addedId!]).toBeUndefined();
        expect(useBuilderStore.getState().canRedo()).toBe(true);

        useBuilderStore.getState().redo();
        expect(useBuilderStore.getState().schema[addedId!]).toBeDefined();
        expect(useBuilderStore.getState().canRedo()).toBe(false);
    });

    it('updates preview mode and viewport without touching history', () => {
        useBuilderStore.getState().setSchema(createNestedSchema());

        useBuilderStore.getState().setPreviewMode(true);
        useBuilderStore.getState().setViewport('mobile');

        expect(useBuilderStore.getState().previewMode).toBe(true);
        expect(useBuilderStore.getState().viewport).toBe('mobile');
        expect(useBuilderStore.getState().canUndo()).toBe(false);
    });
});
