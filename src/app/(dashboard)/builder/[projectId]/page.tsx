"use client";

import React, { useEffect, useState } from "react";
import {
  Layers,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Code,
  Undo2,
  Redo2,
} from "lucide-react";
import { BuilderDndContext, Canvas } from "@/features/builder/components/Canvas";
import { PropertyPanel } from "@/features/builder/components/PropertyPanel";
import { LeftSidebar } from "@/features/builder/components/LeftSidebar";
import { ExportCodeDialog } from "@/features/builder/components/ExportCodeDialog";
import { useBuilderStore } from "@/features/builder/store/builder.store";
import type { BuilderViewport } from "@/features/builder/schema/node.types";
import { useManualSave } from "@/features/builder/hooks/useAutoSave";
import { useParams, useRouter } from "next/navigation";
import { useProject } from "@/features/project/hooks/useProjects";
import { DEFAULT_SCHEMA } from "@/features/builder/store/builder.store";
import Script from "next/script";
import { cn } from "@/lib/utils";

const VIEWPORT_LABELS: Record<BuilderViewport, string> = {
  desktop: "1200 x 800px",
  tablet: "768 x 800px",
  mobile: "390 x 800px",
};

const VIEWPORTS: Array<{
  value: BuilderViewport;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}> = [
  { value: "desktop", label: "Desktop", icon: Monitor },
  { value: "tablet", label: "Tablet", icon: Tablet },
  { value: "mobile", label: "Mobile", icon: Smartphone },
];

