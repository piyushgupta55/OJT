"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Settings,
  Sparkles,
  Award,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Students", href: "/", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 min-h-screen select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-300" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 tracking-tight text-sm">K3 Studio</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700">OJT</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Student Manager</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-2 pb-2">
          <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Navigation</p>
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" || pathname.startsWith("/students") : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group",
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-500" />}
            </Link>
          );
        })}

        {/* Live Cohort Status Card */}
        <div className="mt-6 mx-1 p-3 rounded-xl bg-blue-600 text-white shadow-xs">
          <div className="flex items-center gap-1.5 mb-1">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100">Live Cohort</span>
          </div>
          <p className="text-xs font-bold text-white">August 2026 Batch</p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-blue-100">
            <span>30-Day Program</span>
            <span className="font-bold text-white">Day 26</span>
          </div>
          <div className="w-full bg-blue-950/30 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-amber-300 h-full rounded-full w-[86%]" />
          </div>
        </div>
      </div>

      {/* Admin Profile Section */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-[11px]">
            PG
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">Piyush Gupta</p>
            <p className="text-[10px] text-slate-500 font-medium truncate">Admin • K3 Studio</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
