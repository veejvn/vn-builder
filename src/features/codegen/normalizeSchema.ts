import type { BuilderNode, BuilderSchema, NodeType } from "@/features/builder/schema/node.types";
import type { NormalizedBuilderSchema, SchemaInput } from "./codegen.types";

const fallbackRoot: BuilderNode = {
  id: "root",
  type: "page",
  props: {},
  children: [],
  parentId: null,
};

const supportedTypes = new Set<NodeType>([
  "page",
  "container",
  "text",
  "button",
  "image",
  "flex",
  "grid",
  "input",
  "icon",
  "section",
  "header",
  "footer",
]);

function cloneFallbackRoot(): BuilderNode {
  return { ...fallbackRoot, props: {}, children: [] };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getNodeMap(input: SchemaInput): { nodes: BuilderSchema; warnings: string[] } {
  if (!isRecord(input)) {
    return {
      nodes: { root: cloneFallbackRoot() },
      warnings: ["Schema is empty or invalid. Used fallback page."],
    };
  }

  if ("nodes" in input && isRecord(input.nodes)) {
    return { nodes: input.nodes as BuilderSchema, warnings: [] };
  }

  if ("root" in input) {
    return { nodes: input as BuilderSchema, warnings: [] };
  }

  return {
    nodes: { root: cloneFallbackRoot() },
    warnings: ["Schema has no root node. Used fallback page."],
  };
}

function normalizeNode(id: string, value: unknown, warnings: string[]): BuilderNode | null {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.type !== "string") {
    warnings.push(`Skipped invalid node "${id}".`);
    return null;
  }

  if (!supportedTypes.has(value.type as NodeType)) {
    warnings.push(`Skipped unsupported node type "${value.type}" for node "${id}".`);
    return null;
  }

  return {
    id: value.id,
    type: value.type as NodeType,
    props: isRecord(value.props) ? value.props : {},
    children: Array.isArray(value.children)
      ? value.children.filter((childId): childId is string => typeof childId === "string")
      : [],
    parentId: typeof value.parentId === "string" || value.parentId === null ? value.parentId : undefined,
  };
}

export function normalizeSchema(input: SchemaInput): NormalizedBuilderSchema {
  const { nodes: rawNodes, warnings } = getNodeMap(input);
  const nodes: BuilderSchema = {};

  for (const [id, node] of Object.entries(rawNodes)) {
    const normalized = normalizeNode(id, node, warnings);

    if (normalized) {
      nodes[id] = normalized;
    }
  }

  if (!nodes.root || nodes.root.type !== "page") {
    nodes.root = cloneFallbackRoot();
    warnings.push("Schema has no valid root page. Used fallback page.");
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
