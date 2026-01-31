"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileCode,
} from "lucide-react";
import { adminApi } from "@/features/admin/admin.api";
import { Project, PaginationData } from "@/features/admin/admin.types";
import { useDebounce } from "@/hooks/useDebounce";

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getProjects({
        page,
        search: debouncedSearch,
        limit: 10,
      });
      setProjects(response.projects);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, debouncedSearch]);

  const handleDeleteProject = async (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this project? This will soft delete it."
      )
    ) {
      try {
        await adminApi.deleteProject(id);
        fetchProjects();
      } catch (error) {
        alert("Failed to delete project");
      }
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Project Management
          </h2>
          <p className="text-[#9da8b9] mt-1 text-base">
            Manage all user projects.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-darker p-4 rounded-xl border border-border-dark mt-6">
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={20} className="text-[#9da8b9]" />
          </div>
          <input
            type="text"
            className="bg-[#282f39] text-white text-sm rounded-lg block w-full pl-10 p-2.5 placeholder-[#64748b] focus:ring-1 focus:ring-primary focus:outline-none border border-transparent focus:border-primary transition-all"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border-dark bg-[#282f39] text-white hover:bg-[#323b47] text-sm font-medium transition-colors flex-1 sm:flex-none justify-center">
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border-dark bg-[#282f39] text-white hover:bg-[#323b47] text-sm font-medium transition-colors flex-1 sm:flex-none justify-center">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-dark bg-surface-darker shadow-sm mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1c2027] border-b border-border-dark">
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#9da8b9] w-10">
                  <input
                    type="checkbox"
                    className="rounded bg-[#282f39] border-border-dark text-primary focus:ring-offset-0 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#9da8b9]">
                  Project
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#9da8b9]">
                  Workspace
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#9da8b9]">
                  Owner
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#9da8b9]">
                  Status
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#9da8b9] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#9da8b9]">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="animate-spin" />
                      Loading projects...
                    </div>
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#9da8b9]">
                    No projects found.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr
                    key={project._id}
                    className="group hover:bg-[#1c2430] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        className="rounded bg-[#282f39] border-border-dark text-primary focus:ring-offset-0 focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-[#323b47] flex items-center justify-center text-white ring-1 ring-border-dark">
                          <FileCode size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-white">
                            {project.name}
                          </span>
                          <span className="text-[#9da8b9] text-xs">
                            {new Date(project.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white">
                        {(project.workspaceId as any)?.name || "Unknown"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-white">
                          {(project.owner as any)?.name}
                        </span>
                        <span className="text-[#9da8b9] text-xs">
                          {(project.owner as any)?.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border
                          ${project.status === "PUBLISHED"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-slate-700/30 text-slate-400 border-slate-600/30"
                          }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2 text-[#9da8b9]">
                        <button
                          className="p-1.5 rounded-md hover:text-white hover:bg-[#282f39] transition-colors"
                          title="View Details"
                        >
                          <ExternalLink size={18} />
                        </button>
                        <button
                          className="p-1.5 rounded-md hover:text-red-400 hover:bg-[#282f39] transition-colors"
                          onClick={() => handleDeleteProject(project._id)}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border-dark bg-[#1c2027]">
            <div className="text-xs text-[#9da8b9]">
              Showing{" "}
              <span className="text-white font-medium">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="text-white font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of{" "}
              <span className="text-white font-medium">{pagination.total}</span>{" "}
              projects
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-border-dark bg-[#282f39] text-[#9da8b9] hover:text-white hover:bg-[#323b47] disabled:opacity-50 transition-colors"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-border-dark bg-[#282f39] text-[#9da8b9] hover:text-white hover:bg-[#323b47] disabled:opacity-50 transition-colors"
                disabled={page === pagination.pages}
                onClick={() =>
                  setPage((p) => Math.min(pagination.pages, p + 1))
                }
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
