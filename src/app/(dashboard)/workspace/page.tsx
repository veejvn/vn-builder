"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Workspace } from "@/features/workspace/workspace.types";
import { workspaceApi } from "@/features/workspace/workspace.api";
import {
  LayoutDashboard,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  ArrowRight,
  User,
  Building2,
  Rocket,
  Megaphone,
  Loader2,
} from "lucide-react";
import CreateWorkspaceDialog from "@/features/workspace/components/CreateWorkspaceDialog";

const Workspaces = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const fetchedWorkspaces = await workspaceApi.getWorkspaces();
      setWorkspaces(fetchedWorkspaces);
    } catch (err) {
      setError("Failed to load workspaces.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchWorkspaces();
    } else if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "loading") {
      setLoading(true);
    }
  }, [status, router]);

  const handleCreateSuccess = () => {
    fetchWorkspaces(); // Refresh the list after successful creation
  };

  const renderIcon = (iconName: string | undefined) => {
    switch (iconName) {
      case "user":
        return <User size={20} />;
      case "building-2":
        return <Building2 size={20} />;
      case "rocket":
        return <Rocket size={20} />;
      case "megaphone":
        return <Megaphone size={20} />;
      default:
        return <LayoutDashboard size={20} />;
    }
  };

  if (loading) {
    return (
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center text-red-500">
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Workspaces
          </h1>
          <p className="text-slate-500 dark:text-text-secondary">
            Manage your development environments and projects.
          </p>
        </div>
        <button
          onClick={() => setIsCreateDialogOpen(true)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90"
        >
          <Plus size={20} />
          Create Workspace
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md group">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
            <Search size={20} />
          </span>
          <input
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 pl-10 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:border-card-dark dark:bg-card-dark dark:text-slate-50 dark:focus:ring-primary"
            placeholder="Search workspaces..."
            type="text"
          />
        </div>
        <div className="flex gap-2">
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-card-dark dark:bg-card-dark dark:text-slate-200 dark:hover:bg-slate-800">
            <Filter size={20} />
            Filter
          </button>
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-card-dark dark:bg-card-dark dark:text-slate-200 dark:hover:bg-slate-800">
            <ArrowUpDown size={20} />
            Sort
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((ws) => (
          <div
            key={ws.id}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-primary/50 transition-all dark:border-border-dark dark:bg-card-dark dark:hover:border-primary/50"
          >
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      ws.colorClass ||
                      "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400"
                    }`}
                  >
                    {renderIcon(ws.icon || "layout-dashboard")}
                  </div>
                  <div>
                    <h3 className="font-semibold leading-none tracking-tight text-slate-900 dark:text-white">
                      {ws.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-text-secondary">
                      Updated {new Date(ws.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    ws.members.find((m) => m.user === session?.user.id)
                      ?.role === "OWNER"
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/30"
                      : "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/30"
                  }`}
                >
                  {ws.members.find((m) => m.user === session?.user.id)?.role ||
                    "VIEWER"}
                </span>
                <span
                  className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-slate-50 text-slate-600 ring-slate-500/10 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700`}
                >
                  Free Plan
                </span>
              </div>
            </div>
            <div className="flex-1 px-5 pb-5">
              <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    0
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-text-secondary uppercase tracking-wider">
                    Active Projects
                  </span>
                </div>
                <div className="flex -space-x-2 overflow-hidden pl-2">
                  {ws.members.slice(0, 3).map((member, idx) => (
                    <div
                      key={idx}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-card-dark bg-slate-200 dark:bg-slate-700 bg-cover bg-center"
                      // style={{ backgroundImage: `url("${avatar}")` }} // Need actual avatar URLs
                    ></div>
                  ))}
                  {ws.members.length > 3 && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 ring-2 ring-white dark:bg-slate-800 dark:ring-card-dark">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        +{ws.members.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 px-5 py-3 border-t border-slate-100 dark:border-slate-800 group-hover:bg-primary/5 dark:group-hover:bg-primary/10 transition-colors">
              <button
                onClick={() => router.push(`/workspace/${ws.id}/projects`)}
                className="flex w-full items-center justify-end gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Enter Workspace
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}

        {/* New Workspace Button */}
        <button
          onClick={() => setIsCreateDialogOpen(true)}
          className="group relative flex flex-col items-center justify-center min-h-70 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/20 dark:hover:bg-slate-800/50 dark:hover:border-slate-700 transition-all"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors dark:bg-slate-800 dark:text-slate-500">
            <Plus size={32} />
          </div>
          <h3 className="mt-4 text-base font-medium text-slate-900 dark:text-white">
            New Workspace
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-text-secondary">
            Start a new isolated environment
          </p>
        </button>
      </div>

      <CreateWorkspaceDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </main>
  );
};

export default Workspaces;
