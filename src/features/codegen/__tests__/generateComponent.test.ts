import { describe, expect, it } from "vitest";
import { generateComponent } from "../generateComponent";
import { normalizeSchema } from "../normalizeSchema";

describe("generateComponent", () => {
  it("generates text as a string expression so braces stay literal", () => {
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
        props: { text: "<Hello>{process.env.SECRET}</Hello>" },
        children: [],
        parentId: "root",
      },
    });

    const output = generateComponent(schema);

    expect(output).toContain('{"<Hello>{process.env.SECRET}</Hello>"}');
    expect(output).not.toContain("&lt;Hello&gt;{process.env.SECRET}&lt;/Hello&gt;");
    expect(output).not.toContain("\n    <Hello>{process.env.SECRET}</Hello>");
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

  it("escapes attributes and renders numeric length styles with px", () => {
    const schema = normalizeSchema({
      root: {
        id: "root",
        type: "page",
        props: {},
        children: ["image-1", "text-1"],
        parentId: null,
      },
      "image-1": {
        id: "image-1",
        type: "image",
        props: { src: '" onError="alert(1)', alt: "<cover>", width: 120, fontWeight: 700 },
        children: [],
        parentId: "root",
      },
      "text-1": {
        id: "text-1",
        type: "text",
        props: { text: "Weighted", fontSize: 16, fontWeight: 700 },
        children: [],
        parentId: "root",
      },
    });

    const output = generateComponent(schema);

    expect(output).toContain('src="&quot; onError=&quot;alert(1)"');
    expect(output).toContain('alt="&lt;cover&gt;"');
    expect(output).toContain('width: "120px"');
    expect(output).toContain("fontWeight: 700");
    expect(output).toContain('fontSize: "16px"');
  });

  it("supports current builder prop names and nested style props", () => {
    const schema = normalizeSchema({
      root: {
        id: "root",
        type: "page",
        props: {},
        children: ["text-1", "button-1", "input-1", "icon-1"],
        parentId: null,
      },
      "text-1": {
        id: "text-1",
        type: "text",
        props: {
          tag: "h2",
          content: "Current text",
          className: "headline",
          style: { color: "red", fontSize: 20, fontWeight: 600 },
        },
        children: [],
        parentId: "root",
      },
      "button-1": {
        id: "button-1",
        type: "button",
        props: { content: "Submit now" },
        children: [],
        parentId: "root",
      },
      "input-1": {
        id: "input-1",
        type: "input",
        props: { type: "email", placeholder: "Email", defaultValue: "hello@example.com" },
        children: [],
        parentId: "root",
      },
      "icon-1": {
        id: "icon-1",
        type: "icon",
        props: { icon: "Star" },
        children: [],
        parentId: "root",
      },
    });

    const output = generateComponent(schema);

    expect(output).toContain("<h2");
    expect(output).toContain('className="vn-text headline"');
    expect(output).toContain('{"Current text"}');
    expect(output).toContain('{"Submit now"}');
    expect(output).toContain('type="email"');
    expect(output).toContain('defaultValue="hello@example.com"');
    expect(output).toContain('{"Star"}');
    expect(output).toContain('color: "red"');
    expect(output).toContain('fontSize: "20px"');
    expect(output).toContain("fontWeight: 600");
  });

  it("skips repeated nodes when schemas contain cycles", () => {
    const schema = normalizeSchema({
      root: {
        id: "root",
        type: "page",
        props: {},
        children: ["container-1"],
        parentId: null,
      },
      "container-1": {
        id: "container-1",
        type: "container",
        props: {},
        children: ["root"],
        parentId: "root",
      },
    });

    const output = generateComponent(schema);

    expect(output).toContain("{/* Skipped repeated node root */}");
    expect(output.length).toBeLessThan(1000);
  });
});
