# Builder Drag and Drop Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade VNBuilder's visual builder so users can safely drag components from the sidebar into the canvas, move nodes across valid parents, manage layers, use undo/redo, preview the page, and edit common properties with clearer controls.

**Architecture:** Add centralized schema utilities and node metadata, then route all builder mutations through validated store actions. Keep `dnd-kit` in the UI layer, but move parent/child rules, recursive deletion, and history behavior into pure TypeScript modules with tests.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Zustand, dnd-kit, lucide-react, Vitest, MongoDB-backed project persistence.

---

## Files

Create:

- `src/features/builder/schema/node.metadata.ts` - declares which node types can contain children, default props, labels, icons, and property capability flags.
- `src/features/builder/schema/schema.utils.ts` - pure schema helpers for validation, traversal, insertion, moving, recursive deletion, and normalization.
- `src/features/builder/store/builder.history.ts` - small bounded history helper for undo/redo snapshots.
- `src/features/builder/components/CanvasDropZone.tsx` - reusable empty/inside drop target for containers.
- `src/features/builder/components/DraggableComponentItem.tsx` - sidebar item that supports both click-add and drag-add.
- `src/features/builder/schema/__tests__/schema.utils.test.ts`
- `src/features/builder/store/__tests__/builder.store.test.ts`

Modify:

- `src/features/builder/schema/node.types.ts` - add typed move target, viewport, builder mode, and metadata-related types.
- `src/features/builder/store/builder.store.ts` - use schema utilities, add safe mutations, undo/redo, preview mode, viewport state.
- `src/features/builder/components/Canvas.tsx` - handle sidebar drag sources, cross-parent moves, viewport sizing, preview mode.
- `src/features/builder/components/SortableNode.tsx` - add drag handle support and preview-mode disabled state.
- `src/features/builder/components/NodeRenderer.tsx` - render drop zones, pass editor chrome state, avoid invalid child rendering assumptions.
- `src/features/builder/components/LeftSidebar.tsx` - replace duplicated item metadata with `node.metadata.ts` and draggable items.
- `src/features/builder/components/LayoutTree.tsx` - add collapse/expand, search filtering, recursive delete messaging.
- `src/features/builder/components/PropertyPanel.tsx` - use metadata to show relevant sections.
- `src/features/builder/components/properties/StyleSection.tsx` - add structured color/spacing/sizing controls.
- `src/features/builder/components/properties/LayoutSection.tsx` - tighten layout controls.
- `src/app/(dashboard)/builder/[projectId]/page.tsx` - wire undo/redo, preview, and viewport controls.
- `src/features/codegen/__tests__/generateComponent.test.ts` - add compatibility test only if schema output changes.
- `docs/progress.md` - update builder capability status after implementation.

---

## Task 1: Add Node Metadata and Schema Utilities

**Files:**

- Create: `src/features/builder/schema/node.metadata.ts`
- Create: `src/features/builder/schema/schema.utils.ts`
- Create: `src/features/builder/schema/__tests__/schema.utils.test.ts`
- Modify: `src/features/builder/schema/node.types.ts`

- [ ] **Step 1: Write failing schema utility tests**

Create `src/features/builder/schema/__tests__/schema.utils.test.ts` with tests for:

```ts
import { describe, expect, it } from "vitest";
import {
  canHaveChildren,
  canAcceptChild,
  collectDescendantIds,
  deleteNodeRecursive,
  insertChildAt,
  moveNodeInSchema,
} from "../schema.utils";
import type { BuilderSchema } from "../node.types";

const schema: BuilderSchema = {
  root: { id: "root", type: "page", props: {}, children: ["section"], parentId: null },
  section: { id: "section", type: "section", props: {}, children: ["text"], parentId: "root" },
  text: { id: "text", type: "text", props: { content: "Hello" }, children: [], parentId: "section" },
  button: { id: "button", type: "button", props: {}, children: [], parentId: "root" },
};

describe("schema utils", () => {
  it("knows which node types can have children", () => {
    expect(canHaveChildren("section")).toBe(true);
    expect(canHaveChildren("container")).toBe(true);
    expect(canHaveChildren("grid")).toBe(true);
    expect(canHaveChildren("text")).toBe(false);
    expect(canHaveChildren("button")).toBe(false);
  });

  it("rejects children inside leaf nodes", () => {
    expect(canAcceptChild(schema.text, "button")).toBe(false);
    expect(canAcceptChild(schema.section, "button")).toBe(true);
  });

  it("collects descendants before recursive delete", () => {
    expect(collectDescendantIds(schema, "section")).toEqual(["text"]);
  });

  it("deletes a node and all descendants", () => {
    const result = deleteNodeRecursive(schema, "section");
    expect(result.root.children).toEqual([]);
    expect(result.section).toBeUndefined();
    expect(result.text).toBeUndefined();
  });

  it("moves a node across valid parents", () => {
    const result = moveNodeInSchema(schema, "button", { overId: "section", position: "inside" });
    expect(result.section.children).toEqual(["text", "button"]);
    expect(result.button.parentId).toBe("section");
    expect(result.root.children).toEqual(["section"]);
  });

  it("prevents moving a node inside its descendant", () => {
    const result = moveNodeInSchema(schema, "section", { overId: "text", position: "inside" });
    expect(result).toBe(schema);
  });
});
```

