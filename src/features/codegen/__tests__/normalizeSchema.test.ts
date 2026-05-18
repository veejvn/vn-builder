import { describe, expect, it } from "vitest";
import { normalizeSchema } from "../normalizeSchema";

describe("normalizeSchema", () => {
  it("normalizes legacy node maps", () => {
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

  it("normalizes versioned schemas", () => {
    const normalized = normalizeSchema({
      version: 1,
      nodes: {
        root: {
          id: "root",
          type: "page",
          props: {},
          children: ["button-1"],
          parentId: null,
        },
        "button-1": {
          id: "button-1",
          type: "button",
          props: { text: "Click" },
          children: [],
          parentId: "root",
        },
      },
    });

    expect(normalized.nodes["button-1"].props.text).toBe("Click");
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
