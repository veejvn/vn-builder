"use client";

import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { User, UserRole, UserStatus } from "../admin.types";
import { adminApi } from "../admin.api";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: User | null;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER" as UserRole,
    status: "ACTIVE" as UserStatus,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "", // Không hiển thị mật khẩu cũ
        role: user.role,
        status: user.status,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "USER",
        status: "ACTIVE",
      });
    }
    setError("");
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (user) {
        await adminApi.updateUser(user._id, {
          name: formData.name,
          role: formData.role,
          status: formData.status,
        });
      } else {
        await adminApi.createUser(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#1c2027] border border-border-dark rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border-dark bg-[#111418]">
          <h3 className="text-lg font-bold text-white">
            {user ? "Edit User" : "Add New User"}
          </h3>
          <button
            onClick={onClose}
            className="text-[#9da8b9] hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#9da8b9]">
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full bg-[#282f39] text-white text-sm rounded-lg p-2.5 border border-border-dark focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#9da8b9]">
              Email Address
            </label>
            <input
              type="email"
              required
              disabled={!!user}
              className="w-full bg-[#282f39] text-white text-sm rounded-lg p-2.5 border border-border-dark focus:ring-1 focus:ring-primary focus:outline-none disabled:opacity-50"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {!user && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#9da8b9]">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full bg-[#282f39] text-white text-sm rounded-lg p-2.5 border border-border-dark focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#9da8b9]">Role</label>
              <select
                className="w-full bg-[#282f39] text-white text-sm rounded-lg p-2.5 border border-border-dark focus:ring-1 focus:ring-primary focus:outline-none"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as UserRole })
                }
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                {/* <option value="EDITOR">Editor</option>
                <option value="DEVELOPER">Developer</option>
                <option value="VIEWER">Viewer</option> */}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#9da8b9]">
                Status
              </label>
              <select
                className="w-full bg-[#282f39] text-white text-sm rounded-lg p-2.5 border border-border-dark focus:ring-1 focus:ring-primary focus:outline-none"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as UserStatus,
                  })
                }
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="AWAY">Away</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-transparent border border-border-dark rounded-lg hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {user ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
