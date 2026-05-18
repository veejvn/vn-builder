import type { BuilderNode, NodeProps } from "@/features/builder/schema/node.types";
import type { NormalizedBuilderSchema } from "./codegen.types";
import { generateStyleAttributes } from "./generateStyles";

const defaultClassNames: Partial<Record<BuilderNode["type"], string>> = {
  page: "vn-page",
  container: "vn-container",
  flex: "vn-flex",
  grid: "vn-grid",
  section: "vn-section",
  header: "vn-header",
  footer: "vn-footer",
  text: "vn-text",
  button: "vn-button",
  image: "vn-image",
  input: "vn-input",
  icon: "vn-icon",
};

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(value: unknown): string {
  return escapeHtml(value).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function indentBlock(value: string, spaces: number): string {
  const indentation = " ".repeat(spaces);
  return value
    .split("\n")
    .map((line) => (line ? `${indentation}${line}` : line))
    .join("\n");
}

function stringProp(props: NodeProps, names: string[], fallback = ""): string {
  for (const name of names) {
    if (typeof props[name] === "string") {
      return props[name];
    }
  }

  return fallback;
}

function textExpression(value: string): string {
  return `{${JSON.stringify(value)}}`;
}

function attr(name: string, value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  return ` ${name}="${escapeAttribute(value)}"`;
}

function childrenFor(node: BuilderNode, schema: NormalizedBuilderSchema, depth: number, visited: Set<string>): string {
  return node.children.map((childId) => renderNode(childId, schema, depth, visited)).join("\n");
}

function renderWithChildren(
  tagName: string,
  node: BuilderNode,
  schema: NormalizedBuilderSchema,
  depth: number,
  visited: Set<string>,
  fallbackText = "",
): string {
  const attributes = generateStyleAttributes(node.props, defaultClassNames[node.type]);
  const childOutput = childrenFor(node, schema, depth + 1, visited);
  const text = stringProp(node.props, ["content", "text"], fallbackText);
  const content = [text ? textExpression(text) : "", childOutput].filter(Boolean).join("\n");

  if (!content) {
    return `<${tagName}${attributes} />`;
  }

  return [`<${tagName}${attributes}>`, indentBlock(content, 2), `</${tagName}>`].join("\n");
}

function renderNode(nodeId: string, schema: NormalizedBuilderSchema, depth: number, visited: Set<string>): string {
  const node = schema.nodes[nodeId];

  if (!node) {
    return "";
  }

  if (visited.has(nodeId)) {
    return `{/* Skipped repeated node ${escapeHtml(nodeId)} */}`;
  }

  const nextVisited = new Set(visited);
  nextVisited.add(nodeId);

  switch (node.type) {
    case "page":
      return renderWithChildren("main", node, schema, depth, nextVisited);
    case "container":
    case "flex":
    case "grid":
      return renderWithChildren("div", node, schema, depth, nextVisited);
    case "section":
      return renderWithChildren("section", node, schema, depth, nextVisited);
    case "header":
      return renderWithChildren("header", node, schema, depth, nextVisited);
    case "footer":
      return renderWithChildren("footer", node, schema, depth, nextVisited);
    case "text": {
      const tag = stringProp(node.props, ["tag", "as"]);
      const tagName = /^h[1-6]$|^p$|^span$/.test(tag)
        ? tag
        : "p";
      return renderWithChildren(tagName, node, schema, depth, nextVisited);
    }
    case "button":
      return renderWithChildren("button", node, schema, depth, nextVisited, "Button");
    case "image": {
      const attributes = [
        generateStyleAttributes(node.props, defaultClassNames.image),
        attr("src", node.props.src),
        attr("alt", node.props.alt),
      ].join("");
      return `<img${attributes} />`;
    }
    case "input": {
      const attributes = [
        generateStyleAttributes(node.props, defaultClassNames.input),
        attr("type", stringProp(node.props, ["type", "inputType"], "text")),
        attr("placeholder", node.props.placeholder),
        attr("value", node.props.value),
        attr("defaultValue", node.props.defaultValue),
      ].join("");
      return `<input${attributes} readOnly />`;
    }
    case "icon":
      return renderWithChildren("span", node, schema, depth, nextVisited, stringProp(node.props, ["icon", "name"], "Icon"));
    default:
      return "{/* Unsupported node omitted */}";
  }
}

export function generateComponent(schema: NormalizedBuilderSchema): string {
  return renderNode(schema.rootId, schema, 0, new Set());
}
