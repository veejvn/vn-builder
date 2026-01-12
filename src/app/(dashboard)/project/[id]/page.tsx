"use client";

import React from "react";
import { Settings, Plus, Search } from "lucide-react";
import { View } from "@/types";
import { Project } from "@/features/project/project.types";

interface ProjectsProps {
  onNavigate: (view: View) => void;
  onOpenBuilder: () => void;
}

const projects: Project[] = [
  {
    id: "1",
    name: "Marketing Landing Page",
    url: "vnbuilder.com/marketing-lp",
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDoUYgaFfRp_QNNwSYMvSctlzbdK3CWzKzKztj1CsEx0XNZq3dfPbxSw1aPWSKsYsVVQ8Zz-qrZKxj1GgFf5XV_wI2DShHaFV0FwKzwK_piVpJYBMFI1dZLDv8XFwUTgNH4tqAKdqoot4un_zygo0mGyyt3rSXzPerY_Qu45h0ExnVcrG439Jdx_adb50ING8rQ4H2l6HTfBONgxHEinhztiV1__r1jsQFC5DmiDXti4s9siA8brSxYHKKxgSirhFiB2r73weo-77E",
    status: "Live",
    statusColor: "green",
    updated: "2h ago",
  },
  {
    id: "2",
    name: "SaaS Dashboard V2",
    url: "app.vnbuilder.com/dashboard",
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMhs-23b3wl5F6_1EiPfi4CFKBOPa8-6L7eJ3dQwAOI83WV46GSfjCrykBNlSB32uwMYBHXmWjd0Y0SmSRbp8JQ4VgBub-KzqdidY2SNmcVzkBHfoIFJX07FoQbNKGugpyvEs5M3gLoOZ9cJ4GCt76kUIJtBM4JLuIMZCwrKB10R0TlS22k2qPSl1kARmbqXjR3OvStsYiDxSJWwiemSqTjLDg_y7ucspqGv5V6FRuhnfg_dr-UfrSL_kdf0wazXoIa2IFgyZNFcE",
    status: "Staging",
    statusColor: "yellow",
    updated: "1d ago",
  },
  {
    id: "3",
    name: "Personal Portfolio",
    url: "alex-dev.vnbuilder.site",
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5qgJT4CUPt6yYt24-NUNcngEnoarYQrb9j1tYr2fIgNbFFfBb-BhOtgL-Zf7_AbdlEjAH3caBVqpQLcGm3HMsCq-62IPKNThTdlWqd7zVubKVgbfcks6YgzuvaPSbkVqgebgWBQ_KjxUG5i7eFHY5a1yBCnYWrl4Pkh7YpppCu4pQuDzztZht4u42O2oUL7WtJpbjoIs2A_nLADP0gYPCKgtGKDfMcD0FgdXMMOgFl7b-UqAAUTllQq2EvokoVGLV9sKXPg5jJiY",
    status: "Draft",
    statusColor: "gray",
    updated: "3d ago",
  },
  {
    id: "4",
    name: "E-Commerce Storefront",
    url: "shop.brandnew.com",
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrbFzhcZMmYksvZJ-sBUlvTCiHjUtj8W2axypoorzYHjBi7690t-vjRinL2vUg00Rt4kF3mZWGnd0XkYgPGNMbUFybty4iXYPUWp7Cn-Uhc6mMZnGShU8XRG2LVibUfAx4XgZHWu10pJqwgI0-N5VQeVYYBdKvnVYwUGkt7d2fiPBCiUuA0MKHIgt6LexnvQWgJayigZqlwS6TsIMyvWXKhSPiDZ132Zd0-uuFSqpqqmQIglaLDEWFX2I6n5AtliH9Zy_ntKNFDLE",
    status: "Live",
    statusColor: "green",
    updated: "5d ago",
  },
  {
    id: "5",
    name: "Documentation Site",
    url: "docs.api-service.io",
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB1UCJpxNUA2uIgRIN0f-ZW6LcwFt7BpkU753h2ZV3Aa9B1k8BrG3Nz9IN1LNHioODFCq7XHTCqVe6p4U20iG9HcxsuAMxYtcmKLX4Ui5fOqLg8Jm4sh3MF_NeDrqTyxg-sO6WtbKF8qxvkB91ic_c__VZ_7oRWa6MRvaBgOqeZUk2FmM4zJ0GFsi8ZEUPnMx9NvFvZOAg0GUFWRYzUiDGXCyuvSmXt6A1XLFnhtYurlpPsrupJsWXO816on4fFiERUtHeqNmYaVO8",
    status: "Draft",
    statusColor: "gray",
    updated: "1w ago",
  },
];

