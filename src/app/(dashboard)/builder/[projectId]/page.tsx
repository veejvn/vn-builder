"use client";

import React, { useState } from "react";
import {
  Layers,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Code,
  Search,
  Square,
  Grid,
  Type,
  AlignLeft,
  MousePointer2,
  Image as ImageIcon,
  PlusCircle,
  Undo2,
  Redo2,
  X,
  ChevronDown,
  ChevronUp,
  Maximize,
  Columns,
  EyeOff,
  Plus,
  Minus,
} from "lucide-react";

interface BuilderProps {
  onBack: () => void;
}

const Builder: React.FC<BuilderProps> = ({ onBack }) => {
  const [selectedElement, setSelectedElement] = useState<string | null>(
    "button"
  );

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

  return (
    <div className="bg-background-dark text-white font-display overflow-hidden h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-14 shrink-0 border-b border-border-dark bg-[#111418] flex items-center justify-between px-4 z-20">
        {/* Left: Logo & Project Info */}
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-2 text-primary cursor-pointer"
            onClick={onBack}
          >
            <Layers size={24} />
            <h1 className="text-white font-bold tracking-tight text-lg">
              VNBuilder
            </h1>
          </div>
          <div className="h-4 w-px bg-border-dark mx-2"></div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-300">
              My Portfolio Project
            </span>
            <span className="text-xs text-[#9da8b9] bg-[#282f39]/50 px-2 py-0.5 rounded">
              v1.2
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
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Saved
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
        <aside className="w-65 flex-col border-r border-border-dark bg-[#111418] shrink-0 z-10 hidden lg:flex">
          {/* Tabs */}
          <div className="flex border-b border-border-dark">
            <button className="flex-1 py-3 text-sm font-medium text-white border-b-2 border-primary bg-[#1c2128]">
              Add
            </button>
            <button className="flex-1 py-3 text-sm font-medium text-[#9da8b9] hover:text-white transition-colors">
              Layers
            </button>
            <button className="flex-1 py-3 text-sm font-medium text-[#9da8b9] hover:text-white transition-colors">
              Assets
            </button>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-border-dark">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9da8b9]"
              />
              <input
                type="text"
                placeholder="Search components..."
                className="w-full bg-[#1c2128] border border-[#282f39] text-white text-xs rounded h-8 pl-8 pr-3 focus:outline-none focus:border-primary placeholder-[#5c6b7f]"
              />
            </div>
          </div>

          {/* Component List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-6">
            {/* Layout Section */}
            <div>
              <h3 className="text-xs font-semibold text-[#9da8b9] uppercase tracking-wider mb-3 px-1">
                Layout
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="group flex flex-col items-center justify-center gap-2 p-3 rounded bg-[#1c2128] border border-transparent hover:border-primary/50 hover:bg-[#222831] cursor-grab active:cursor-grabbing transition-all">
                  <Square className="text-white" size={24} />
                  <span className="text-xs text-[#9da8b9] group-hover:text-white">
                    Container
                  </span>
                </div>
                <div className="group flex flex-col items-center justify-center gap-2 p-3 rounded bg-[#1c2128] border border-transparent hover:border-primary/50 hover:bg-[#222831] cursor-grab active:cursor-grabbing transition-all">
                  <Grid className="text-white" size={24} />
                  <span className="text-xs text-[#9da8b9] group-hover:text-white">
                    Grid
                  </span>
                </div>
              </div>
            </div>

            {/* Basic Elements */}
            <div>
              <h3 className="text-xs font-semibold text-[#9da8b9] uppercase tracking-wider mb-3 px-1">
                Basic
              </h3>
              <div className="space-y-1">
                {["Heading", "Text Block", "Button", "Image"].map((item, i) => {
                  const iconNames = ["title", "notes", "smart_button", "image"];
                  const subtexts = [
                    "H1-H6",
                    "Paragraph",
                    "Link/Action",
                    "JPG/PNG/SVG",
                  ];
                  return (
                    <div
                      key={item}
                      className="flex items-center gap-3 p-2 rounded hover:bg-[#1c2128] cursor-grab group"
                    >
                      <div className="w-8 h-8 rounded bg-[#282f39] flex items-center justify-center text-white group-hover:bg-primary transition-colors">
                        {renderComponentIcon(iconNames[i])}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-white">
                          {item}
                        </span>
                        <span className="text-[10px] text-[#5c6b7f]">
                          {subtexts[i]}
                        </span>
                      </div>
                      <PlusCircle
                        size={16}
                        className="ml-auto text-[#5c6b7f] opacity-0 group-hover:opacity-100"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

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

          {/* Infinite Canvas Area */}
          <div
            className="flex-1 overflow-auto p-10 flex items-center justify-center relative cursor-move"
            style={{
              backgroundImage: "radial-gradient(#282f39 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          >
            {/* The Website Preview (Artboard) */}
            <div
              className="bg-[#111418] w-250 min-h-175 shadow-2xl border border-border-dark relative cursor-default overflow-hidden"
              onClick={() => setSelectedElement(null)}
            >
              {/* Mock Website Header */}
              <nav className="flex items-center justify-between px-8 py-6 border-b border-[#282f39]/30">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-linear-to-br from-primary to-purple-600"></div>
                  <span className="font-bold text-lg text-white">Brand.</span>
                </div>
                <div className="hidden md:flex gap-8 text-sm text-gray-400">
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </div>
                <div className="w-24 h-8 bg-[#1c2128] rounded"></div>
              </nav>

              {/* Mock Website Hero */}
              <div className="px-8 py-20 flex flex-col items-center text-center max-w-4xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-4">
                  Development Tool
                </span>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                  Build visually.
                  <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
                    Ship faster.
                  </span>
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mb-10 leading-relaxed">
                  A powerful visual editor for modern developers. Export clean,
                  semantic code in React, Vue, or HTML. No lock-in.
                </p>

                {/* Selected Element Wrapper */}
                <div
                  className="relative group select-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElement("button");
                  }}
                >
                  {selectedElement === "button" && (
                    <div className="absolute -inset-0.75 border-2 border-primary z-10 pointer-events-none">
                      {/* Top Label */}
                      <div className="absolute -top-6 left-0.5 h-6 bg-primary text-white text-[10px] font-bold px-2 flex items-center rounded-t-sm pointer-events-auto cursor-pointer shadow-sm">
                        Button
                      </div>
                      {/* Resize Handles */}
                      <div className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 bg-white border border-primary pointer-events-auto cursor-nwse-resize"></div>
                      <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-white border border-primary pointer-events-auto cursor-nesw-resize"></div>
                      <div className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 bg-white border border-primary pointer-events-auto cursor-nesw-resize"></div>
                      <div className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 bg-white border border-primary pointer-events-auto cursor-nwse-resize"></div>
                    </div>
                  )}
                  {/* The Actual Button */}
                  <button className="relative bg-primary hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all shadow-lg shadow-blue-500/20">
                    Get Started Free
                  </button>
                </div>

                <div className="mt-12 grid grid-cols-3 gap-8 text-left w-full max-w-3xl border-t border-[#282f39] pt-10">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-8 w-8 rounded bg-[#1c2128] mb-2"></div>
                      <div className="h-4 w-24 bg-[#1c2128] rounded"></div>
                      <div className="h-12 w-full bg-[#1c2128]/50 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Sidebar: Properties */}
        <aside className="w-75 flex-col border-l border-border-dark bg-[#111418] shrink-0 overflow-y-auto hidden md:flex">
          {/* Selector Header */}
          <div className="p-4 border-b border-border-dark bg-[#1c2128]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#9da8b9] uppercase tracking-wider">
                Selector
              </span>
              <span className="text-[10px] text-primary cursor-pointer hover:underline">
                Edit CSS
              </span>
            </div>
            {selectedElement ? (
              <>
                <div className="flex items-center gap-2 bg-[#111418] border border-[#282f39] rounded p-2">
                  <span className="text-primary text-xs font-bold">
                    .btn-primary
                  </span>
                  <span className="text-xs text-[#5c6b7f]">Button</span>
                  <X
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElement(null);
                    }}
                    size={14}
                    className="ml-auto text-[#5c6b7f] cursor-pointer hover:text-white transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-[#5c6b7f]">
                    Inherits from:
                  </span>
                  <span className="text-[10px] text-white bg-[#282f39] px-1.5 rounded">
                    .btn
                  </span>
                </div>
              </>
            ) : (
              <div className="text-xs text-[#5c6b7f] italic py-2">
                No element selected
              </div>
            )}
          </div>

          {selectedElement && (
            <div className="flex flex-col">
              {/* Layout */}
              <div className="border-b border-border-dark">
                <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-[#1c2128]">
                  <h3 className="text-xs font-bold text-white">Layout</h3>
                  <ChevronDown size={16} className="text-[#9da8b9]" />
                </div>
                <div className="px-4 pb-4 space-y-4">
                  {/* Display */}
                  <div className="grid grid-cols-4 gap-1 p-1 bg-[#1c2128] rounded-md border border-[#282f39]">
                    <button
                      className="flex items-center justify-center p-1.5 rounded hover:bg-[#282f39] text-[#9da8b9] hover:text-white"
                      title="Block"
                    >
                      <Square size={18} />
                    </button>
                    <button
                      className="flex items-center justify-center p-1.5 rounded bg-[#282f39] text-white shadow-sm"
                      title="Flex"
                    >
                      <Maximize size={18} className="rotate-45" />
                    </button>
                    <button
                      className="flex items-center justify-center p-1.5 rounded hover:bg-[#282f39] text-[#9da8b9] hover:text-white"
                      title="Grid"
                    >
                      <Columns size={18} />
                    </button>
                    <button
                      className="flex items-center justify-center p-1.5 rounded hover:bg-[#282f39] text-[#9da8b9] hover:text-white"
                      title="None"
                    >
                      <EyeOff size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Spacing (Box Model) */}
              <div className="border-b border-border-dark">
                <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-[#1c2128]">
                  <h3 className="text-xs font-bold text-white">Spacing</h3>
                  <ChevronDown size={16} className="text-[#9da8b9]" />
                </div>
                <div className="px-4 pb-4">
                  <div className="relative w-full h-32 bg-[#1c2128] rounded border border-[#282f39] flex items-center justify-center text-[10px] text-[#5c6b7f]">
                    <span className="absolute top-1 left-2 uppercase tracking-tighter text-[8px]">
                      Margin
                    </span>
                    <input
                      className="absolute top-1 left-1/2 -translate-x-1/2 w-8 text-center bg-transparent focus:text-white focus:outline-none"
                      placeholder="-"
                      defaultValue="20"
                    />
                    <input
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 text-center bg-transparent focus:text-white focus:outline-none"
                      placeholder="-"
                      defaultValue="20"
                    />
                    <input
                      className="absolute left-1 top-1/2 -translate-y-1/2 w-6 text-center bg-transparent focus:text-white focus:outline-none"
                      placeholder="-"
                      defaultValue="auto"
                    />
                    <input
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-6 text-center bg-transparent focus:text-white focus:outline-none"
                      placeholder="-"
                      defaultValue="auto"
                    />

                    <div className="relative w-3/5 h-3/5 bg-[#111418] border border-[#282f39] rounded flex items-center justify-center">
                      <span className="absolute top-0.5 left-1.5 uppercase tracking-tighter text-[8px] z-10">
                        Padding
                      </span>
                      <input
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-8 text-center bg-transparent focus:text-white focus:outline-none z-10"
                        placeholder="-"
                        defaultValue="16"
                      />
                      <input
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 text-center bg-transparent focus:text-white focus:outline-none z-10"
                        placeholder="-"
                        defaultValue="16"
                      />
                      <input
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-5 text-center bg-transparent focus:text-white focus:outline-none z-10"
                        placeholder="-"
                        defaultValue="32"
                      />
                      <input
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-5 text-center bg-transparent focus:text-white focus:outline-none z-10"
                        placeholder="-"
                        defaultValue="32"
                      />

                      <div className="w-1/2 h-1/2 bg-[#282f39] rounded flex items-center justify-center">
                        <span className="text-[8px] text-white">auto</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="border-b border-border-dark">
                <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-[#1c2128]">
                  <h3 className="text-xs font-bold text-white">Typography</h3>
                  <ChevronDown size={16} className="text-[#9da8b9]" />
                </div>
                <div className="px-4 pb-4 space-y-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-[#9da8b9]">Font</span>
                    <div className="relative">
                      <select className="w-full bg-[#1c2128] border border-[#282f39] text-white text-xs rounded p-1.5 appearance-none focus:border-primary focus:outline-none">
                        <option>Inter</option>
                        <option>Roboto</option>
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-2 top-1.5 text-[#9da8b9] pointer-events-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 flex flex-col gap-1">
                      <span className="text-[10px] text-[#9da8b9]">Weight</span>
                      <div className="relative">
                        <select
                          className="w-full bg-[#1c2128] border border-[#282f39] text-white text-xs rounded p-1.5 appearance-none focus:border-primary focus:outline-none"
                          defaultValue="600 - Semibold"
                        >
                          <option>400 - Regular</option>
                          <option>600 - Semibold</option>
                          <option>700 - Bold</option>
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-2 top-1.5 text-[#9da8b9] pointer-events-none"
                        />
                      </div>
                    </div>
                    <div className="w-20 flex flex-col gap-1">
                      <span className="text-[10px] text-[#9da8b9]">Size</span>
                      <input
                        type="text"
                        defaultValue="18px"
                        className="w-full bg-[#1c2128] border border-[#282f39] text-white text-xs rounded p-1.5 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#9da8b9]">Color</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white uppercase">
                        #FFFFFF
                      </span>
                      <div className="w-5 h-5 rounded border border-[#282f39] bg-white cursor-pointer"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Backgrounds */}
              <div className="border-b border-border-dark">
                <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-[#1c2128]">
                  <h3 className="text-xs font-bold text-white">Backgrounds</h3>
                  <ChevronDown size={16} className="text-[#9da8b9]" />
                </div>
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-sm bg-primary border border-white/10"></div>
                      <span className="text-xs text-white">Primary Blue</span>
                    </div>
                    <div className="flex gap-1 opacity-0 hover:opacity-100 transition-opacity group-hover:opacity-100">
                      <button className="text-[#9da8b9] hover:text-white">
                        <EyeOff size={14} />
                      </button>
                      <button className="text-[#9da8b9] hover:text-white">
                        <Minus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Plus size={14} className="text-[#9da8b9]" />
                    <span className="text-[10px] text-[#9da8b9] hover:text-white cursor-pointer">
                      Add background
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
};

export default Builder;
