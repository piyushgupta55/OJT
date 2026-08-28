import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getStatusBadgeClass(status: string): string {
  switch (status.toUpperCase()) {
    case "COMPLETED":
    case "VERIFIED":
    case "ISSUED":
    case "PRESENT":
    case "COMPLETED_100_BIDS":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20";
    case "ONGOING":
    case "IN_PROGRESS":
    case "SUBMITTED":
    case "GENERATED":
    case "LATE":
      return "bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/20";
    case "UNDER_VERIFICATION":
      return "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/20";
    case "NEEDS_CHANGES":
    case "REJECTED":
    case "ABSENT":
    case "DROPPED":
      return "bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/20";
    case "NOT_STARTED":
    case "NOT_ISSUED":
    case "PENDING":
    default:
      return "bg-slate-50 text-slate-700 border-slate-200 ring-1 ring-slate-500/10";
  }
}