const Projects: React.FC<ProjectsProps> = ({ onNavigate, onOpenBuilder }) => {
  return (
    <div className="flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-[#111418] dark:text-white">
      <div className="flex h-full grow flex-col">
        <div className="w-full flex justify-center py-5 px-4 md:px-8">
          <div className="flex flex-col w-full max-w-300 flex-1">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-2 px-4 py-2">
              <button
                onClick={() => onNavigate(View.WORKSPACES)}
                className="text-[#637588] dark:text-[#9da8b9] text-sm font-medium leading-normal hover:text-primary transition-colors"
              >
                My Team Workspace
              </button>
              <span className="text-[#637588] dark:text-[#9da8b9] text-sm font-medium leading-normal">
                /
              </span>
              <span className="text-[#111418] dark:text-white text-sm font-medium leading-normal">
                Projects
              </span>
            </div>

            {/* Page Heading & Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-4 py-4 mb-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-[#111418] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                  Projects
                </h1>
                <p className="text-[#637588] dark:text-[#9da8b9] text-base font-normal leading-normal">
                  Manage your site projects and deployments
                </p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors shadow-lg shadow-primary/30">
                  <Plus size={20} className="mr-2" />
                  <span className="truncate">Create Project</span>
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="px-4 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex flex-col h-12 w-full sm:max-w-md">
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-full border border-[#dce0e5] dark:border-none bg-white dark:bg-[#282f39] focus-within:ring-2 focus-within:ring-primary transition-all">
                    <div className="text-[#637588] dark:text-[#9da8b9] flex items-center justify-center pl-4 rounded-l-lg border-r-0">
                      <Search size={24} />
                    </div>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-0 border-none bg-transparent focus:border-none h-full placeholder:text-[#637588] dark:placeholder:text-[#9da8b9] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                      placeholder="Search projects by name..."
                    />
                  </div>
                </label>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm font-medium text-[#637588] dark:text-[#9da8b9]">
                    Sort by:
                  </span>
                  <select className="h-12 rounded-lg border border-[#dce0e5] dark:border-none bg-white dark:bg-[#282f39] text-[#111418] dark:text-white px-4 py-2 pr-8 focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer">
                    <option>Last Updated</option>
                    <option>Name (A-Z)</option>
                    <option>Date Created</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-12">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-[#1c2027] shadow-sm hover:shadow-md border border-[#e5e7eb] dark:border-[#282f39] hover:border-primary dark:hover:border-primary transition-all duration-200"
                >
                  <div
                    className="relative w-full aspect-video bg-cover bg-center bg-[#f0f2f4] dark:bg-[#282f39]"
                    style={{ backgroundImage: `url("${project.thumbnail}")` }}
                  >
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                          project.statusColor === "green"
                            ? "bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/20"
                            : project.statusColor === "yellow"
                            ? "bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
                            : "bg-gray-500/10 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/20"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 p-5 gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#111418] dark:text-white leading-tight mb-1 group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-[#637588] dark:text-[#9da8b9]">
                        {project.url}
                      </p>
                    </div>
                    <div className="mt-auto pt-4 border-t border-[#f0f2f4] dark:border-[#282f39] flex items-center justify-between">
                      <span className="text-xs font-medium text-[#637588] dark:text-[#9da8b9]">
                        Updated {project.updated}
                      </span>
                      <div className="flex gap-2">
                        <button
                          aria-label="Settings"
                          className="p-2 rounded-lg hover:bg-[#f0f2f4] dark:hover:bg-[#282f39] text-[#637588] dark:text-[#9da8b9] transition-colors"
                        >
                          <Settings size={20} />
                        </button>
                        <button
                          onClick={onOpenBuilder}
                          className="px-4 py-2 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-colors shadow-sm"
                        >
                          Open Builder
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Create New Placeholder */}
              <div className="group flex flex-col rounded-xl overflow-hidden bg-[#f6f7f8] dark:bg-[#161b22] border border-dashed border-[#dce0e5] dark:border-[#282f39] hover:border-primary dark:hover:border-primary cursor-pointer transition-all duration-200 h-full min-h-75">
                <div className="flex flex-col flex-1 items-center justify-center gap-4 p-8 text-center">
                  <div className="flex items-center justify-center size-16 rounded-full bg-white dark:bg-[#1c2027] text-primary shadow-sm group-hover:scale-110 transition-transform duration-200">
                    <Plus size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#111418] dark:text-white leading-tight mb-2">
                      Create New Project
                    </h3>
                    <p className="text-sm text-[#637588] dark:text-[#9da8b9] max-w-50 mx-auto">
                      Start from scratch or use one of our templates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
