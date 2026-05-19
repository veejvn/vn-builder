import type { BuilderSchema } from '../schema/node.types';

export interface BuilderHistory {
    past: BuilderSchema[];
    future: BuilderSchema[];
}

export const EMPTY_HISTORY: BuilderHistory = {
    past: [],
    future: [],
};

export function pushHistory(
    history: BuilderHistory,
    current: BuilderSchema,
    limit = 50,
): BuilderHistory {
    return {
        past: [...history.past, current].slice(-limit),
        future: [],
    };
}

export function popUndo(history: BuilderHistory, current: BuilderSchema) {
    const previous = history.past.at(-1);
    if (!previous) return null;

    return {
        schema: previous,
        history: {
            past: history.past.slice(0, -1),
            future: [current, ...history.future],
        },
    };
}

export function popRedo(history: BuilderHistory, current: BuilderSchema) {
    const next = history.future[0];
    if (!next) return null;

    return {
        schema: next,
        history: {
            past: [...history.past, current],
            future: history.future.slice(1),
        },
    };
}
