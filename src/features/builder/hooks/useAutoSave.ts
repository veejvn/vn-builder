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

    useEffect(() => {
        if (isDirty) {
            setStatus('unsaved');
        } else if (status === 'unsaved') {
            // If we undid changes back to original state
            setStatus('saved');
        }
    }, [isDirty, status]);

    const save = useCallback(() => {
        if (!projectId) return;

        setStatus('saving');

        mutate(
            {
                projectId,
                data: { schema }
            },
            {
                onSuccess: () => {
                    setStatus('saved');
                    setLastSavedSchema(JSON.stringify(schema));
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
