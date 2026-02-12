import { get, set, del } from 'idb-keyval';
import { BuilderSchema } from '../schema/node.types';

export const indexedDBService = {
    saveSchema: async (projectId: string, schema: BuilderSchema) => {
        try {
            await set(`vn-builder-schema-${projectId}`, schema);
        } catch (error) {
            console.error('IndexedDB save error:', error);
        }
    },

    loadSchema: async (projectId: string): Promise<BuilderSchema | undefined> => {
        try {
            return await get(`vn-builder-schema-${projectId}`);
        } catch (error) {
            console.error('IndexedDB load error:', error);
            return undefined;
        }
    },

    clearSchema: async (projectId: string) => {
        try {
            await del(`vn-builder-schema-${projectId}`);
        } catch (error) {
            console.error('IndexedDB clear error:', error);
        }
    }
};
