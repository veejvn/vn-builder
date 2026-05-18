import { describe, expect, it } from "vitest";
import { generateProject } from "../generateProject";
import { sanitizeFilename } from "../sanitizeFilename";

describe("generateProject", () => {
  it("generates the required minimal Next.js file set", () => {
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

    expect(paths).toEqual([
      "package.json",
      "app/page.tsx",
      "app/layout.tsx",
      "app/globals.css",
      "next.config.ts",
      "tsconfig.json",
      "README.md",
    ]);
    expect(result.files.find((file) => file.path === "app/page.tsx")?.content).toContain(
      "export default function Page()",
    );
  });

  it("includes schema content in app/page.tsx", () => {
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

  it("sanitizes generated archive filenames", () => {
    expect(sanitizeFilename(' ../Bad\r\n "Name"/Thing -- here ')).toBe("..-Bad-Name-Thing-here");
    expect(sanitizeFilename("\n")).toBe("vn-builder-export");
    expect(sanitizeFilename("...---")).toBe("vn-builder-export");
  });
});
