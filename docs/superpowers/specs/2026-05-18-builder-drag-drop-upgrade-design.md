# Builder Drag and Drop Upgrade Design

## Goal

Upgrade VNBuilder's visual builder from a basic sortable canvas into a more reliable interface composition tool: users can drag components from the sidebar into the canvas, move nodes across valid parents, manage layers safely, edit properties with clearer controls, and trust that save/export uses a valid schema.

This phase focuses on builder authoring quality. It does not try to become a full Figma/Webflow clone. The success condition is practical: a user can build a nested page layout without creating hidden orphan nodes, without needing to understand the raw schema, and without losing confidence when dragging elements.

## Current Context

VNBuilder already has the core builder surface:

- Builder state lives in `src/features/builder/store/builder.store.ts`.
- The schema is a normalized node map keyed by node id.
- Canvas drag/drop uses `@dnd-kit/core` and `@dnd-kit/sortable`.
- `NodeRenderer` recursively renders nodes and wraps non-root nodes in `SortableNode`.
- `LeftSidebar` can add components by clicking.
- `LayoutTree` can select and delete nodes.
- `PropertyPanel` exposes content, layout, and style inputs.
- Save/recovery is handled by `useManualSave` plus IndexedDB.
- Code generation consumes the builder schema, so schema validity now matters beyond the editor.

The current schema shape is:

```ts
export type BuilderSchema = Record<string, BuilderNode>;

export interface BuilderNode {
  id: string;
  type: NodeType;
  props: NodeProps;
  children: string[];
  parentId?: string | null;
}
```

## Problems To Solve

### Drag and Drop Limitations

The current `moveNode(activeId, overId)` only reorders nodes inside the same parent. Users cannot drag a button from one container into another container, cannot drag from the sidebar into the canvas, and do not receive clear feedback about valid drop targets.

### Schema Safety

The store allows invalid structures:

- Adding children to nodes that do not render children, such as `text`, `button`, `image`, `input`, or `icon`.
- Deleting a parent node without recursively deleting descendants.
- Moving nodes without central validation.
- Storing `NodeProps` as `Record<string, any>` with no component-level prop contract.

### Layer Management

`LayoutTree` is useful for selection and deletion, but it does not support drag/drop, collapse/expand, search filtering, or safe recursive deletion feedback. As pages become nested, users will need layers to be a reliable editing surface.

### Property Editing

The property panel has good coverage but many controls are raw text inputs. That is fast to implement but easy to misuse. Users need structured controls for colors, spacing, sizing, borders, and layout values.

### Toolbar Expectations

The builder toolbar shows preview, undo, redo, desktop, tablet, and mobile controls, but these are mostly visual placeholders. This creates a trust gap because the interface advertises capabilities that do not work yet.

## Scope

In scope:

- Add centralized schema helpers for node metadata, parent validation, recursive traversal, and safe mutations.
- Prevent adding or moving children into leaf nodes.
- Delete nodes recursively.
- Support cross-parent canvas drag/drop for valid parent targets.
- Add sidebar-to-canvas drag/drop.
- Add visible drop target feedback for valid containers and empty containers.
- Add basic undo/redo history for schema mutations.
- Make preview mode functional by hiding editor selection/drag chrome.
- Make device viewport controls change canvas width.
- Improve `LayoutTree` with collapse/expand, search, and safe delete behavior.
- Improve property controls for common style values.
- Add focused tests around schema mutations and validation.
- Keep generated code compatible with the improved schema.

Out of scope:

- Multi-page routing.
- Absolute freeform positioning.
- Real-time collaboration.
- Asset upload/storage.
- AI layout generation.
- Full breakpoint-specific style editing.
- Publishing/deployment changes.
- Replacing `dnd-kit`.

## Architecture

Introduce a small builder domain layer under `src/features/builder/schema` and `src/features/builder/store` so drag/drop UI components do not own schema rules.

