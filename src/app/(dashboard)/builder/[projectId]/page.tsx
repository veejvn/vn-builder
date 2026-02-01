"use client";

import React, { useEffect, useState } from "react";
import {
  Layers,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Code,
  Square,
  Type,
  AlignLeft,
  MousePointer2,
  Image as ImageIcon,
  Undo2,
  Redo2,
} from "lucide-react";
import { Canvas } from "@/features/builder/components/Canvas";
import { LayoutTree } from "@/features/builder/components/LayoutTree";
import { PropertyPanel } from "@/features/builder/components/PropertyPanel";
import { LeftSidebar } from "@/features/builder/components/LeftSidebar";
import { useBuilderStore } from "@/features/builder/store/builder.store";
import { useAutoSave } from "@/features/builder/hooks/useAutoSave";
import { useParams, useRouter } from "next/navigation";
import { useProject } from "@/features/project/hooks/useProjects";
import { DEFAULT_SCHEMA } from "@/features/builder/store/builder.store";

const Builder = () => {
  const router = useRouter();
  const { projectId } = useParams() as { projectId: string };
  const [isLoaded, setIsLoaded] = useState(false);

  const { data: project, isLoading, isError } = useProject(projectId);

  const setSchema = useBuilderStore((state) => state.setSchema);
  const initializeSchema = useBuilderStore((state) => state.initializeSchema);
  const { status, setInitialState } = useAutoSave(projectId, isLoaded);

  // Reset loading state when projectId changes
  useEffect(() => {
    setIsLoaded(false);
    initializeSchema();
  }, [projectId, initializeSchema]);

  // Load project data
  useEffect(() => {
    if (project) {
      if (project.schema && Object.keys(project.schema).length > 0) {
        setSchema(project.schema);
        setInitialState(project.schema);
      } else {
        // For new projects or empty schema, set the state to default
        // This prevents auto-save from thinking it's a change if it's already default
        setInitialState(DEFAULT_SCHEMA);
      }
      setIsLoaded(true);
    }
  }, [project, setSchema, setInitialState]);

  const renderComponentIcon = (iconName: string) => {
    switch (iconName) {
      case "title":
        return <Type size={18} />;
      case "notes":
        return <AlignLeft size={18} />;
      case "smart_button":
        return <MousePointer2 size={18} />;
      case "image":
        return <ImageIcon size={18} />;
      default:
        return <Square size={18} />;
    }
  };

  const handleBack = () => {
    if (project?.workspaceId) {
      router.push(`/workspace/${project.workspaceId}/projects`);
    } else {
      router.back();
    }
  };

  // Prevent auto-save overwriting before load
  if (isLoading || !isLoaded) {
    return <div className="h-screen flex items-center justify-center bg-[#111418] text-white">Loading Builder...</div>;
  }

  if (isError) {
    return <div className="h-screen flex items-center justify-center bg-[#111418] text-red-500">Failed to load project</div>;
  }

  return (
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
          <button className="p-1.5 rounded bg-[#282f39] text-white hover:bg-[#323b47] transition-colors">
            <Monitor size={18} />
          </button>
          <button className="p-1.5 rounded text-[#9da8b9] hover:text-white hover:bg-[#282f39] transition-colors">
            <Tablet size={18} />
          </button>
          <button className="p-1.5 rounded text-[#9da8b9] hover:text-white hover:bg-[#282f39] transition-colors">
            <Smartphone size={18} />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#9da8b9]">
            <span className="text-xs font-medium flex items-center gap-1">
              {status === 'saving' && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                  Saving...
                </>
              )}
              {status === 'saved' && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Saved
                </>
              )}
              {status === 'error' && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  Error
                </>
              )}
            </span>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center justify-center rounded-lg h-8 px-3 bg-[#282f39] hover:bg-[#323b47] text-white text-xs font-bold tracking-wide transition-colors">
              <Eye size={16} className="mr-1.5" />
              Preview
            </button>
            <button className="flex items-center justify-center rounded-lg h-8 px-3 bg-primary hover:bg-primary/90 text-white text-xs font-bold tracking-wide transition-colors">
              <Code size={16} className="mr-1.5" />
              Export Code
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Components */}
        <LeftSidebar />

        {/* Center Canvas */}
        <section className="flex-1 bg-[#0a0d11] relative flex flex-col min-w-0 overflow-hidden">
          {/* Canvas Toolbar */}
          <div className="h-8 bg-[#111418] border-b border-border-dark flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#5c6b7f]">1200 x 800px</span>
              <span className="text-[10px] text-[#5c6b7f] px-1 bg-[#282f39] rounded">
                100%
              </span>
            </div>
            <div className="flex items-center gap-3 text-[#5c6b7f]">
              <Undo2
                size={16}
                className="cursor-pointer hover:text-white transition-colors"
              />
              <Redo2
                size={16}
                className="cursor-pointer hover:text-white transition-colors"
              />
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
    </div>
  );
};

export default Builder;
