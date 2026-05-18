# Code Generation MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Code Generation MVP that turns a VNBuilder schema into a previewable and downloadable Next.js project ZIP.

**Architecture:** Add a pure `src/features/codegen` module that normalizes schema and returns generated file objects. Use that module from a builder export dialog for preview and from a server API route for ZIP download.

**Tech Stack:** Next.js App Router, TypeScript, React, MongoDB/Mongoose, NextAuth, Zustand, JSZip, Vitest.

---

## Files

Create:

- `src/features/codegen/codegen.types.ts` - shared generator types.
- `src/features/codegen/normalizeSchema.ts` - converts legacy/current schema into a normalized versioned schema.
- `src/features/codegen/generateStyles.ts` - maps safe node props to `className` and inline `style`.
- `src/features/codegen/generateComponent.ts` - recursively converts nodes into JSX strings.
- `src/features/codegen/componentTemplates.ts` - static file templates for generated Next.js project.
- `src/features/codegen/generateFiles.ts` - assembles generated project files.
- `src/features/codegen/generateProject.ts` - public generator entry point.
- `src/features/codegen/sanitizeFilename.ts` - creates safe filenames for ZIP downloads.
- `src/features/codegen/index.ts` - exports public API.
- `src/features/codegen/__tests__/normalizeSchema.test.ts`
- `src/features/codegen/__tests__/generateProject.test.ts`
- `src/features/codegen/__tests__/generateComponent.test.ts`
- `src/features/builder/components/ExportCodeDialog.tsx`
- `src/app/api/project/[projectId]/export/route.ts`
- `vitest.config.ts`

Modify:

- `package.json` - add `test` script and dependencies.
- `package-lock.json` - update after install.
- `src/app/(dashboard)/builder/[projectId]/page.tsx` - wire `Export Code` button to dialog.
- `src/features/builder/schema/node.types.ts` - add versioned schema types without breaking current usage.
- `src/components/ui/dialog.tsx` - only if existing dialog primitives are missing required exports.
- `docs/progress.md` - update Phase 3 status after implementation.

---

### Task 1: Add Test Setup

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Install test dependency**

Run:

```bash
npm install -D vitest
```

Expected: `package.json` and `package-lock.json` include Vitest.

- [ ] **Step 2: Add test script**

Add to `package.json` scripts:

```json
"test": "vitest run"
```

- [ ] **Step 3: Create Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

- [ ] **Step 4: Run tests**

Run:

```bash
npm run test
```

Expected: command succeeds even before test files exist because `passWithNoTests` is enabled.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "test: add vitest setup"
```

---

### Task 2: Define Codegen Types and Schema Normalization

**Files:**

- Modify: `src/features/builder/schema/node.types.ts`
- Create: `src/features/codegen/codegen.types.ts`
- Create: `src/features/codegen/normalizeSchema.ts`
- Create: `src/features/codegen/index.ts`
- Create: `src/features/codegen/__tests__/normalizeSchema.test.ts`

- [ ] **Step 1: Write failing normalization tests**

Create `src/features/codegen/__tests__/normalizeSchema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { normalizeSchema } from "../normalizeSchema";

