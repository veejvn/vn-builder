"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, FileCode2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generateProject, type GeneratedFile } from "@/features/codegen";
import { useBuilderStore } from "@/features/builder/store/builder.store";

interface ExportCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName?: string;
}

function getFilenameFromContentDisposition(value: string | null) {
  if (!value) return null;

  const encodedMatch = value.match(/filename\*=UTF-8''([^;]+)/i);
  if (encodedMatch?.[1]) {
    try {
      return decodeURIComponent(encodedMatch[1]);
    } catch {
      return encodedMatch[1];
    }
  }

  const quotedMatch = value.match(/filename="([^"]+)"/i);
  if (quotedMatch?.[1]) return quotedMatch[1];

  const plainMatch = value.match(/filename=([^;]+)/i);
  return plainMatch?.[1]?.trim() ?? null;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function ExportCodeDialog({
  open,
  onOpenChange,
  projectId,
  projectName,
}: ExportCodeDialogProps) {
  const schema = useBuilderStore((state) => state.schema);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preview = useMemo(() => generateProject(schema), [schema]);
  const selectedFile =
    preview.files.find((file) => file.path === selectedPath) ?? preview.files[0];

  useEffect(() => {
    if (!preview.files.some((file) => file.path === selectedPath)) {
      setSelectedPath(preview.files[0]?.path ?? null);
    }
  }, [preview.files, selectedPath]);

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      const response = await fetch(`/api/project/${projectId}/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ schema }),
      });

      if (!response.ok) {
        let message = "Failed to export code";

        try {
          const body = await response.json();
          if (typeof body?.message === "string") message = body.message;
        } catch {
          message = response.statusText || message;
        }

        throw new Error(message);
      }

      const blob = await response.blob();
      const filename =
        getFilenameFromContentDisposition(
          response.headers.get("Content-Disposition")
        ) ?? `${projectName || "vn-builder-export"}.zip`;

      downloadBlob(blob, filename);
      toast.success("Code export downloaded");
    } catch (downloadError) {
      const message =
        downloadError instanceof Error
          ? downloadError.message
          : "Failed to export code";
      setError(message);
      toast.error(message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[86vh] max-w-[min(1100px,calc(100vw-2rem))] gap-0 overflow-hidden border-border-dark bg-[#111418] p-0 text-white shadow-2xl">
        <DialogHeader className="border-b border-border-dark px-5 py-4">
          <DialogTitle className="flex items-center gap-2 text-white">
            <FileCode2 className="size-5 text-primary" />
            Export Code
          </DialogTitle>
          <DialogDescription className="text-[#9da8b9]">
            Preview generated files for {projectName || "this project"} before
            downloading the ZIP.
          </DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[280px_minmax(0,1fr)]">
          <div className="min-h-0 border-b border-border-dark bg-[#0f1318] md:border-r md:border-b-0">
            <div className="border-b border-border-dark px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#9da8b9]">
              Files
            </div>
            <div className="max-h-48 overflow-y-auto p-2 md:max-h-[52vh]">
              {preview.files.map((file: GeneratedFile) => {
                const isSelected = selectedFile?.path === file.path;

                return (
                  <button
                    key={file.path}
                    type="button"
                    onClick={() => setSelectedPath(file.path)}
                    className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-primary text-white"
                        : "text-[#c5cedb] hover:bg-[#1c2128] hover:text-white"
                    }`}
                  >
                    <FileCode2 className="size-4 shrink-0" />
                    <span className="truncate">{file.path}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex min-h-0 flex-col overflow-hidden">
            <div className="border-b border-border-dark bg-[#0f1318] px-4 py-3 text-xs text-[#9da8b9]">
              <span className="text-white">{selectedFile?.path}</span>
            </div>

            {preview.warnings.length > 0 && (
              <div className="border-b border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-xs text-yellow-200">
                {preview.warnings.map((warning) => (
                  <div key={warning}>{warning}</div>
                ))}
              </div>
            )}

            <pre className="min-h-[360px] flex-1 overflow-auto bg-[#0a0d11] p-4 text-xs leading-5 text-[#d7deea]">
              <code>{selectedFile?.content ?? ""}</code>
            </pre>
          </div>
        </div>

        {error && (
          <div className="border-t border-red-500/20 bg-red-500/10 px-5 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <DialogFooter className="border-t border-border-dark bg-[#111418] px-5 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border-dark bg-[#1c2128] text-white hover:bg-[#282f39] hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading || preview.files.length === 0}
            className="bg-primary text-white hover:bg-primary/90"
          >
            {isDownloading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            {isDownloading ? "Downloading..." : "Download ZIP"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
