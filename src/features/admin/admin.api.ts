import { fetcher } from "@/lib/fetcher";
import { GetUsersResponse, User, UserRole, UserStatus } from "./admin.types";

export const adminApi = {
  getUsers: (params: { page?: number; limit?: number; search?: string } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);

    return fetcher<GetUsersResponse>(`/api/admin/users?${searchParams.toString()}`);
  },

  createUser: (data: Partial<User> & { password?: string }) => {
    return fetcher<{ message: string; user: User }>("/api/admin/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateUser: (id: string, data: Partial<User>) => {
    return fetcher<{ message: string; user: User }>(`/api/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteUser: (id: string) => {
    return fetcher<{ message: string }>(`/api/admin/users/${id}`, {
      method: "DELETE",
    });
  },
};