```txt
src/features/builder/schema/
  node.types.ts
  node.metadata.ts
  schema.utils.ts

src/features/builder/store/
  builder.store.ts
  builder.history.ts

src/features/builder/components/
  Canvas.tsx
  CanvasDropZone.tsx
  DraggableComponentItem.tsx
  NodeRenderer.tsx
  SortableNode.tsx
  LeftSidebar.tsx
  LayoutTree.tsx
  PropertyPanel.tsx
  properties/
```

The store should expose intent-level actions instead of letting components manipulate schema shape:

```ts
addNode(parentId: string, type: NodeType, props?: NodeProps, index?: number): string | null;
moveNode(activeId: string, target: MoveTarget): boolean;
deleteNode(id: string): boolean;
undo(): void;
redo(): void;
setPreviewMode(enabled: boolean): void;
setViewport(viewport: BuilderViewport): void;
```

`MoveTarget` should describe the user's intent explicitly:

```ts
export type MovePosition = "before" | "after" | "inside";

export interface MoveTarget {
  overId: string;
  position: MovePosition;
}
```

Validation should be centralized:

```ts
canHaveChildren(type: NodeType): boolean;
canAcceptChild(parent: BuilderNode, child: BuilderNode | NodeType): boolean;
canMoveNode(schema: BuilderSchema, activeId: string, target: MoveTarget): boolean;
```

## UX Requirements

### Canvas

- Dragging an existing node should show a clear moving state.
- Valid containers should show a drop affordance.
- Empty containers should still be easy to drop into.
- Invalid drop targets should not mutate schema.
- Selecting an element should not accidentally start drag too easily.
- Preview mode should disable selection rings, dashed debug borders, and drag handles.

### Sidebar

- Users can drag a component from the sidebar into the canvas.
- Users can still click a component to add it to the selected valid parent.
- If the selected node is a leaf node, click-add should fall back to the nearest valid parent or root.

### Layers

- Layers should support collapse/expand.
- Search should filter by node type, id prefix, and common content text.
- Deleting a node with descendants should warn that children will also be deleted.
- Root cannot be deleted.

### Property Panel

- Color fields should use a color input plus text fallback.
- Spacing controls should support common linked/unlinked values.
- Numeric values should avoid silently storing invalid CSS where possible.
- Layout controls should use segmented controls/selects for common values.

### Toolbar

- Undo and redo buttons should call real history actions.
- Preview should toggle editor chrome.
- Desktop/tablet/mobile controls should change the canvas viewport width.

## Data and Migration

Existing project schemas should continue to load. The upgrade should be backward compatible:

- Existing nodes keep their ids, types, props, children, and parent ids.
- Any invalid orphaned descendants encountered during normalization should be ignored or reparented only through an explicit repair helper.
- No database migration is required for this phase.

If a loaded schema contains a parent/child mismatch, the builder should normalize safely in memory before editing and saving.

## Testing Strategy

Prioritize pure store/schema tests before UI tests:

- `schema.utils` tests for parent validation, descendant traversal, insert/reorder behavior, and cycle prevention.
- Store tests for add, move within parent, move across parent, recursive delete, undo, redo.
- React component tests are optional for this phase unless a test setup already supports DOM rendering.
- Manual browser verification should cover drag from sidebar, cross-parent move, delete parent, undo/redo, preview mode, and viewport toggle.

## Risks

- Cross-parent drag/drop can create subtle schema corruption if validation is scattered across components.
- Drag handles may conflict with click selection if the entire node remains draggable.
- Device viewport controls may give a false sense of responsive editing if they only resize the canvas and do not store breakpoint styles.
- Code generation may expose schema problems quickly, so schema normalization must remain compatible with codegen.

## Success Criteria

- Users can drag a new component from the sidebar into root, section, container, flex, and grid nodes.
- Users can move existing nodes across valid parents.
- Users cannot drop children into leaf nodes.
- Deleting a parent removes all descendants from schema.
- Undo/redo works for add, move, update, and delete.
- Preview mode hides editor-only visuals.
- Desktop/tablet/mobile controls visibly resize the canvas.
- Layer search and collapse work.
- Unit tests pass for schema utilities and store actions.
- Existing codegen tests still pass.
