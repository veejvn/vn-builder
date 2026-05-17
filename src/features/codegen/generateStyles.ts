import type { NodeProps } from "@/features/builder/schema/node.types";

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

const lengthProps = new Set(["width", "height", "padding", "margin", "gap", "borderRadius", "fontSize"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatStyleValue(propName: string, value: unknown): string | null {
  if (lengthProps.has(propName) && typeof value === "number") {
    return JSON.stringify(`${value}px`);
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "string" && value.trim()) {
    return JSON.stringify(value);
  }

  return null;
}

export function generateStyleAttributes(props: NodeProps, defaultClassName = ""): string {
  const nestedStyle = isRecord(props.style) ? props.style : {};
  const styleSource = { ...nestedStyle, ...props };
  const classNames = [defaultClassName, typeof props.className === "string" ? props.className : ""]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" ");

  const styleEntries = Object.entries(stylePropMap)
    .map(([propName, cssName]) => {
      const value = formatStyleValue(propName, styleSource[propName]);
      return value ? `${cssName}: ${value}` : null;
    })
    .filter((value): value is string => Boolean(value));

  const attributes: string[] = [];

  if (classNames) {
    attributes.push(`className=${JSON.stringify(classNames)}`);
  }

  if (styleEntries.length > 0) {
    attributes.push(`style={{ ${styleEntries.join(", ")} }}`);
  }

  return attributes.length > 0 ? ` ${attributes.join(" ")}` : "";
}
