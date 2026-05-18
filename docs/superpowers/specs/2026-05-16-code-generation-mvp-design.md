# Code Generation MVP Design

## Goal

Build the first production-shaped code generation flow for VNBuilder: take a saved builder schema, generate a minimal runnable Next.js project, let the user preview generated files, and export the result as a ZIP.

This phase intentionally stops before GitHub push, Vercel deployment, collaboration, template gallery, or AI generation. The success condition is simple: a real project created in the builder can be exported, unzipped, installed, and run locally.

## Current Context

VNBuilder already has the core builder surface:

- The project schema is stored on `Project.schema` in MongoDB.
- The builder state lives in `src/features/builder/store/builder.store.ts`.
- Nodes are rendered recursively by `src/features/builder/components/NodeRenderer.tsx`.
- Builder components are registered in `src/features/builder/registry/index.tsx`.
- The builder page already has an `Export Code` button in `src/app/(dashboard)/builder/[projectId]/page.tsx`.

The current schema is a normalized node map:

```ts
type BuilderSchema = Record<string, BuilderNode>;

interface BuilderNode {
  id: string;
  type: NodeType;
  props: Record<string, any>;
  children: string[];
  parentId?: string | null;
}
```

This is good enough for rendering, but code generation needs stricter assumptions about node props, supported node types, escaping, file output, and failure handling.

## Scope

In scope:

- Normalize existing schema input before generation.
- Generate a minimal Next.js App Router project.
- Generate `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `package.json`, `tsconfig.json`, `next.config.ts`, and a short `README.md`.
- Convert supported builder nodes into JSX.
- Convert known visual props into safe inline styles while preserving existing `className` strings when present.
- Provide a code preview dialog from the builder page.
- Provide a ZIP export API route.
- Add tests for the pure generator.

Out of scope:

- GitHub repository creation.
- Vercel deployment.
- Component library extraction.
- Complex responsive breakpoint editing.
- User-authenticated generated projects.
- Runtime drag/drop in the exported project.
- Pixel-perfect parity with the builder canvas.

## Architecture

The implementation should introduce a new feature module:

```txt
src/features/codegen/
  codegen.types.ts
  normalizeSchema.ts
  generateProject.ts
  generateComponent.ts
  generateStyles.ts
  generateFiles.ts
  componentTemplates.ts
  index.ts
```

The codegen module must be framework-adjacent but mostly pure TypeScript. It should accept a builder schema and return generated file objects:

```ts
export interface GeneratedFile {
  path: string;
  content: string;
  language: "tsx" | "ts" | "css" | "json" | "md";
}
```

The UI and API should consume this interface instead of assembling strings themselves.

## Data Flow

Preview flow:

```txt
Builder page
-> current Zustand schema
-> generateProject(schema)
-> ExportCodeDialog
-> user selects files and reads generated content
```

Download flow:

```txt
POST /api/project/[projectId]/export
-> authenticate session
-> verify workspace membership
-> receive the current schema from the builder
-> generateProject(schema)
-> zip generated files
-> return application/zip
```

The preview can run client-side because it uses the already-loaded builder schema. The ZIP route should run server-side, but it must receive the current schema from the client so the preview and downloaded ZIP are generated from the same data. The route still loads the project from MongoDB for authorization, ownership context, and filename metadata.

## Schema Normalization

The first generator version should support both the current raw schema shape and a future versioned shape.

Supported inputs:

```ts
type LegacyBuilderSchema = Record<string, BuilderNode>;

