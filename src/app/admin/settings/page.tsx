'use client';

import React, { useState } from 'react';

export default function PlatformSettingsPage() {
  const [settingsTab, setSettingsTab] = useState<'General' | 'Security' | 'API'>('General');

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Platform Settings</h2>
          <p className="text-[#9da8b9] mt-1 text-base">Configure general settings, security policies, and API access.</p>
        </div>
      </div>

      <div className="border-b border-border-dark">
        <div className="flex gap-8">
          <button
            onClick={() => setSettingsTab('General')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${settingsTab === 'General' ? 'border-primary text-white' : 'border-transparent text-[#9da8b9] hover:text-white hover:border-gray-600'}`}
          >
            General
          </button>
          <button
            onClick={() => setSettingsTab('Security')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${settingsTab === 'Security' ? 'border-primary text-white' : 'border-transparent text-[#9da8b9] hover:text-white hover:border-gray-600'}`}
          >
            Security
          </button>
          <button
            onClick={() => setSettingsTab('API')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${settingsTab === 'API' ? 'border-primary text-white' : 'border-transparent text-[#9da8b9] hover:text-white hover:border-gray-600'}`}
          >
            API
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border-dark bg-surface-darker shadow-sm">
        <div className="p-6 md:p-8">
          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white" htmlFor="site-name">Site Name</label>
              <input className="bg-[#282f39] border border-border-dark text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 placeholder-gray-500" id="site-name" placeholder="Enter site name" type="text" defaultValue="VNBuilder Platform" />
              <p className="text-[13px] text-[#9da8b9]">This is the name that will appear in the browser title bar and emails.</p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white" htmlFor="support-email">Support Email</label>
              <input className="bg-[#282f39] border border-border-dark text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 placeholder-gray-500" id="support-email" placeholder="support@example.com" type="email" defaultValue="help@vnbuilder.dev" />
              <p className="text-[13px] text-[#9da8b9]">This email address will be used for system notifications.</p>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border-dark bg-[#1c2430]/50 p-4 mt-2">
              <div className="flex flex-col gap-0.5">
                <label className="text-sm font-medium text-white" htmlFor="api-toggle">Enable Public API Access</label>
                <p className="text-[13px] text-[#9da8b9]">Allow third-party applications to interact with the platform API.</p>
              </div>
              <button aria-checked="true" className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-darker bg-primary" id="api-toggle" role="switch" type="button">
                <span className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform translate-x-5" data-state="checked"></span>
              </button>
            </div>
          </form>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#1c2027]/50 border-t border-border-dark rounded-b-xl">
          <button className="px-4 py-2 text-sm font-medium text-white bg-transparent hover:bg-[#282f39] rounded-lg transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-blue-600 rounded-lg shadow-lg shadow-blue-900/20 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
