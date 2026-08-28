"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Plus,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Menu,
} from "lucide-react";
import { AddStudentModal } from "../students/AddStudentModal";

interface NavbarProps {
  onToggleMobileSidebar?: () => void;
}

export function Navbar({ onToggleMobileSidebar }: NavbarProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "100 Bids Target Achieved",
      desc: "Aarav Sharma completed the 100 bids milestone on Freelancer.",
      time: "10m ago",
      type: "success",
    },
    {
      id: 2,
      title: "Project Verification Pending",
      desc: "Rohan Verma submitted collaborative whiteboard project for review.",
      time: "1h ago",
      type: "alert",
    },
  ];

  return (
    <>
      <header className="h-13 sm:h-14 bg-white border-b border-slate-200 sticky top-0 z-30 px-3 sm:px-4 flex items-center justify-between gap-2">
        {/* Left Search / Mobile Toggle */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <Link href="/" className="md:hidden font-bold text-sm text-slate-900 flex items-center gap-1 shrink-0">
            <span className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-xs">K3</span>
            <span>OJT</span>
          </Link>

          <div className="relative w-full hidden sm:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student, roll number, project..."
              className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-600 rounded-full" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-1.5 w-72 sm:w-80 bg-white rounded-xl border border-slate-200 shadow-xl p-2.5 z-50 animate-in fade-in duration-100">
                <div className="flex items-center justify-between px-2 py-1 border-b border-slate-100 mb-1.5">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700">2 New</span>
                </div>
                <div className="space-y-1.5">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2 text-left">
                      {n.type === "success" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-900 leading-tight">{n.title}</p>
                        <p className="text-[11px] text-slate-500 truncate">{n.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add Student Primary Action */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>
        </div>
      </header>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
}