- [ ] **Step 2: Run tests and confirm failure**

Run:

```bash
npm.cmd run test -- src/features/builder/schema/__tests__/schema.utils.test.ts
```

Expected: FAIL because `schema.utils.ts` does not exist.

- [ ] **Step 3: Add builder types**

In `src/features/builder/schema/node.types.ts`, add:

```ts
export type MovePosition = "before" | "after" | "inside";

export interface MoveTarget {
  overId: string;
  position: MovePosition;
}

export type BuilderViewport = "desktop" | "tablet" | "mobile";
```

- [ ] **Step 4: Add metadata**

Create `src/features/builder/schema/node.metadata.ts`:

```ts
import type { NodeProps, NodeType } from "./node.types";

export interface NodeMetadata {
  type: NodeType;
  label: string;
  category: "layout" | "basic" | "form" | "media";
  canHaveChildren: boolean;
  defaultProps: NodeProps;
}

export const NODE_METADATA: Record<NodeType, NodeMetadata> = {
  page: { type: "page", label: "Page", category: "layout", canHaveChildren: true, defaultProps: { className: "min-h-screen bg-white text-black p-8" } },
  container: { type: "container", label: "Container", category: "layout", canHaveChildren: true, defaultProps: {} },
  section: { type: "section", label: "Section", category: "layout", canHaveChildren: true, defaultProps: {} },
  header: { type: "header", label: "Header", category: "layout", canHaveChildren: true, defaultProps: {} },
  footer: { type: "footer", label: "Footer", category: "layout", canHaveChildren: true, defaultProps: {} },
  flex: { type: "flex", label: "Flex", category: "layout", canHaveChildren: true, defaultProps: { style: { display: "flex", gap: "12px" } } },
  grid: { type: "grid", label: "Grid", category: "layout", canHaveChildren: true, defaultProps: { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" } } },
  text: { type: "text", label: "Text", category: "basic", canHaveChildren: false, defaultProps: { content: "New text" } },
  button: { type: "button", label: "Button", category: "basic", canHaveChildren: false, defaultProps: { content: "Button" } },
  icon: { type: "icon", label: "Icon", category: "basic", canHaveChildren: false, defaultProps: { icon: "Star", size: 24 } },
  input: { type: "input", label: "Input", category: "form", canHaveChildren: false, defaultProps: { type: "text", placeholder: "Type here..." } },
  image: { type: "image", label: "Image", category: "media", canHaveChildren: false, defaultProps: { alt: "Image" } },
};

export function getNodeMetadata(type: NodeType) {
  return NODE_METADATA[type];
}
```

- [ ] **Step 5: Implement schema utilities**

Create `src/features/builder/schema/schema.utils.ts` with:

```ts
import { nanoid } from "nanoid";
import type { BuilderNode, BuilderSchema, MoveTarget, NodeProps, NodeType } from "./node.types";
import { getNodeMetadata } from "./node.metadata";

export function canHaveChildren(type: NodeType) {
  return getNodeMetadata(type).canHaveChildren;
}

export function canAcceptChild(parent: BuilderNode | undefined, child: BuilderNode | NodeType) {
  if (!parent) return false;
  const childType = typeof child === "string" ? child : child.type;
  return canHaveChildren(parent.type) && childType !== "page";
}

export function createBuilderNode(type: NodeType, parentId: string, props: NodeProps = {}): BuilderNode {
  const metadata = getNodeMetadata(type);
  return {
    id: nanoid(),
    type,
    props: { ...metadata.defaultProps, ...props },
    children: [],
    parentId,
  };
}

export function collectDescendantIds(schema: BuilderSchema, nodeId: string): string[] {
  const node = schema[nodeId];
  if (!node) return [];
  return node.children.flatMap((childId) => [childId, ...collectDescendantIds(schema, childId)]);
}

export function isDescendant(schema: BuilderSchema, ancestorId: string, possibleDescendantId: string) {
  return collectDescendantIds(schema, ancestorId).includes(possibleDescendantId);
}

export function insertChildAt(children: string[], childId: string, index: number) {
  const next = children.filter((id) => id !== childId);
  next.splice(Math.max(0, Math.min(index, next.length)), 0, childId);
  return next;
}

export function deleteNodeRecursive(schema: BuilderSchema, nodeId: string) {
  const node = schema[nodeId];
  if (!node || nodeId === "root" || !node.parentId) return schema;

  const idsToDelete = [nodeId, ...collectDescendantIds(schema, nodeId)];
  const next: BuilderSchema = { ...schema };
  for (const id of idsToDelete) delete next[id];

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
  if (!active || !over || activeId === "root" || activeId === target.overId) return schema;
  if (isDescendant(schema, activeId, target.overId)) return schema;

  const sourceParent = active.parentId ? schema[active.parentId] : undefined;
  if (!sourceParent) return schema;

  const targetParentId = target.position === "inside" ? over.id : over.parentId;
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
    target.position === "inside"
      ? freshTargetParent.children.length
      : target.position === "before"
        ? overIndex
        : overIndex + 1;

  next[targetParent.id] = {
    ...freshTargetParent,
    children: insertChildAt(freshTargetParent.children, activeId, insertIndex),
  };
  next[activeId] = { ...active, parentId: targetParent.id };

  return next;
}
```

- [ ] **Step 6: Run schema tests**

Run:

```bash
npm.cmd run test -- src/features/builder/schema/__tests__/schema.utils.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/features/builder/schema
git commit -m "feat: add builder schema utilities"
```

---

## Task 2: Refactor Store Mutations and Add History

**Files:**

- Create: `src/features/builder/store/builder.history.ts`
- Create: `src/features/builder/store/__tests__/builder.store.test.ts`
- Modify: `src/features/builder/store/builder.store.ts`

- [ ] **Step 1: Write failing store tests**

Create tests for:

- `addNode` rejects leaf parents and falls back only when caller passes a valid parent.
- `moveNode` supports cross-parent move.
- `deleteNode` removes descendants.
- `undo` and `redo` restore schema snapshots.
- `setViewport` and `setPreviewMode` update UI state only.

- [ ] **Step 2: Run store tests and confirm failure**

Run:

```bash
npm.cmd run test -- src/features/builder/store/__tests__/builder.store.test.ts
```

Expected: FAIL because history/actions are not implemented.

- [ ] **Step 3: Implement history helper**

Create a bounded history helper:

```ts
import type { BuilderSchema } from "../schema/node.types";

export interface BuilderHistory {
  past: BuilderSchema[];
  future: BuilderSchema[];
}

export function pushHistory(history: BuilderHistory, current: BuilderSchema, limit = 50): BuilderHistory {
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
```

- [ ] **Step 4: Refactor builder store**

Update `builder.store.ts` to:

- Add `history`, `previewMode`, `viewport`.
- Use `createBuilderNode`, `canAcceptChild`, `moveNodeInSchema`, `deleteNodeRecursive`.
- Push history before schema-changing actions.
- Return `string | null` from `addNode`.
- Return `boolean` from `moveNode` and `deleteNode`.
- Clear selected node if it was deleted.

- [ ] **Step 5: Run store tests**

Run:

```bash
npm.cmd run test -- src/features/builder/store/__tests__/builder.store.test.ts
```

Expected: PASS.

- [ ] **Step 6: Run existing codegen tests**

Run:

```bash
npm.cmd run test
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/features/builder/store src/features/builder/schema
git commit -m "feat: harden builder store mutations"
```

---

## Task 3: Sidebar Drag Sources and Canvas Drop Targets

**Files:**

- Create: `src/features/builder/components/DraggableComponentItem.tsx`
- Create: `src/features/builder/components/CanvasDropZone.tsx`
- Modify: `src/features/builder/components/LeftSidebar.tsx`
- Modify: `src/features/builder/components/Canvas.tsx`
- Modify: `src/features/builder/components/NodeRenderer.tsx`

- [ ] **Step 1: Add drag source component**

Create `DraggableComponentItem` with `useDraggable({ id: \`palette:${type}\`, data: { kind: "palette", type } })`. It should render the existing icon/label UI and call `onClick(type)` for click-add fallback.

