import { useEffect, useState, useRef } from 'react';
import { useBuilderStore } from '../store/builder.store';
import { useUpdateProject } from '@/features/project/hooks/useProjects';
import { toast } from 'sonner';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export const useAutoSave = (projectId: string, enabled: boolean = true) => {
    const schema = useBuilderStore((state) => state.schema);
    const [status, setStatus] = useState<SaveStatus>('idle');
    const [lastSavedSchema, setLastSavedSchema] = useState<string>('');
    const { mutate, isPending } = useUpdateProject();

    // Use a ref to track the timeout so we can clear it
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!enabled) return;

        // Skip initial empty schema or if it matches last saved
        const currentSchemaString = JSON.stringify(schema);
        if (currentSchemaString === lastSavedSchema) return;

        setStatus('saving');

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            mutate(
                {
                    projectId,
                    data: { schema }
                },
                {
                    onSuccess: () => {
                        setStatus('saved');
                        setLastSavedSchema(currentSchemaString);
                        setTimeout(() => setStatus('idle'), 2000);
                    },
                    onError: (error) => {
                        console.error('Auto-save error:', error);
                        setStatus('error');
                        // toast handled in the mutation hook, but we can add specific one here if needed
                    }
                }
            );
        }, 1000); // 1 second debounce

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [schema, projectId, mutate, enabled, lastSavedSchema]); // Added enabled and lastSavedSchema to deps

    // Helper to sync initial state
    const setInitialState = (initialSchema: any) => {
        setLastSavedSchema(JSON.stringify(initialSchema));
    }

    return { status, setInitialState };
};
