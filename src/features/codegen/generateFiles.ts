import type { GeneratedFile, NormalizedBuilderSchema } from "./codegen.types";
import {
  globalsCssTemplate,
  layoutTemplate,
  nextConfigTemplate,
  packageJsonTemplate,
  pageTemplate,
  readmeTemplate,
  tsconfigTemplate,
} from "./componentTemplates";
import { generateComponent } from "./generateComponent";

export function generateFiles(schema: NormalizedBuilderSchema): GeneratedFile[] {
  return [
    { path: "package.json", content: packageJsonTemplate(), language: "json" },
    { path: "app/page.tsx", content: pageTemplate(generateComponent(schema)), language: "tsx" },
    { path: "app/layout.tsx", content: layoutTemplate(), language: "tsx" },
    { path: "app/globals.css", content: globalsCssTemplate(), language: "css" },
    { path: "next.config.ts", content: nextConfigTemplate(), language: "ts" },
    { path: "tsconfig.json", content: tsconfigTemplate(), language: "json" },
    { path: "README.md", content: readmeTemplate(), language: "md" },
  ];
}