describe("normalizeSchema", () => {
  it("normalizes the current legacy node map shape", () => {
    const normalized = normalizeSchema({
      root: {
        id: "root",
        type: "page",
        props: {},
        children: ["text-1"],
        parentId: null,
      },
      "text-1": {
        id: "text-1",
        type: "text",
        props: { text: "Hello" },
        children: [],
        parentId: "root",
      },
    });

    expect(normalized.version).toBe(1);
    expect(normalized.rootId).toBe("root");
    expect(normalized.nodes["text-1"].props.text).toBe("Hello");
    expect(normalized.warnings).toEqual([]);
  });

  it("falls back to an empty page for invalid schema", () => {
    const normalized = normalizeSchema(null);

    expect(normalized.nodes.root.type).toBe("page");
    expect(normalized.nodes.root.children).toEqual([]);
    expect(normalized.warnings.length).toBeGreaterThan(0);
  });

  it("removes missing child ids and records a warning", () => {
    const normalized = normalizeSchema({
      root: {
        id: "root",
        type: "page",
        props: {},
        children: ["missing"],
        parentId: null,
      },
    });

    expect(normalized.nodes.root.children).toEqual([]);
    expect(normalized.warnings[0]).toContain("missing");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm run test -- src/features/codegen/__tests__/normalizeSchema.test.ts
```

Expected: FAIL because `normalizeSchema` does not exist.

- [ ] **Step 3: Add versioned schema types**

Append compatible types in `src/features/builder/schema/node.types.ts`:

```ts
export interface VersionedBuilderSchema {
  version: 1;
  nodes: BuilderSchema;
}
```

- [ ] **Step 4: Create codegen types**

Create `src/features/codegen/codegen.types.ts`:

```ts
import { BuilderNode, BuilderSchema } from "@/features/builder/schema/node.types";

export type GeneratedFileLanguage = "tsx" | "ts" | "css" | "json" | "md";

export interface GeneratedFile {
  path: string;
  content: string;
  language: GeneratedFileLanguage;
}

export interface NormalizedBuilderSchema {
  version: 1;
  rootId: "root";
  nodes: BuilderSchema;
  warnings: string[];
}

export interface GenerateProjectResult {
  files: GeneratedFile[];
  warnings: string[];
}

export type SchemaInput =
  | BuilderSchema
  | {
      version: 1;
      nodes: BuilderSchema;
    }
  | null
  | undefined;

export type SafeBuilderNode = BuilderNode;
```

- [ ] **Step 5: Implement normalizer**

Create `src/features/codegen/normalizeSchema.ts`:

```ts
import { BuilderNode, BuilderSchema } from "@/features/builder/schema/node.types";
import { NormalizedBuilderSchema, SchemaInput } from "./codegen.types";

const fallbackRoot: BuilderNode = {
  id: "root",
  type: "page",
  props: {},
  children: [],
  parentId: null,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getNodeMap(input: SchemaInput): { nodes: BuilderSchema; warnings: string[] } {
  if (!isRecord(input)) {
    return { nodes: { root: fallbackRoot }, warnings: ["Schema is empty or invalid. Used fallback page."] };
  }

  if ("nodes" in input && isRecord(input.nodes)) {
    return { nodes: input.nodes as BuilderSchema, warnings: [] };
  }

  if ("root" in input) {
    return { nodes: input as BuilderSchema, warnings: [] };
  }

  return { nodes: { root: fallbackRoot }, warnings: ["Schema has no root node. Used fallback page."] };
}

export function normalizeSchema(input: SchemaInput): NormalizedBuilderSchema {
  const { nodes: rawNodes, warnings } = getNodeMap(input);
  const nodes: BuilderSchema = {};

  for (const [id, node] of Object.entries(rawNodes)) {
    if (!node || typeof node !== "object" || !("id" in node) || !("type" in node)) {
      warnings.push(`Skipped invalid node: ${id}`);
      continue;
    }

    nodes[id] = {
      ...node,
      props: node.props ?? {},
      children: Array.isArray(node.children) ? [...node.children] : [],
    };
  }

  if (!nodes.root) {
    nodes.root = fallbackRoot;
    warnings.push("Schema has no valid root node. Used fallback page.");
  }

  for (const node of Object.values(nodes)) {
    node.children = node.children.filter((childId) => {
      const exists = Boolean(nodes[childId]);
      if (!exists) {
        warnings.push(`Removed missing child id "${childId}" from node "${node.id}".`);
      }
      return exists;
    });
  }

  return {
    version: 1,
    rootId: "root",
    nodes,
    warnings,
  };
}
```

- [ ] **Step 6: Export public API**

Create `src/features/codegen/index.ts`:

```ts
export * from "./codegen.types";
export * from "./normalizeSchema";
```

- [ ] **Step 7: Run normalization tests**

Run:

```bash
npm run test -- src/features/codegen/__tests__/normalizeSchema.test.ts
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/features/builder/schema/node.types.ts src/features/codegen
git commit -m "feat: normalize builder schema for codegen"
```

---

### Task 3: Generate JSX Components

**Files:**

- Create: `src/features/codegen/generateStyles.ts`
- Create: `src/features/codegen/generateComponent.ts`
- Create: `src/features/codegen/__tests__/generateComponent.test.ts`
- Modify: `src/features/codegen/index.ts`

- [ ] **Step 1: Write failing component generation tests**

Create `src/features/codegen/__tests__/generateComponent.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { generateComponent } from "../generateComponent";
import { normalizeSchema } from "../normalizeSchema";

describe("generateComponent", () => {
  it("generates escaped text content", () => {
    const schema = normalizeSchema({
      root: {
        id: "root",
        type: "page",
        props: {},
        children: ["text-1"],
        parentId: null,
      },
      "text-1": {
        id: "text-1",
        type: "text",
        props: { text: "<Hello>" },
        children: [],
        parentId: "root",
      },
    });

    const output = generateComponent(schema);

    expect(output).toContain("&lt;Hello&gt;");
    expect(output).not.toContain("<Hello>");
  });

  it("preserves child order", () => {
    const schema = normalizeSchema({
      root: {
        id: "root",
        type: "page",
        props: {},
        children: ["a", "b"],
        parentId: null,
      },
      a: { id: "a", type: "text", props: { text: "First" }, children: [], parentId: "root" },
      b: { id: "b", type: "button", props: { text: "Second" }, children: [], parentId: "root" },
    });

    const output = generateComponent(schema);

    expect(output.indexOf("First")).toBeLessThan(output.indexOf("Second"));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm run test -- src/features/codegen/__tests__/generateComponent.test.ts
```

Expected: FAIL because `generateComponent` does not exist.

- [ ] **Step 3: Implement style generation**

Create `src/features/codegen/generateStyles.ts` with:

```ts
import { NodeProps } from "@/features/builder/schema/node.types";

const stylePropMap: Record<string, string> = {
  backgroundColor: "backgroundColor",
  color: "color",
  width: "width",
  height: "height",
  padding: "padding",
  margin: "margin",
  display: "display",
  direction: "direction",
  gap: "gap",
  alignItems: "alignItems",
  justifyContent: "justifyContent",
  gridTemplateColumns: "gridTemplateColumns",
  borderRadius: "borderRadius",
  fontSize: "fontSize",
  fontWeight: "fontWeight",
  textAlign: "textAlign",
};

function formatStyleValue(value: unknown): string | null {
  if (typeof value === "number") return String(value);
  if (typeof value === "string" && value.trim()) return JSON.stringify(value);
  return null;
}

const lengthProps = new Set(["width", "height", "padding", "margin", "gap", "borderRadius", "fontSize"]);

function formatPropValue(propName: string, value: unknown): string | null {
  if (lengthProps.has(propName) && typeof value === "number") {
    return JSON.stringify(`${value}px`);
  }

  return formatStyleValue(value);
}

export function generateStyleAttributes(props: NodeProps, defaultClassName = ""): string {
  const classNames = [defaultClassName, typeof props.className === "string" ? props.className : ""]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" ");

  const styleEntries = Object.entries(stylePropMap)
    .map(([propName, cssName]) => {
      const value = formatPropValue(propName, props[propName]);
      return value ? `${cssName}: ${value}` : null;
    })
    .filter(Boolean);

  const attributes: string[] = [];

  if (classNames) {
    attributes.push(`className=${JSON.stringify(classNames)}`);
  }

  if (styleEntries.length > 0) {
    attributes.push(`style={{ ${styleEntries.join(", ")} }}`);
  }

  return attributes.length > 0 ? ` ${attributes.join(" ")}` : "";
}
```

- [ ] **Step 4: Implement component generation**

Create `src/features/codegen/generateComponent.ts` with recursive JSX generation for all current node types. Include helpers for escaping HTML text and attributes.

- [ ] **Step 5: Export functions**

Update `src/features/codegen/index.ts`:

```ts
export * from "./codegen.types";
export * from "./normalizeSchema";
export * from "./generateStyles";
export * from "./generateComponent";
```

- [ ] **Step 6: Run component tests**

Run:

```bash
npm run test -- src/features/codegen/__tests__/generateComponent.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/features/codegen
git commit -m "feat: generate jsx from builder schema"
```

---

### Task 4: Generate Next.js Project Files

**Files:**

- Create: `src/features/codegen/componentTemplates.ts`
- Create: `src/features/codegen/generateFiles.ts`
- Create: `src/features/codegen/generateProject.ts`
- Create: `src/features/codegen/__tests__/generateProject.test.ts`
- Modify: `src/features/codegen/index.ts`

- [ ] **Step 1: Write failing project generation tests**

Create `src/features/codegen/__tests__/generateProject.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { generateProject } from "../generateProject";

describe("generateProject", () => {
  it("generates a minimal Next.js file set", () => {
    const result = generateProject({
      root: {
        id: "root",
        type: "page",
        props: {},
        children: [],
        parentId: null,
      },
    });

    const paths = result.files.map((file) => file.path);

    expect(paths).toContain("package.json");
    expect(paths).toContain("app/page.tsx");
    expect(paths).toContain("app/layout.tsx");
    expect(paths).toContain("app/globals.css");
    expect(result.files.find((file) => file.path === "app/page.tsx")?.content).toContain("export default function Page()");
  });

  it("includes schema content in the generated page", () => {
    const result = generateProject({
      root: {
        id: "root",
        type: "page",
        props: {},
        children: ["text-1"],
        parentId: null,
      },
      "text-1": {
        id: "text-1",
        type: "text",
        props: { text: "Export me" },
        children: [],
        parentId: "root",
      },
    });

    const page = result.files.find((file) => file.path === "app/page.tsx");
    expect(page?.content).toContain("Export me");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm run test -- src/features/codegen/__tests__/generateProject.test.ts
```

Expected: FAIL because `generateProject` does not exist.

- [ ] **Step 3: Add static templates**

Create `componentTemplates.ts` with functions for:

- `packageJsonTemplate`
- `layoutTemplate`
- `globalsCssTemplate`
- `tsconfigTemplate`
- `nextConfigTemplate`
- `readmeTemplate`

The generated `package.json` should include only the runtime dependencies needed by the exported app. Do not add Tailwind or PostCSS in the MVP templates; supported visual props should render through inline styles so the exported project runs without extra styling configuration.

- [ ] **Step 4: Assemble generated files**

Create `generateFiles.ts` to return the required file list.

- [ ] **Step 5: Add public generator entry point**

Create `generateProject.ts`:

```ts
import { SchemaInput } from "./codegen.types";
import { generateFiles } from "./generateFiles";
import { normalizeSchema } from "./normalizeSchema";

export function generateProject(schemaInput: SchemaInput) {
  const schema = normalizeSchema(schemaInput);

  return {
    files: generateFiles(schema),
    warnings: schema.warnings,
  };
}
```

- [ ] **Step 6: Export public function**

Update `src/features/codegen/index.ts` to export `generateProject`.

- [ ] **Step 7: Run generator tests**

Run:

```bash
npm run test -- src/features/codegen
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/features/codegen
git commit -m "feat: generate nextjs project files"
```

---

### Task 5: Add Export Code Preview Dialog

**Files:**

- Create: `src/features/builder/components/ExportCodeDialog.tsx`
- Modify: `src/app/(dashboard)/builder/[projectId]/page.tsx`

- [ ] **Step 1: Create dialog component**

Create a client component that accepts:

```ts
interface ExportCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName?: string;
}
```

Inside the component:

- Read current schema from `useBuilderStore`.
- Call `generateProject(schema)` with `useMemo`.
- Show generated file list.
- Show selected file content in a read-only `<pre>`.
- POST the current schema to `/api/project/${projectId}/export`.
- Disable the download button while the request is running.
- Surface generation warnings in a small non-blocking area.

- [ ] **Step 2: Wire builder page state**

In `src/app/(dashboard)/builder/[projectId]/page.tsx`:

- Add `const [isExportOpen, setIsExportOpen] = useState(false);`
- Render `<ExportCodeDialog ... />`
- Change `Export Code` button to `onClick={() => setIsExportOpen(true)}`

- [ ] **Step 3: Run lint**

Run:

```bash
npm run lint
```

Expected: PASS or only pre-existing unrelated lint issues.

- [ ] **Step 4: Commit**

```bash
git add src/features/builder/components/ExportCodeDialog.tsx "src/app/(dashboard)/builder/[projectId]/page.tsx"
git commit -m "feat: preview generated project files"
```

---

### Task 6: Add ZIP Export API

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/app/api/project/[projectId]/export/route.ts`
- Create: `src/features/codegen/sanitizeFilename.ts`

- [ ] **Step 1: Install ZIP dependency**

Run:

```bash
npm install jszip
```

Expected: `jszip` is added to dependencies.

- [ ] **Step 2: Add filename sanitizer**

Create `src/features/codegen/sanitizeFilename.ts`:

```ts
export function sanitizeFilename(value: string | null | undefined, fallback = "vn-builder-export") {
  const sanitized = (value || fallback)
    .replace(/[\r\n"]/g, "")
    .replace(/[<>:\/\\|?*\x00-\x1F]/g, "-")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return sanitized || fallback;
}
```

- [ ] **Step 3: Export filename sanitizer**

Update `src/features/codegen/index.ts`:

```ts
export * from "./sanitizeFilename";
```

- [ ] **Step 4: Create export route**

Create `src/app/api/project/[projectId]/export/route.ts`:

```ts
import { authOptions } from "@/lib/auth";
import { ProjectService } from "@/features/project/project.service";
import { WorkspaceService } from "@/features/workspace/workspace.service";
import { generateProject, sanitizeFilename } from "@/features/codegen";
import { getServerSession } from "next-auth";
import JSZip from "jszip";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  if (!mongoose.isValidObjectId(projectId)) {
    return NextResponse.json({ message: "Invalid project id" }, { status: 400 });
  }

  const project = await ProjectService.getProjectById(projectId);

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  const workspace = await WorkspaceService.getWorkspaceById(project.workspaceId.toString());

  if (!workspace) {
    return NextResponse.json({ message: "Workspace not found" }, { status: 404 });
  }

  const isMember = workspace.members.some(
    (member) => member.user._id.toString() === session.user.id
  );

  if (!isMember) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);

  if (!body?.schema) {
    return NextResponse.json({ message: "Schema is required" }, { status: 400 });
  }

  const zip = new JSZip();
  const generated = generateProject(body.schema);
  const root = zip.folder("vn-builder-export");

  for (const file of generated.files) {
    root?.file(file.path, file.content);
  }

  const content = await zip.generateAsync({ type: "uint8array" });

  return new NextResponse(content, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${sanitizeFilename(project.name)}.zip"`,
    },
  });
}
```

- [ ] **Step 5: Update dialog download request**

Update `ExportCodeDialog` so `Download ZIP` sends:

```ts
await fetch(`/api/project/${projectId}/export`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ schema }),
});
```

Expected: the downloaded ZIP uses the same schema shown in preview, including unsaved builder changes.

- [ ] **Step 6: Verify route compiles**

Run:

```bash
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/features/codegen/sanitizeFilename.ts src/features/builder/components/ExportCodeDialog.tsx "src/app/api/project/[projectId]/export/route.ts"
git commit -m "feat: export generated project zip"
```

---

### Task 7: End-to-End Manual Verification

**Files:**

- No source changes expected unless verification finds issues.

- [ ] **Step 1: Start development server**

Run:

```bash
npm run dev
```

Expected: app starts on a local port.

- [ ] **Step 2: Open a builder project**

Navigate to a real project in the browser and open `/builder/[projectId]`.

Expected: builder loads and shows current schema.

- [ ] **Step 3: Preview generated files**

Click `Export Code`.

Expected:

- Dialog opens.
- File list is visible.
- `app/page.tsx` contains JSX matching the current schema.

- [ ] **Step 4: Download ZIP**

Click `Download ZIP`.

Expected: browser downloads a ZIP.

- [ ] **Step 5: Run exported project locally**

Unzip into a temporary directory, then run:

```bash
npm install
npm run dev
```

Expected: exported Next.js project starts and renders the generated page.

- [ ] **Step 6: Fix any issues found**

If the exported project fails, fix the generator or templates and rerun:

```bash
npm run test
npm run lint
npm run build
```

- [ ] **Step 7: Commit fixes**

```bash
git add src/features/codegen src/features/builder "src/app/api/project/[projectId]/export/route.ts"
git commit -m "fix: stabilize generated project export"
```

---

### Task 8: Update Documentation

**Files:**

- Modify: `docs/progress.md`
- Modify: `README.md`

- [ ] **Step 1: Update progress**

In `docs/progress.md`, update Phase 3 from To Do to In Progress or MVP Complete after implementation:

```md
### Phase 3 – Code Generation (MVP Complete)

- [x] React/Next.js code generation from Schema.
- [x] Preview generated source files.
- [x] Export source code as ZIP.
- [ ] GitHub/Vercel automated deployment.
```

- [ ] **Step 2: Update README**

Add a short section under code export explaining:

- How schema becomes generated files.
- How to export ZIP.
- What the exported project includes.
- What is intentionally not included yet.

- [ ] **Step 3: Run final verification**

Run:

```bash
npm run test
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 4: Commit docs**

```bash
git add README.md docs/progress.md
git commit -m "docs: document code generation mvp"
```

---

## Final Verification

Before calling the phase complete, run:

```bash
npm run test
npm run lint
npm run build
```

Then verify one exported ZIP manually:

```bash
npm install
npm run dev
```

The implementation is complete only when the VNBuilder repo passes verification and the exported project runs locally.