const Builder = () => {
  const router = useRouter();
  const { projectId } = useParams() as { projectId: string };
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const { data: project, isLoading, isError } = useProject(projectId);

  const setSchema = useBuilderStore((state) => state.setSchema);
  const initializeSchema = useBuilderStore((state) => state.initializeSchema);
  const loadSchemaFromIndexedDB = useBuilderStore((state) => state.loadSchemaFromIndexedDB);
  const undo = useBuilderStore((state) => state.undo);
  const redo = useBuilderStore((state) => state.redo);
  const canUndo = useBuilderStore((state) => state.history.past.length > 0);
  const canRedo = useBuilderStore((state) => state.history.future.length > 0);
  const previewMode = useBuilderStore((state) => state.previewMode);
  const setPreviewMode = useBuilderStore((state) => state.setPreviewMode);
  const viewport = useBuilderStore((state) => state.viewport);
  const setViewport = useBuilderStore((state) => state.setViewport);
  const { status, save, isDirty, setInitialState } = useManualSave(projectId);

  const loadingStarted = React.useRef<string | null>(null);

  // Reset state properly when projectId changes
  useEffect(() => {
    setIsLoaded(false);
    loadingStarted.current = null;
    initializeSchema();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // Load project data
  useEffect(() => {
    if (project && !isLoaded && loadingStarted.current !== projectId) {
      loadingStarted.current = projectId;
      const loadData = async () => {
        // Try resolving from IndexedDB first to recover unsaved changes
        const loadedFromIDB = await loadSchemaFromIndexedDB(projectId);

        if (loadedFromIDB) {
          // If loaded from IDB, we still set the initial state from DB to ensure "isDirty" is calculated correctly
          // This will make the UI show "Unsaved changes" immediately
          setInitialState(project.schema && Object.keys(project.schema).length > 0 ? project.schema : DEFAULT_SCHEMA);
        } else {
          // Fallback to DB data
          if (project.schema && Object.keys(project.schema).length > 0) {
            setSchema(project.schema);
            setInitialState(project.schema);
          } else {
            // For new projects or empty schema, set the state to default
            setInitialState(DEFAULT_SCHEMA);
          }
        }
        setIsLoaded(true);
      };

      loadData();
    }
  }, [project, isLoaded, setSchema, setInitialState, loadSchemaFromIndexedDB, projectId]);



  const handleBack = () => {
    if (project?.workspaceId) {
      router.push(`/workspace/${project.workspaceId}/projects`);
    } else {
      router.back();
    }
  };

  if (isError) {
    return <div className="h-screen flex items-center justify-center bg-[#111418] text-red-500">Failed to load project</div>;
  }

  // Prevent auto-save overwriting before load
  if (isLoading || !isLoaded) {
    return <div className="h-screen flex items-center justify-center bg-[#111418] text-white">Loading Builder...</div>;
  }

  return (
    <>
      <Script src="https://cdn.tailwindcss.com" strategy="afterInteractive" />
      <div className="bg-background-dark text-white font-display overflow-hidden h-screen flex flex-col">
        {/* Top Navigation Bar */}
        <header className="h-14 shrink-0 border-b border-border-dark bg-[#111418] flex items-center justify-between px-4 z-20">
          {/* Left: Logo & Project Info */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2 text-primary cursor-pointer"
              onClick={handleBack}
            >
              <Layers size={24} />
              <h1 className="text-white font-bold tracking-tight text-lg none-selected">
                VNBuilder
              </h1>
            </div>
            <div className="h-4 w-px bg-border-dark mx-2"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-300">
                {project?.name}
              </span>
            </div>
          </div>

          {/* Center: Device Toggles */}
          <div className="hidden md:flex items-center bg-[#1c2128] rounded-lg p-1 gap-1">
            {VIEWPORTS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                title={label}
                aria-label={`Set ${label} viewport`}
                aria-pressed={viewport === value}
                onClick={() => setViewport(value)}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  viewport === value
                    ? "bg-[#282f39] text-white"
                    : "text-[#9da8b9] hover:text-white hover:bg-[#282f39]"
                )}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[#9da8b9]">
              <span className="text-xs font-medium flex items-center gap-1">
                {isDirty ? (
                  <span className="text-yellow-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                    Unsaved changes
                  </span>
                ) : (
                  <span className="text-green-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Saved
                  </span>
                )}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={save}
                disabled={status === 'saving'}
                className={`flex items-center justify-center rounded-lg h-8 px-3 text-xs font-bold tracking-wide transition-colors ${isDirty
                  ? "bg-primary hover:bg-primary/90 text-white"
                  : "bg-[#282f39] text-[#9da8b9] cursor-not-allowed hover:bg-[#323b47]"
                  }`}
              >
                {status === 'saving' ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                aria-pressed={previewMode}
                className={cn(
                  "flex items-center justify-center rounded-lg h-8 px-3 text-xs font-bold tracking-wide transition-colors",
                  previewMode
                    ? "bg-white text-[#111418] hover:bg-gray-200"
                    : "bg-[#282f39] hover:bg-[#323b47] text-white"
                )}
              >
                <Eye size={16} className="mr-1.5" />
                {previewMode ? "Editing" : "Preview"}
              </button>
              <button
                onClick={() => setIsExportDialogOpen(true)}
                className="flex items-center justify-center rounded-lg h-8 px-3 bg-primary hover:bg-primary/90 text-white text-xs font-bold tracking-wide transition-colors"
              >
                <Code size={16} className="mr-1.5" />
                Export Code
              </button>
            </div>
          </div>
        </header>

        {/* Main Workspace */}
        <BuilderDndContext>
        <main className="flex flex-1 overflow-hidden">
          {/* Left Sidebar: Components */}
          <LeftSidebar />

          {/* Center Canvas */}
          <section className="flex-1 bg-[#0a0d11] relative flex flex-col min-w-0 overflow-hidden">
            {/* Canvas Toolbar */}
            <div className="h-8 bg-[#111418] border-b border-border-dark flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#5c6b7f]">{VIEWPORT_LABELS[viewport]}</span>
                <span className="text-[10px] text-[#5c6b7f] px-1 bg-[#282f39] rounded">
                  100%
                </span>
              </div>
              <div className="flex items-center gap-1 text-[#5c6b7f]">
                <button
                  type="button"
                  title="Undo"
                  aria-label="Undo"
                  onClick={undo}
                  disabled={!canUndo}
                  className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded transition-colors",
                    canUndo
                      ? "hover:bg-[#282f39] hover:text-white"
                      : "cursor-not-allowed opacity-40"
                  )}
                >
                  <Undo2 size={16} />
                </button>
                <button
                  type="button"
                  title="Redo"
                  aria-label="Redo"
                  onClick={redo}
                  disabled={!canRedo}
                  className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded transition-colors",
                    canRedo
                      ? "hover:bg-[#282f39] hover:text-white"
                      : "cursor-not-allowed opacity-40"
                  )}
                >
                  <Redo2 size={16} />
                </button>
              </div>
            </div>

            {/* Real Canvas Area */}
            <div className="flex-1 overflow-hidden relative">
              <Canvas />
            </div>
          </section>

          {/* Right Sidebar: Properties */}
          <aside className="w-75 flex-col border-l border-border-dark bg-[#111418] shrink-0 overflow-y-auto hidden md:flex">
            <PropertyPanel />
          </aside>
        </main>
        </BuilderDndContext>
      </div>
      <ExportCodeDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        projectId={projectId}
        projectName={project?.name}
      />
    </>
  );
};

export default Builder;
