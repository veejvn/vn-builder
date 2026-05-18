import type {
  BuilderNode,
  BuilderSchema,
  VersionedBuilderSchema,
} from "@/features/builder/schema/node.types";

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

export type SchemaInput = BuilderSchema | VersionedBuilderSchema | null | undefined;

export type SafeBuilderNode = BuilderNode;
