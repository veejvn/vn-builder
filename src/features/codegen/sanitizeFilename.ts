export function sanitizeFilename(value: string | null | undefined, fallback = "vn-builder-export") {
  const sanitized = (value || fallback)
    .replace(/[\r\n"]/g, "")
    .replace(/[<>:/\\|?*\x00-\x1F]/g, "-")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return sanitized && /[^.-]/.test(sanitized) ? sanitized : fallback;
}
