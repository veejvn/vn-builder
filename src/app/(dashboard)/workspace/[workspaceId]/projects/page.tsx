"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Project } from "@/features/project/project.types";
import { projectApi } from "@/features/project/project.api";
import {
  Settings,
  Plus,
  Search,
  Loader2,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import CreateProjectDialog from "@/features/project/components/CreateProjectDialog";
import EditProjectDialog from "@/features/project/components/EditProjectDialog";
import DeleteProjectDialog from "@/features/project/components/DeleteProjectDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Projects: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const fetchedProjects = await projectApi.getWorkspaceProjects(
        workspaceId
      );
      console.log("Fetched Projects:", fetchedProjects);
      setProjects(fetchedProjects);
    } catch (err) {
      setError("Failed to load projects.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (workspaceId) {
        fetchProjects();
      } else {
        setError("Workspace ID is missing.");
        setLoading(false);
      }
    } else if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "loading") {
      setLoading(true);
    }
  }, [status, router, workspaceId]);

  const handleCreateSuccess = () => {
    fetchProjects(); // Refresh the list after successful creation
  };

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleEditSuccess = () => {
    fetchProjects();
    setSelectedProject(null);
  };

  const handleDeleteSuccess = () => {
    fetchProjects();
    setSelectedProject(null);
  };

  const getStatusColorClass = (statusColor: Project["statusColor"]) => {
    switch (statusColor) {
      case "green":
        return "bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/20";
      case "yellow":
        return "bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "gray":
        return "bg-gray-500/10 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/20";
      default:
        return "bg-gray-500/10 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className="flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-[#111418] dark:text-white justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-red-500 justify-center items-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-[#111418] dark:text-white">
      <div className="flex h-full grow flex-col">
        <div className="w-full flex justify-center py-5 px-4 md:px-8">
          <div className="flex flex-col w-full max-w-300 flex-1">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-2 px-4 py-2">
              <button
                onClick={() => router.push("/workspace")}
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
                <button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="flex-1 md:flex-none flex items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors shadow-lg shadow-primary/30"
                >
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
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getStatusColorClass(
                          project.statusColor
                        )}`}
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              aria-label="Project Actions"
                              className="p-2 rounded-lg hover:bg-[#f0f2f4] dark:hover:bg-[#282f39] text-[#637588] dark:text-[#9da8b9] transition-colors"
                            >
                              <MoreVertical size={20} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditClick(project)}
                              className="cursor-pointer"
                            >
                              <Edit size={16} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(project)}
                              className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                              <Trash2 size={16} className="mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <button
                          onClick={() => router.push(`/builder/${project.id}`)}
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
              <button onClick={() => setIsCreateDialogOpen(true)} className="group flex flex-col rounded-xl overflow-hidden bg-[#f6f7f8] dark:bg-[#161b22] border border-dashed border-[#dce0e5] dark:border-[#282f39] hover:border-primary dark:hover:border-primary cursor-pointer transition-all duration-200 h-full min-h-75">
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
              </button>
            </div>
          </div>
        </div>
      </div>
      <CreateProjectDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
        workspaceId={workspaceId}
      />
      {selectedProject && (
        <EditProjectDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSuccess={handleEditSuccess}
          project={selectedProject}
        />
      )}
      {selectedProject && (
        <DeleteProjectDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onSuccess={handleDeleteSuccess}
          projectId={selectedProject.id}
          projectName={selectedProject.name}
        />
      )}
    </div>
  );
};

export default Projects;
