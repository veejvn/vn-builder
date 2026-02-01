import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../admin.api";
import { toast } from "sonner";

export const ADMIN_KEYS = {
    stats: ["admin", "stats"] as const,
    users: (params: any) => ["admin", "users", params] as const,
    workspaces: (params: any) => ["admin", "workspaces", params] as const,
    projects: (params: any) => ["admin", "projects", params] as const,
};

export const useAdminStats = () => {
    return useQuery({
        queryKey: ADMIN_KEYS.stats,
        queryFn: () => adminApi.getStats(),
    });
};

export const useAdminUsers = (params: { page: number; search: string; limit?: number }) => {
    return useQuery({
        queryKey: ADMIN_KEYS.users(params),
        queryFn: () => adminApi.getUsers(params),
    });
};

export const useAdminWorkspaces = (params: { page: number; search: string; limit?: number }) => {
    return useQuery({
        queryKey: ADMIN_KEYS.workspaces(params),
        queryFn: () => adminApi.getWorkspaces(params),
    });
};

export const useAdminProjects = (params: { page: number; search: string; limit?: number }) => {
    return useQuery({
        queryKey: ADMIN_KEYS.projects(params),
        queryFn: () => adminApi.getProjects(params),
    });
};

export const useAdminDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => adminApi.deleteUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
            queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.stats });
            toast.success("User disabled successfully");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to disable user");
        }
    });
};

export const useAdminDeleteProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (projectId: string) => adminApi.deleteProject(projectId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
            queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.stats });
            toast.success("Project deleted successfully");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to delete project");
        },
    });
};

