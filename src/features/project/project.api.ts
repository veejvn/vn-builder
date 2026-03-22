import { fetcher } from "@/lib/fetcher";
import { Project } from "./project.types";

export const projectApi = {
  getWorkspaceProjects: async (workspaceId: string): Promise<Project[]> => {
    return fetcher<Project[]>(`/api/workspace/${workspaceId}/projects`);
  },

  createProject: async (
    workspaceId: string,
    data: {
      name: string;
      description?: string;
      schema?: any;
      thumbnail?: string;
    }
  ): Promise<Project> => {
    return fetcher<Project>(`/api/workspace/${workspaceId}/projects`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getProjectById: async (projectId: string): Promise<Project> => {
    return fetcher<Project>(`/api/project/${projectId}`);
  },

  updateProject: async (
    projectId: string,
    data: Partial<Project>
  ): Promise<Project> => {
    // Map frontend status to backend status for the API call
    const backendData = { ...data };
    if (backendData.status) {
      (backendData.status as string) =
        backendData.status === "Live" ? "PUBLISHED" : "DRAFT";
    }
    return fetcher<Project>(`/api/project/${projectId}`, {
      method: "PUT",
      body: JSON.stringify(backendData),
    });
  },

  deleteProject: async (projectId: string): Promise<void> => {
    return fetcher<void>(`/api/project/${projectId}`, {
      method: "DELETE",
    });
  },
};
