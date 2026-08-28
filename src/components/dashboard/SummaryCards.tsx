"use client";

import {
  Users,
  Clock,
  CheckCircle,
  FolderCheck,
  Award,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryStats {
  totalStudents: number;
  ojtOngoing: number;
  ojtCompleted: number;
  projectsCompleted: number;
  certificatesIssued: number;
  pendingVerification: number;
}

interface SummaryCardsProps {
  stats: SummaryStats;
}

export function SummaryCards({ stats }: SummaryCardsProps) {
  const cards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      subtitle: "Enrolled in 30-Day OJT",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-slate-200",
      change: "100% active",
    },
    {
      title: "OJT Ongoing",
      value: stats.ojtOngoing,
      subtitle: "Active in batch sprints",
      icon: Clock,
      color: "text-sky-600",
      bg: "bg-sky-50",
      border: "border-slate-200",
      change: "Day 26/30",
    },
    {
      title: "OJT Completed",
      value: stats.ojtCompleted,
      subtitle: "All modules finalized",
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-slate-200",
      change: `${Math.round((stats.ojtCompleted / (stats.totalStudents || 1)) * 100)}% done`,
    },
    {
      title: "Projects Completed",
      value: stats.projectsCompleted,
      subtitle: "Verified by Admin",
      icon: FolderCheck,
      color: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-slate-200",
      change: `${stats.projectsCompleted} ready`,
    },
    {
      title: "Certificates Issued",
      value: stats.certificatesIssued,
      subtitle: "Generated with ID",
      icon: Award,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-slate-200",
      change: "Official certs",
    },
    {
      title: "Pending Verification",
      value: stats.pendingVerification,
      subtitle: "Awaiting review",
      icon: AlertCircle,
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-slate-200",
      change: stats.pendingVerification > 0 ? "Review queue" : "Clear queue",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={cn(
              "bg-white p-4 rounded-xl border transition-all duration-200 hover:shadow-sm hover:border-blue-300",
              card.border
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{card.title}</span>
              <div className={cn("p-2 rounded-lg", card.bg, card.color)}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate">{card.subtitle}</span>
              <span className="font-semibold text-slate-600 shrink-0">{card.change}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
