'use client';

import React from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Globe,
  ShoppingCart,
  BarChart2,
  Smartphone,
  ArrowRightLeft,
  Archive,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Mock Data
const projects = [
    { name: 'E-commerce Dashboard', version: 'v1.2.0', workspace: 'Alpha Team', owner: 'Alice Freeman', ownerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2uEbDYMV8Yl-hHJT2qt3ueKrltNlfKw9KQp4gmZAjTuJKJoEQzQmILRO218Unye4-9V_VC-3hVtSnvxPj8J7YLsxGcy_w0M9fJB0QahQITEv54IKWAWWgtl00E4BHcFyqYwZsckoXw4M18xHlMvMwpojyHBMFykiE1ET8aFlxvGSfzl6-bxgKPmf5o-kRbgacNaNu-e_H0bDDdGrfDyNyjQh8_L0p61ONYTk9-PBCjFfZcgxzRu16UjroxzzeVjAdWpUiLeYVrtY', status: 'Live', statusColor: 'emerald', created: 'Oct 24, 2023', icon: 'web', iconColor: 'blue' },
    { name: 'Client Portal App', version: 'v0.9.5-beta', workspace: 'Marketing Dept', owner: 'Bob Smith', ownerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRRJC7mp_EJcmMOfR2qbdLsYYSZUFsTmUxiETY3iBNRSLDi-1aeX1uFCGinjU7y_YnbEkk1uIDyFME28w61vrSP0gVMCQSWHGU3E0i5Hi6QEFeVzc-l1X8ZNEBWadaLdPhIBBYx1ipzkA9nuoliqu2G_83FqnF3ZBZmTEOX4MQgnkgssCDgtaRpoWVhTjBP6-cPOL6xO6juRByI_XXHfsWN5jb9WKDg4UDV1gZ_SlCOiNkV0TkuyNZ9aGWRDk6Jok-iiI4zCDCa0c', status: 'Draft', statusColor: 'amber', created: 'Nov 02, 2023', icon: 'shopping_cart', iconColor: 'purple' },
    { name: 'Internal Tools', version: 'v2.1.0', workspace: 'DevOps', owner: 'Charlie Dev', ownerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAB-pI3WUtqXg-rTNa9M5fLGmgdNjQORpXN_MASW-Z_pK3a0aT-6uhCql8eaA8ZAkn9g5r0VhiMWfQnb2UQqfkqqQsEUTEiyKqrpL1PsX-h7s9njZvF85k5NA4a1LOp3ZlXlVYWCvYV6FnD-GdeWH4DOc6DHg1AYbaCK_pdi3pq0tuC54Gb6PPugqo_Ka7mOa_9mBg5_uXYCCCT_xltSB8sX35Ubft23JjYZcrLp7X495pQm9nPbXb0a2J30-uGDtzLPOzMh0LbG_U', status: 'Live', statusColor: 'emerald', created: 'Sep 15, 2023', icon: 'analytics', iconColor: 'orange' },
    { name: 'Landing Page V2', version: 'v1.0.0', workspace: 'Design Studio', owner: 'Dana Lee', ownerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBbbkJ-nCyxzCT1b3c0MoyAbxk-b599M2Lg7oBFNYS7YbeJT74smyWXH2xYpjTgI1jm1IXnvEFdmPnAx2_1dcrkwwd1oVsWmfRRoP1lpyaie804PvMGf_FQHk-j3bqkF1Da81m8aWpwK4JuohYknxYrPWLEZoHHoJs0eYT4uN5vWamjpfbKnWdBfxJmfCv5YGyPE7oKLBLMtMyOHo1YXR_RJsjlOaqVbZPdOdJLAgpdYPFXh2S2lVFznZ5wyzZb_vabLANysPBxno', status: 'Draft', statusColor: 'amber', created: 'Dec 01, 2023', icon: 'public', iconColor: 'teal' },
    { name: 'Mobile App API', version: 'v3.0.1', workspace: 'Mobile Squad', owner: 'Evan Wright', ownerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcH58xHE6b0Wx40GkP0oxxzblPFI5mcv5HX8LJPisvEIl6la00YRSxm3g16C24CzRIIYXYOOWcM4Rsz-jF6sUhFM4Fk9Lsf06LM6czlluzl9yyM01fkHKKPQZPsbZgUYjKFxYkD1UwZoAI423KshyGqrHFTseCNWj_BpBi8h7SM7PE0d-OTwYa2_ecsG8Y-XVkK1Oq21W5QFR4_TaYUUgcO1oz2s3K58vEe25HJGNdXu-cE01ngYWG6dSgYF2wq6mvCI19d2Sck_U', status: 'Live', statusColor: 'emerald', created: 'Aug 12, 2023', icon: 'smartphone', iconColor: 'pink' },
];

export default function GlobalProjectsPage() {
  const renderProjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'web':
        return <Globe size={20} />;
      case 'shopping_cart':
        return <ShoppingCart size={20} />;
      case 'analytics':
        return <BarChart2 size={20} />;
      case 'public':
        return <Globe size={20} />;
      case 'smartphone':
        return <Smartphone size={20} />;
      default:
        return <Globe size={20} />;
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Global Projects Admin</h2>
          <p className="text-[#9da8b9] mt-1 text-base">Comprehensive view of all projects across workspaces.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-900/20">
          <Plus size={20} />
          Create Project
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-darker p-4 rounded-xl border border-border-dark">
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={20} className="text-[#9da8b9]" />
          </div>
          <input className="bg-[#282f39] text-white text-sm rounded-lg block w-full pl-10 p-2.5 placeholder-[#64748b] focus:ring-1 focus:ring-primary focus:outline-none border border-transparent focus:border-primary transition-all" placeholder="Search projects..." type="text" />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border-dark bg-[#282f39] text-white hover:bg-[#323b47] text-sm font-medium transition-colors flex-1 sm:flex-none justify-center">
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border-dark bg-[#282f39] text-white hover:bg-[#323b47] text-sm font-medium transition-colors flex-1 sm:flex-none justify-center">
            <Download size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-dark bg-surface-darker shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1c2027] border-b border-border-dark">
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#9da8b9] w-10">
                  <input className="rounded bg-[#282f39] border-border-dark text-primary focus:ring-offset-0 focus:ring-0 cursor-pointer" type="checkbox" />
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#9da8b9]">Project Name</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#9da8b9]">Workspace</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#9da8b9]">Owner</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#9da8b9]">Status</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#9da8b9]">Created Date</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#9da8b9] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark text-sm">
              {projects.map((project, idx) => (
                <tr key={idx} className="group hover:bg-[#1c2430] transition-colors">
                  <td className="py-3 px-4">
                    <input className="rounded bg-[#282f39] border-border-dark text-primary focus:ring-offset-0 focus:ring-0 cursor-pointer" type="checkbox" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`bg-${project.iconColor}-500/10 p-2 rounded-lg border border-${project.iconColor}-500/20 text-${project.iconColor}-400`}>
                        {renderProjectIcon(project.icon)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{project.name}</span>
                        <span className="text-[#9da8b9] text-xs">{project.version}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-white">{project.workspace}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-cover bg-center ring-1 ring-border-dark" style={{ backgroundImage: `url("${project.ownerAvatar}")` }}></div>
                      <span className="text-[#9da8b9]">{project.owner}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${project.statusColor}-500/10 text-${project.statusColor}-500 border border-${project.statusColor}-500/20`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#9da8b9]">{project.created}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2 text-[#9da8b9]">
                      <button className="p-1.5 rounded-md hover:text-white hover:bg-[#282f39] transition-colors" title="Transfer Ownership">
                        <ArrowRightLeft size={18} />
                      </button>
                      <button className="p-1.5 rounded-md hover:text-red-400 hover:bg-[#282f39] transition-colors" title="Archive">
                        <Archive size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border-dark bg-[#1c2027]">
          <div className="text-xs text-[#9da8b9]">Showing <span className="text-white font-medium">1-5</span> of <span className="text-white font-medium">124</span> projects</div>
          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center h-8 w-8 rounded-lg border border-border-dark bg-[#282f39] text-[#9da8b9] hover:text-white hover:bg-[#323b47] disabled:opacity-50 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button className="flex items-center justify-center h-8 w-8 rounded-lg border border-border-dark bg-[#282f39] text-[#9da8b9] hover:text-white hover:bg-[#323b47] transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
