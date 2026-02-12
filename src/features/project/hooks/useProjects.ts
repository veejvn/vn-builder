import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectApi } from "../project.api";
import { Project } from "../project.types";
import { toast } from "sonner";

export const PROJECT_KEYS = {
    all: ["projects"] as const,
    workspace: (workspaceId: string) => [...PROJECT_KEYS.all, "workspace", workspaceId] as const,
    detail: (projectId: string) => [...PROJECT_KEYS.all, "detail", projectId] as const,
};

export const useProjects = (workspaceId: string) => {
    return useQuery({
        queryKey: PROJECT_KEYS.workspace(workspaceId),
        queryFn: () => projectApi.getWorkspaceProjects(workspaceId),
        enabled: !!workspaceId,
    });
};

export const useProject = (projectId: string) => {
    return useQuery({
        queryKey: PROJECT_KEYS.detail(projectId),
        queryFn: () => projectApi.getProjectById(projectId),
        enabled: !!projectId,
    });
};

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { workspaceId: string; name: string; description?: string; thumbnail?: string }) =>
            projectApi.createProject(data.workspaceId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: PROJECT_KEYS.workspace(variables.workspaceId),
            });
            toast.success("Project created successfully");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to create project");
        },
    });
};

export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ projectId, data }: { projectId: string; data: Partial<Project> }) =>
            projectApi.updateProject(projectId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
            //toast.success("Project updated successfully");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to update project");
        },
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (projectId: string) => projectApi.deleteProject(projectId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
            toast.success("Project deleted successfully");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to delete project");
        },
    });
};
