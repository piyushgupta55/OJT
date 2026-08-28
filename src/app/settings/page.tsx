"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  ShieldCheck,
  Building,
  Mail,
  Award,
  Database,
  Save,
  CheckCircle2,
  Download,
} from "lucide-react";

export default function SettingsPage() {
  const [isSaved, setIsSaved] = useState(false);
  const [settings, setSettings] = useState({
    adminName: "Piyush Gupta",
    title: "Founder & Technical Director",
    organization: "K3 Studio",
    email: "admin@k3studio.com",
    programName: "30-Day On-the-Job Training (OJT) Program",
    durationDays: 30,
    targetBids: 100,
    certificateSignatory: "Piyush Gupta",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleExportCSV = () => {
    window.open("/", "_self");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Student Sheet</span>
        </Link>

        {isSaved && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Settings Saved</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-3">
        {/* 1. Admin Profile Card */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <User className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Admin Profile & Certificate Authority</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-0.5">Admin Full Name</label>
              <input
                type="text"
                value={settings.adminName}
                onChange={(e) => setSettings({ ...settings, adminName: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-0.5">Designation / Role</label>
              <input
                type="text"
                value={settings.title}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-0.5">Organization / Studio</label>
              <input
                type="text"
                value={settings.organization}
                onChange={(e) => setSettings({ ...settings, organization: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-0.5">Official Admin Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* 2. OJT Program Rules */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <Award className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">OJT Program Parameters</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-0.5">Program Title</label>
              <input
                type="text"
                value={settings.programName}
                onChange={(e) => setSettings({ ...settings, programName: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-0.5">Freelancer Bid Target</label>
              <input
                type="number"
                value={settings.targetBids}
                onChange={(e) => setSettings({ ...settings, targetBids: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 font-bold"
              />
            </div>
          </div>
        </div>

        {/* 3. Database & Supabase Info */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Database className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Storage & Cloud Sync</h2>
          </div>

          <div className="text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
              <span className="font-medium">Supabase Project:</span>
              <span className="font-mono text-blue-700 font-semibold truncate max-w-[200px] sm:max-w-xs">
                https://ybtzhckuxccgchfrcezq.supabase.co
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
              <span className="font-medium">Database Status:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active & Synced
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
