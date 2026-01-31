import { fetcher } from "@/lib/fetcher";
import { Workspace } from "./workspace.types";

export const workspaceApi = {
  getWorkspaces: async (): Promise<Workspace[]> => {
    return fetcher<Workspace[]>(`/api/workspace`);
  },

  createWorkspace: async (data: {
    name: string;
    description?: string;
  }): Promise<Workspace> => {
    return fetcher<Workspace>(`/api/workspace`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getWorkspaceById: async (id: string): Promise<Workspace> => {
    return fetcher<Workspace>(`/api/workspace/${id}`);
  },

  updateWorkspace: async (
    id: string,
    data: Partial<Workspace>
  ): Promise<Workspace> => {
    return fetcher<Workspace>(`/api/workspace/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteWorkspace: async (id: string): Promise<void> => {
    return fetcher<void>(`/api/workspace/${id}`, {
      method: "DELETE",
    });
  },
};
