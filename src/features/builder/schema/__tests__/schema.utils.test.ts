import { describe, expect, it } from "vitest";
import {
  canAcceptChild,
  canHaveChildren,
  collectDescendantIds,
  deleteNodeRecursive,
  insertChildAt,
  moveNodeInSchema,
} from "../schema.utils";
import type { BuilderSchema } from "../node.types";

const schema: BuilderSchema = {
  root: {
    id: "root",
    type: "page",
    props: {},
    children: ["section", "button"],
    parentId: null,
  },
  section: {
    id: "section",
    type: "section",
    props: {},
    children: ["text"],
    parentId: "root",
  },
  text: {
    id: "text",
    type: "text",
    props: { content: "Hello" },
    children: [],
    parentId: "section",
  },
  button: {
    id: "button",
    type: "button",
    props: {},
    children: [],
    parentId: "root",
  },
};

describe("schema utils", () => {
  it("knows which node types can have children", () => {
    expect(canHaveChildren("page")).toBe(true);
    expect(canHaveChildren("section")).toBe(true);
    expect(canHaveChildren("container")).toBe(true);
    expect(canHaveChildren("flex")).toBe(true);
    expect(canHaveChildren("grid")).toBe(true);
    expect(canHaveChildren("header")).toBe(true);
    expect(canHaveChildren("footer")).toBe(true);
    expect(canHaveChildren("text")).toBe(false);
    expect(canHaveChildren("button")).toBe(false);
    expect(canHaveChildren("image")).toBe(false);
    expect(canHaveChildren("input")).toBe(false);
    expect(canHaveChildren("icon")).toBe(false);
  });

  it("rejects children inside leaf nodes", () => {
    expect(canAcceptChild(schema.text, "button")).toBe(false);
    expect(canAcceptChild(schema.section, "button")).toBe(true);
    expect(canAcceptChild(schema.section, "page")).toBe(false);
  });

  it("collects descendants before recursive delete", () => {
    expect(collectDescendantIds(schema, "section")).toEqual(["text"]);
  });

  it("inserts a child at a bounded index without duplicates", () => {
    expect(insertChildAt(["a", "b"], "c", 1)).toEqual(["a", "c", "b"]);
    expect(insertChildAt(["a", "b"], "a", 99)).toEqual(["b", "a"]);
    expect(insertChildAt(["a", "b"], "c", -10)).toEqual(["c", "a", "b"]);
  });

  it("deletes a node and all descendants", () => {
    const result = deleteNodeRecursive(schema, "section");

    expect(result.root.children).toEqual(["button"]);
    expect(result.section).toBeUndefined();
    expect(result.text).toBeUndefined();
  });

  it("moves a node across valid parents", () => {
    const result = moveNodeInSchema(schema, "button", {
      overId: "section",
      position: "inside",
    });

    expect(result.section.children).toEqual(["text", "button"]);
    expect(result.button.parentId).toBe("section");
    expect(result.root.children).toEqual(["section"]);
  });

  it("prevents moving a node inside its descendant", () => {
    const result = moveNodeInSchema(schema, "section", {
      overId: "text",
      position: "inside",
    });

    expect(result).toBe(schema);
  });
});
