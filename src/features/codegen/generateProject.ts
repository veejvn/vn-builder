import type { GenerateProjectResult, SchemaInput } from "./codegen.types";
import { generateFiles } from "./generateFiles";
import { normalizeSchema } from "./normalizeSchema";

export function generateProject(schemaInput: SchemaInput): GenerateProjectResult {
  const schema = normalizeSchema(schemaInput);

  return {
    files: generateFiles(schema),
    warnings: schema.warnings,
  };
}