- [ ] **Step 2: Add drop zone component**

Create `CanvasDropZone` using `useDroppable({ id, data })`. It should render a small empty-state target when a container has no children and use a stronger border when `isOver`.

- [ ] **Step 3: Replace sidebar item rendering**

Modify `LeftSidebar.tsx` to:

- Build categories from `NODE_METADATA`.
- Use `DraggableComponentItem`.
- On click, add to selected node only if selected node can accept children; otherwise add to nearest valid parent or root.

- [ ] **Step 4: Update canvas drag end handling**

Modify `Canvas.tsx` so `handleDragEnd` handles:

- Existing node drag: `moveNode(activeId, target)`.
- Palette drag: `addNode(parentId, type, props, index)`.
- Invalid drops: no mutation.

- [ ] **Step 5: Render inside drop targets**

Modify `NodeRenderer.tsx` to render `CanvasDropZone` inside nodes that can have children, especially when children are empty.

- [ ] **Step 6: Manual browser verification**

Run:

```bash
npm.cmd run dev
```

Expected:

- Drag `Text` from sidebar into root.
- Drag `Button` into a section/container.
- Drag into `Text` is rejected.
- Empty containers show a usable drop target.

- [ ] **Step 7: Run verification**

```bash
npm.cmd run test
npm.cmd run lint
```

Expected: PASS, allowing pre-existing lint warnings only.

- [ ] **Step 8: Commit**

```bash
git add src/features/builder/components src/features/builder/schema src/features/builder/store
git commit -m "feat: drag components onto builder canvas"
```

---

## Task 4: Cross-Parent Reorder UX and Drag Handles

**Files:**

- Modify: `src/features/builder/components/SortableNode.tsx`
- Modify: `src/features/builder/components/NodeRenderer.tsx`
- Modify: `src/features/builder/components/Canvas.tsx`

- [ ] **Step 1: Add drag handle UI**

Update `SortableNode` to expose listeners only on a small handle, not the whole node. The handle should be hidden in preview mode.

- [ ] **Step 2: Improve target calculation**

In `Canvas.tsx`, use `active.data.current` and `over.data.current` to resolve `MoveTarget` as `inside`, `before`, or `after`.

- [ ] **Step 3: Add visual selected/hover states**

In `NodeRenderer.tsx`, keep selection ring, but avoid conflicting with drop indicators.

- [ ] **Step 4: Verify selection vs drag behavior**

Manual checks:

- Click selects node without moving it.
- Drag handle moves node.
- Moving within same parent still works.
- Moving across parents works.

- [ ] **Step 5: Run tests and lint**

```bash
npm.cmd run test
npm.cmd run lint
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/features/builder/components
git commit -m "feat: improve builder drag handles"
```

---

## Task 5: Layer Tree Search, Collapse, and Safe Delete

**Files:**

- Modify: `src/features/builder/components/LayoutTree.tsx`
- Reuse: `src/features/builder/schema/schema.utils.ts`

- [ ] **Step 1: Add local state**

Add:

```ts
const [collapsedNodeIds, setCollapsedNodeIds] = useState<Set<string>>(new Set());
const [query, setQuery] = useState("");
```

- [ ] **Step 2: Implement filtering**

Filter by node type, id prefix, and `props.content`. Keep ancestors visible when a descendant matches.

- [ ] **Step 3: Implement collapse/expand**

Use chevron buttons to toggle `collapsedNodeIds`. Root should start expanded.

- [ ] **Step 4: Improve delete warning**

Use `collectDescendantIds(schema, nodeId).length` to show whether descendants will also be deleted.

- [ ] **Step 5: Manual verification**

Expected:

- Search `button` filters layers.
- Collapse hides children.
- Delete parent removes children from tree and canvas.

- [ ] **Step 6: Run tests and lint**

```bash
npm.cmd run test
npm.cmd run lint
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/features/builder/components/LayoutTree.tsx
git commit -m "feat: improve builder layer tree"
```

---

## Task 6: Toolbar Preview, Undo/Redo, and Viewports

**Files:**

- Modify: `src/app/(dashboard)/builder/[projectId]/page.tsx`
- Modify: `src/features/builder/components/Canvas.tsx`
- Modify: `src/features/builder/components/NodeRenderer.tsx`
- Modify: `src/features/builder/components/SortableNode.tsx`
- Modify: `src/features/builder/registry/Box.tsx`
- Modify: `src/features/builder/registry/Grid.tsx`

- [ ] **Step 1: Wire undo/redo buttons**

