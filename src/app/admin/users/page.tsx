"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  Shield,
  FileEdit,
  Code,
  Eye,
  Edit2,
  Ban,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { adminApi } from "@/features/admin/admin.api";
import { User, PaginationData } from "@/features/admin/admin.types";
import { useDebounce } from "@/hooks/useDebounce";
import { UserModal } from "@/features/admin/components/UserModal";

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getUsers({
        page,
        search: debouncedSearch,
        limit: 10,
      });
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch]);

  const renderRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Shield size={14} />;
      case "EDITOR":
        return <FileEdit size={14} />;
      case "DEVELOPER":
        return <Code size={14} />;
      case "VIEWER":
        return <Eye size={14} />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "purple";
      case "EDITOR":
        return "blue";
      case "DEVELOPER":
        return "orange";
      case "VIEWER":
        return "teal";
      default:
        return "gray";
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDisableUser = async (id: string) => {
    if (confirm("Are you sure you want to disable this user?")) {
      try {
        await adminApi.deleteUser(id);
        fetchUsers();
      } catch (error) {
        alert("Failed to disable user");
      }
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            User Management
          </h2>
          <p className="text-[#9da8b9] mt-1 text-base">
            Manage access, roles, and permissions for team members.
          </p>
        </div>
        <button
          onClick={handleAddUser}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-900/20"
        >
          <Plus size={20} />
          Add User
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-darker p-4 rounded-xl border border-border-dark">
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={20} className="text-[#9da8b9]" />
          </div>
          <input
            type="text"
            className="bg-[#282f39] text-white text-sm rounded-lg block w-full pl-10 p-2.5 placeholder-[#64748b] focus:ring-1 focus:ring-primary focus:outline-none border border-transparent focus:border-primary transition-all"
            placeholder="Search by name or email..."
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

      <div className="overflow-hidden rounded-xl border border-border-dark bg-surface-darker shadow-sm">
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
                  User
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#9da8b9]">
                  Role
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#9da8b9]">
                  Status
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#9da8b9]">
                  Last Active
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
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#9da8b9]">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
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
                        <div className="relative">
                          <div className="h-9 w-9 rounded-full bg-[#323b47] flex items-center justify-center text-white font-bold ring-1 ring-border-dark uppercase">
                            {user.name.charAt(0)}
                          </div>
                          {user.status === "ACTIVE" && (
                            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#111418]"></div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-white">
                            {user.name}
                          </span>
                          <span className="text-[#9da8b9] text-xs">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium 
                                                      ${
                                                        getRoleColor(
                                                          user.role
                                                        ) === "purple"
                                                          ? "border-purple-500/20 bg-purple-500/10 text-purple-400"
                                                          : getRoleColor(
                                                              user.role
                                                            ) === "blue"
                                                          ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                                                          : getRoleColor(
                                                              user.role
                                                            ) === "orange"
                                                          ? "border-orange-500/20 bg-orange-500/10 text-orange-400"
                                                          : "border-teal-500/20 bg-teal-500/10 text-teal-400"
                                                      }`}
                      >
                        {renderRoleIcon(user.role)}
                        {user.role}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border
                                                      ${
                                                        user.status === "ACTIVE"
                                                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                          : user.status ===
                                                            "INACTIVE"
                                                          ? "bg-slate-700/30 text-slate-400 border-slate-600/30"
                                                          : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                                      }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#9da8b9]">
                      {user.lastActive || "Never"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2 text-[#9da8b9]">
                        <button
                          className="p-1.5 rounded-md hover:text-white hover:bg-[#282f39] transition-colors"
                          onClick={() => handleEditUser(user)}
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="p-1.5 rounded-md hover:text-red-400 hover:bg-[#282f39] transition-colors"
                          onClick={() => handleDisableUser(user._id)}
                          title="Disable"
                        >
                          <Ban size={18} />
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
              users
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

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchUsers}
        user={selectedUser}
      />
    </>
  );
}
