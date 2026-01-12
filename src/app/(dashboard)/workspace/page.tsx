"use client";

import React from "react";
import { Workspace } from "@/features/workspace/workspace.types";
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
} from "lucide-react";

interface WorkspacesProps {
  onEnterWorkspace: () => void;
}

// Dummy Data
const workspaces: Workspace[] = [
  {
    id: "1",
    name: "Personal Projects",
    icon: "user",
    colorClass:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    updated: "2h ago",
    role: "Owner",
    plan: "Free Plan",
    activeProjects: 3,
    members: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD4BzMl2OPg1oeQfsUzN27YRo_vu-JoZbYSUjXiuxXfEPmWfx0ugDLGpSIJnPivaybQdb8K1xWUwt2hJjRoULISv5bSPISb3yUBZZqeOk8ohABuKDihCe0NELDU5lMDDKRBWa78oxGnh6iQiGNw7rNmgqprQ7hztrad_0wyVBN1CK635XyqL6q5uwKusUOIifmUX87MO1fCn2S-w3wNp3QYg6QBA1ZrprKdcsrkTmG_k8uepJtP46MmbBSQXWdtldG5bDJY3A9lXHU",
    ],
  },
  {
    id: "2",
    name: "Acme Corp Team",
    icon: "building-2",
    colorClass:
      "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    updated: "5m ago",
    role: "Editor",
    plan: "Pro Plan",
    activeProjects: 12,
    members: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC5Cf5Js3_pY71AWSmONtfobuvqamF-__gKpRtw9uT-BXYljvacMWMis4UYKrQsPiJT3QbMqgJIbkOpkWo-RwNjy2LgoJjQbVzzLAK8QTBn7vmEtMvhGyrGMNikha2j3CCGG_dHYp1HyNcBl2vHqYVj6YK0auXR4Ouhq2_zf0FCQXInTuPNYGh8alyfBgG6Bd0Qc1ChOnxxC5eHPsbyA7symp3ddeFBAQKVMRe_kUP8GcA-oadm9_ZxQbqE8-8IKup3sIdd4QB_5oo",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCHy6l2aL1PWrTth9pLETW0gqmAZVAM6ws7FDYwXRIWkFJmfK-1qowFmf8VMypi51L-v6qP6Nrfix5eEEqWNf8CB_t0iCWNggJWcIVbj5RpxubUCzL2SKMhOnoUHXKlqNM6VENdWnTj8KxDkuEAk0-QagcUmWO5kEyR57vOXFsCJNjMlTovHQ2E3tvGXWBKpn0FI1x8zUB5Qsx9l9uSWJZRufetlW7mLLoaxUEZb2DuJrOO_rK6xtAqlqB9ku4FhRwjNaobW7zZDRU",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCoRGyNZtcmMujfIX2VQ-MEjXjYHza6G0NThCJ3dD0yrWnVP-pQPG8VlrorMcRGlyoglQXvIVetC5uZJpCBQ5_Rw_GCykhcXFnBw37q29l0yzG4sVxvb27MQpSlmXN2BR2eIVNi82PCXfzd1x-pO05oCRz5-OObfeOgdtrhjBeFy9fodr6bCJ5CgYusOJAU8s5meY7pZCLDucCJzarLulql0PlmsNsK_bNyp246JCUibX_wkigks5QLaPxzamOAWv-o2qe_1JULnfs",
    ],
  },
  {
    id: "3",
    name: "SaaS Startup",
    icon: "rocket",
    colorClass:
      "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
    updated: "1d ago",
    role: "Owner",
    plan: "Pro Plan",
    activeProjects: 1,
    members: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDHoeMhmCgQDg4fahkYaPxe1cI57t0VYSCJI_0wT_S60I29wIMy5px_D3g_WnJSIZMx7Q4vNCYndtuNgZz0HOjJT5fwR4SDXojX8Ib_RbcycDQUTsAwy-cf3u_b1sDdHsHBgsxZFFF5ormSuzk-r9VNbOmPvbP_zXJFsKmUqo1E4cSfts9andXZcxyl2Pmm9Qr17OrGrSHZmRizCtiLcH9N8WifHZF2FsJjv2pyDX1nnA3h2GKHFS5kJeCnLRoINY5qcWMQHzXslhc",
    ],
  },
  {
    id: "4",
    name: "Marketing Pages",
    icon: "megaphone",
    colorClass:
      "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    updated: "1w ago",
    role: "Editor",
    plan: "Free Plan",
    activeProjects: 5,
    members: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsB6WSPIOdY5YaCCxbzDrNv4tG-a9pU_r3iIBIapV13uF6BWbAoC4Mzx9ywsMYcqZ7CFjor-k-z5vIVWkCaxVtBBTcvW3elKf1SyFA6Ir76dzlnhnTDRN8O1a0gCtYPyHcMNqHw1e8-fxJqvb-Gc0CY21niFca1sD6Y07dE6CpvYAQqKKBUGXn8PAxEt0VA8Z0WgpuV7TEjX4R6TZbAuFJlrk2cpccjrD18gG4azfF_q85rI4qGvwYzNLkhdmPigoWHqyWvL4WhaA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ-DA9uMvO30MliGQK66gwtmCdYQo20euP_ViD7b_HNNRn_92gMhQPqMWoZo7kaGxQt31NviDke_RJZzFo4ZEUAEhE3SqGCbguNq4k276RagfjUvX-nrSTDZqzvBP5SiVFCgKK1qi73hStbPooRlMVGnpkE_9zi-mFOz6hHbFyl4_MHDuEbb1ZVI07d8t6VFOdFHslJ_uC5QVDvzg1dRdLG8H7Fusj_C5Wli3rln0EqOZIbkH_uiCuhbeTzf571Mbr27Jy7iqtj74",
    ],
  },
];

const Workspaces: React.FC<WorkspacesProps> = ({ onEnterWorkspace }) => {
  const renderIcon = (iconName: string) => {
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
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90">
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
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${ws.colorClass}`}
                  >
                    {renderIcon(ws.icon)}
                  </div>
                  <div>
                    <h3 className="font-semibold leading-none tracking-tight text-slate-900 dark:text-white">
                      {ws.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-text-secondary">
                      Updated {ws.updated}
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
                    ws.role === "Owner"
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/30"
                      : "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/30"
                  }`}
                >
                  {ws.role}
                </span>
                <span
                  className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    ws.plan === "Pro Plan"
                      ? "bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/30"
                      : "bg-slate-50 text-slate-600 ring-slate-500/10 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700"
                  }`}
                >
                  {ws.plan}
                </span>
              </div>
            </div>
            <div className="flex-1 px-5 pb-5">
              <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {ws.activeProjects}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-text-secondary uppercase tracking-wider">
                    Active Projects
                  </span>
                </div>
                <div className="flex -space-x-2 overflow-hidden pl-2">
                  {ws.members.slice(0, 3).map((avatar, idx) => (
                    <div
                      key={idx}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-card-dark bg-slate-200 dark:bg-slate-700 bg-cover bg-center"
                      style={{ backgroundImage: `url("${avatar}")` }}
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
                onClick={onEnterWorkspace}
                className="flex w-full items-center justify-end gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Enter Workspace
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}

        {/* New Workspace Button */}
        <button className="group relative flex flex-col items-center justify-center min-h-70 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/20 dark:hover:bg-slate-800/50 dark:hover:border-slate-700 transition-all">
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
    </main>
  );
};

export default Workspaces;