In builder page, read `undo`, `redo`, `canUndo`, `canRedo` from store. Disable controls when unavailable.

- [ ] **Step 2: Wire preview toggle**

Preview button should toggle `previewMode`. In preview mode:

- Hide selection ring.
- Hide drag handles.
- Hide dashed debug borders by passing `debug={false}` or equivalent through rendering.

- [ ] **Step 3: Wire viewport controls**

Add viewport widths:

```ts
const VIEWPORT_WIDTHS = {
  desktop: "1200px",
  tablet: "768px",
  mobile: "390px",
} as const;
```

Canvas should center the page surface and apply the selected width.

- [ ] **Step 4: Manual verification**

Expected:

- Undo after add removes node.
- Redo restores node.
- Preview hides editor chrome.
- Tablet/mobile visibly resize canvas.

- [ ] **Step 5: Run tests, lint, build**

```bash
npm.cmd run test
npm.cmd run lint
npm.cmd run build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app/(dashboard)/builder/[projectId]/page.tsx src/features/builder/components src/features/builder/registry
git commit -m "feat: enable builder toolbar actions"
```

---

## Task 7: Improve Property Controls

**Files:**

- Modify: `src/features/builder/components/PropertyPanel.tsx`
- Modify: `src/features/builder/components/properties/StyleSection.tsx`
- Modify: `src/features/builder/components/properties/LayoutSection.tsx`
- Modify: `src/features/builder/components/properties/ContentSection.tsx`

- [ ] **Step 1: Replace color text-only inputs**

Use `<input type="color">` plus a text input for `color`, `backgroundColor`, and `borderColor`.

- [ ] **Step 2: Add spacing controls**

Add simple fields for `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`, and same for margin. Keep the existing shorthand field only if needed as advanced fallback.

- [ ] **Step 3: Tighten numeric fields**

For opacity, size, width, height, border width, and radius, avoid storing `NaN`. Store strings with units when user provides units; otherwise append `px` for fields labeled px.

- [ ] **Step 4: Improve layout controls**

Use select/segmented controls for `display`, `flexDirection`, `justifyContent`, `alignItems`, grid columns, and gap.

- [ ] **Step 5: Manual verification**

Expected:

- Color picker updates canvas immediately.
- Padding/margin controls update selected node.
- Invalid numeric input does not break rendering.

- [ ] **Step 6: Run tests, lint, build**

```bash
npm.cmd run test
npm.cmd run lint
npm.cmd run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/features/builder/components/PropertyPanel.tsx src/features/builder/components/properties
git commit -m "feat: improve builder property controls"
```

---

## Task 8: Compatibility, Documentation, and Final Verification

**Files:**

- Modify: `src/features/codegen/__tests__/generateComponent.test.ts` only if needed.
- Modify: `docs/progress.md`
- Review: `docs/superpowers/specs/2026-05-18-builder-drag-drop-upgrade-design.md`
- Review: `docs/superpowers/plans/2026-05-18-builder-drag-drop-upgrade.md`

- [ ] **Step 1: Run full verification**

```bash
npm.cmd run test
npm.cmd run lint
npm.cmd run build
```

Expected:

- Tests pass.
- Lint exits 0, allowing existing warnings.
- Build succeeds.

- [ ] **Step 2: Run manual builder smoke test**

Manual flow:

1. Log in.
2. Open an existing project.
3. Drag Section from sidebar into root.
4. Drag Text and Button into Section.
5. Move Button into another valid container.
6. Try dropping Image into Text and confirm it is rejected.
7. Delete Section and confirm descendants disappear.
8. Undo delete.
9. Toggle preview.
10. Toggle mobile viewport.
11. Save.
12. Export code preview.

- [ ] **Step 3: Update progress docs**

Update `docs/progress.md` builder section with:

- Cross-parent drag/drop.
- Sidebar drag/drop.
- Recursive delete.
- Undo/redo.
- Preview and viewport controls.
- Improved property controls.

- [ ] **Step 4: Final commit**

```bash
git add docs/progress.md src/features/builder src/features/codegen
git commit -m "docs: update builder upgrade progress"
```

---

## Execution Notes

- Use @superpowers:subagent-driven-development if executing this plan with subagents.
- Use @superpowers:test-driven-development for Tasks 1 and 2.
- Use @superpowers:verification-before-completion before claiming the branch is complete.
- Commit after each task, matching the user's requested workflow.
- Do not broaden this phase into deployment, AI generation, uploaded assets, or multi-page routing.
