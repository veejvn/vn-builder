import { useEffect, useState, useCallback } from 'react';
import { useBuilderStore } from '../store/builder.store';
import { useUpdateProject } from '@/features/project/hooks/useProjects';
import { toast } from 'sonner';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'unsaved';

export const useManualSave = (projectId: string) => {
    const schema = useBuilderStore((state) => state.schema);
    const [status, setStatus] = useState<SaveStatus>('saved');
    const [lastSavedSchema, setLastSavedSchema] = useState<string>('');
    const { mutate, isPending } = useUpdateProject();

    // Check for changes
    const currentSchemaString = JSON.stringify(schema);
    const isDirty = lastSavedSchema !== '' && currentSchemaString !== lastSavedSchema;

    // Debounced save to IndexedDB
    useEffect(() => {
        if (isDirty && projectId && schema) {
            setStatus('unsaved');

            const saveToIndexedDB = async () => {
                const { indexedDBService } = await import('../services/indexedDB.service');
                await indexedDBService.saveSchema(projectId, schema);
            };

            const timeoutId = setTimeout(saveToIndexedDB, 1000); // Debounce 1s

            return () => clearTimeout(timeoutId);
        } else if (status === 'unsaved') {
            setStatus('saved');
        }
    }, [isDirty, status, projectId, schema]);

    const save = useCallback(() => {
        if (!projectId) return;

        setStatus('saving');

        mutate(
            {
                projectId,
                data: { schema }
            },
            {
                onSuccess: async () => {
                    setStatus('saved');
                    setLastSavedSchema(JSON.stringify(schema));

                    // Clear IndexedDB on successful save
                    const { indexedDBService } = await import('../services/indexedDB.service');
                    await indexedDBService.clearSchema(projectId);

                    toast.success('Project saved successfully');
                },
                onError: (error) => {
                    console.error('Save error:', error);
                    setStatus('error');
                    toast.error('Failed to save project');
                }
            }
        );
    }, [projectId, schema, mutate]);

    // Helper to sync initial state when project loads
    const setInitialState = (initialSchema: any) => {
        setLastSavedSchema(JSON.stringify(initialSchema));
        setStatus('saved');
    }

    return {
        save,
        status: isPending ? 'saving' : status,
        isDirty,
        setInitialState
    };
};
