"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/actions/authActions";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans">
      {/* Top Modern Glassmorphic Header Bar */}
      <header className="h-14 bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 px-3 sm:px-6 flex items-center justify-between shadow-xs transition-all">
        {/* Brand & Batch Info */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              K3
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-medium text-slate-900 text-sm tracking-tight group-hover:text-blue-600 transition-colors">
                  K3 Studio
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 border border-blue-100/60 hidden sm:inline-block">
                  OJT Tracker
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-normal mt-0.5 hidden md:block">
                30-Day Internship Management
              </span>
            </div>
          </Link>

          {/* Navigation Tabs */}
          <nav className="hidden sm:flex items-center gap-1 ml-4 pl-4 border-l border-slate-200">
            <Link
              href="/"
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                pathname === "/"
                  ? "bg-blue-50 text-blue-700 shadow-xs border border-blue-100"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              Live Sheet
            </Link>

            <Link
              href="/settings"
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                pathname === "/settings"
                  ? "bg-blue-50 text-blue-700 shadow-xs border border-blue-100"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              Settings
            </Link>
          </nav>
        </div>

        {/* Right Side: Admin User Badge & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin User Chip */}
          <div className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-100/80 border border-slate-200/70">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-slate-800 to-slate-600 text-white font-normal text-[10px] flex items-center justify-center shadow-xs">
              PG
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-normal text-slate-800 hidden sm:inline">Piyush Gupta</span>
              <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-blue-100/70 text-blue-800">
                Admin
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => logoutAction()}
            className="px-2.5 py-1 rounded-lg text-xs font-normal text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/70 transition-all cursor-pointer"
            title="Sign out of OJT Portal"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Full-Width Workspace */}
      <main className="flex-1 p-2.5 sm:p-4 w-full max-w-full">
        {children}
      </main>
    </div>
  );
}