interface VersionedBuilderSchema {
  version: 1;
  nodes: Record<string, BuilderNode>;
}
```

The normalizer should return:

```ts
interface NormalizedBuilderSchema {
  version: 1;
  nodes: Record<string, BuilderNode>;
  rootId: "root";
}
```

Rules:

- If input has `nodes`, use it.
- If input has `root`, treat input as legacy node map.
- If input is empty or invalid, produce a default empty page schema.
- If a child id is missing, skip that child and record a warning.
- If a node type is unknown, render a harmless placeholder comment in generated JSX.

## JSX Generation

The generator should recursively walk from `root`.

Node mapping:

| Builder type | Generated element |
| --- | --- |
| `page` | React fragment or top-level `main` |
| `container` | `div` |
| `flex` | `div` with flex classes |
| `grid` | `div` with grid classes |
| `section` | `section` |
| `header` | `header` |
| `footer` | `footer` |
| `text` | `p`, `span`, or heading based on props |
| `button` | `button` |
| `image` | `img` |
| `input` | `input` |
| `icon` | placeholder `span`, unless icon export support is added later |

Generation rules:

- Escape text content before interpolation.
- Do not emit user-controlled raw JSX.
- Preserve `className` when props already contain classes, but do not require Tailwind for the exported project to render.
- Use inline style for supported visual props so the exported project is dependency-light.
- Preserve child order from `children`.
- Produce readable indentation.

## Styling Strategy

The first release should support a conservative style subset:

- Existing `props.className`
- `backgroundColor`
- `color`
- `width`
- `height`
- `padding`
- `margin`
- `display`
- `direction`
- `gap`
- `alignItems`
- `justifyContent`
- `gridTemplateColumns`
- `borderRadius`
- `fontSize`
- `fontWeight`
- `textAlign`

Generated components should merge:

1. semantic default classes,
2. user-provided `className`,
3. inline style for supported visual props.

The generator should not try to support every CSS property in the first phase. Unknown props should be ignored unless they are component content props such as `text`, `src`, `alt`, `placeholder`, or `href`.

## Generated Project Shape

Generated ZIP contents:

```txt
vn-builder-export/
  app/
    globals.css
    layout.tsx
    page.tsx
  public/
  package.json
  next.config.ts
  tsconfig.json
  README.md
```

Generated project stack:

- Next.js App Router
- React
- TypeScript

The MVP generated project should not depend on Tailwind. Codegen may preserve existing `className` values for readability, but all supported visual props must also be emitted as safe inline styles so the exported project remains runnable without a Tailwind/PostCSS setup.

For MVP, the exported project should be static and dependency-light. It does not need authentication, database access, shadcn/ui, Zustand, dnd-kit, or builder runtime code.

## UI Design

The builder page should replace the inert `Export Code` button with a dialog.

Dialog layout:

- Left column: generated file list.
- Right column: read-only code viewer.
- Header: project export title and current selected file path.
- Footer/actions: `Download ZIP`, `Close`.

States:

- Loading generation.
- Generation error.
- Empty schema fallback.
- Download in progress.

The dialog should use existing UI primitives from `src/components/ui`.

## API Design

Add:

```txt
src/app/api/project/[projectId]/export/route.ts
```

`POST` behavior:

- Require an authenticated session.
- Validate `projectId`.
- Load the project with `ProjectService.getProjectById`.
- Return `404` if not found.
- Load the project workspace with `WorkspaceService.getWorkspaceById`.
- Return `403` unless the current user is a workspace member.
- Read the current schema from the request body.
- Generate project files from the current schema, not stale saved project data.
- ZIP the files.
- Return `application/zip`.

Authorization must match the existing project read route: any workspace member can export, while non-members cannot. If project-level permission checks become stricter later, the export route should move to the same shared authorization helper.

## Testing

Add a lightweight test setup with Vitest if none exists.

Primary tests should target pure codegen functions:

- Normalizes legacy schema.
- Falls back for empty schema.
- Generates a valid file list.
- Generates text node JSX.
- Generates button node JSX.
- Preserves nested child order.
- Escapes text content.
- Skips missing child ids without crashing.
- Emits a runnable `package.json` and `app/page.tsx`.

UI tests are optional for this phase. Manual browser verification is enough for the dialog if generator tests and build pass.

## Risks

- Current `props` are untyped, so codegen could produce inconsistent output if it assumes too much.
- Large schemas may produce big strings and slow client-side preview.
- Existing builder `className` values may reference Tailwind classes that have no effect in the dependency-light exported project.
- Existing project authorization may not be strict enough for export.

Mitigations:

- Normalize and sanitize schema before generation.
- Keep generation pure and testable.
- Generate a simple standalone project with minimal config and inline styles for supported visual props.
- Keep API authorization isolated and easy to harden.

## Acceptance Criteria

- A user can open a builder project and preview generated files.
- A user can download a ZIP from the builder.
- The ZIP contains a minimal Next.js project.
- The exported project can run with `npm install` and `npm run dev`.
- Generator tests pass.
- `npm run lint` and `npm run build` pass in the VNBuilder repo.
