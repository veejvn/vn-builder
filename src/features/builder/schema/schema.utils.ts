import { nanoid } from 'nanoid';
import type { BuilderNode, BuilderSchema, MoveTarget, NodeProps, NodeType } from './node.types';
import { getNodeMetadata } from './node.metadata';

export function canHaveChildren(type: NodeType) {
    return getNodeMetadata(type).canHaveChildren;
}

export function canAcceptChild(parent: BuilderNode | undefined, child: BuilderNode | NodeType) {
    if (!parent) return false;

    const childType = typeof child === 'string' ? child : child.type;
    return canHaveChildren(parent.type) && childType !== 'page';
}

export function createBuilderNode(type: NodeType, parentId: string | null, props: NodeProps = {}): BuilderNode {
    const metadata = getNodeMetadata(type);

    return {
        id: nanoid(),
        type,
        props: {
            ...metadata.defaultProps,
            ...props,
        },
        children: [],
        parentId,
    };
}

export function collectDescendantIds(schema: BuilderSchema, nodeId: string): string[] {
    const node = schema[nodeId];
    if (!node) return [];

    return node.children.flatMap((childId) => [
        childId,
        ...collectDescendantIds(schema, childId),
    ]);
}

export function isDescendant(schema: BuilderSchema, ancestorId: string, possibleDescendantId: string) {
    return collectDescendantIds(schema, ancestorId).includes(possibleDescendantId);
}

export function insertChildAt(children: string[], childId: string, index: number) {
    const next = children.filter((id) => id !== childId);
    const boundedIndex = Math.max(0, Math.min(index, next.length));
    next.splice(boundedIndex, 0, childId);
    return next;
}

export function deleteNodeRecursive(schema: BuilderSchema, nodeId: string) {
    const node = schema[nodeId];
    if (!node || nodeId === 'root' || !node.parentId) return schema;

    const idsToDelete = [nodeId, ...collectDescendantIds(schema, nodeId)];
    const next: BuilderSchema = { ...schema };

    for (const id of idsToDelete) {
        delete next[id];
    }

    const parent = schema[node.parentId];
    if (parent) {
        next[parent.id] = {
            ...parent,
            children: parent.children.filter((childId) => childId !== nodeId),
        };
    }

    return next;
}

export function moveNodeInSchema(schema: BuilderSchema, activeId: string, target: MoveTarget) {
    const active = schema[activeId];
    const over = schema[target.overId];

    if (!active || !over || activeId === 'root' || activeId === target.overId) {
        return schema;
    }

    if (isDescendant(schema, activeId, target.overId)) {
        return schema;
    }

    const sourceParent = active.parentId ? schema[active.parentId] : undefined;
    if (!sourceParent) return schema;

    const targetParentId = target.position === 'inside' ? over.id : over.parentId;
    const targetParent = targetParentId ? schema[targetParentId] : undefined;
    if (!targetParent || !canAcceptChild(targetParent, active)) return schema;

    const next: BuilderSchema = {
        ...schema,
        [sourceParent.id]: {
            ...sourceParent,
            children: sourceParent.children.filter((childId) => childId !== activeId),
        },
    };

    const freshTargetParent = next[targetParent.id];
    const overIndex = freshTargetParent.children.indexOf(over.id);
    const insertIndex =
        target.position === 'inside'
            ? freshTargetParent.children.length
            : target.position === 'before'
                ? overIndex
                : overIndex + 1;

    next[targetParent.id] = {
        ...freshTargetParent,
        children: insertChildAt(freshTargetParent.children, activeId, insertIndex),
    };
    next[activeId] = { ...active, parentId: targetParent.id };

    return next;
}
