"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Plus,
  ArrowRight,
  User,
  Calendar,
  Briefcase,
  FolderGit2,
} from "lucide-react";
import { cn, getStatusBadgeClass } from "@/lib/utils";

export interface StudentRow {
  id: string;
  fullName: string;
  rollNumber: string;
  division: string;
  email: string;
  phoneNumber: string;
  avatar?: string | null;
  ojtStatus: string;
  project?: {
    projectName: string;
    status: string;
    verificationStatus: string;
  } | null;
  freelancerTracking?: {
    bidsCompleted: number;
    targetBids: number;
    taskStatus: string;
    planType: string;
  } | null;
  attendancePercentage: number;
  certificateStatus: string;
}

interface StudentTableProps {
  students: StudentRow[];
  onAddStudentClick?: () => void;
}

export function StudentTable({ students, onAddStudentClick }: StudentTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [quickFilter, setQuickFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"name" | "roll" | "bids" | "attendance">("roll");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter logic
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const searchMatch =
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.project?.projectName || "").toLowerCase().includes(searchTerm.toLowerCase());

      if (!searchMatch) return false;

      if (quickFilter === "Division A" && s.division !== "Division A") return false;
      if (quickFilter === "Division B" && s.division !== "Division B") return false;
      if (quickFilter === "ONGOING" && s.ojtStatus !== "ONGOING") return false;
      if (quickFilter === "COMPLETED" && s.ojtStatus !== "COMPLETED") return false;
      if (quickFilter === "100_BIDS" && (s.freelancerTracking?.bidsCompleted || 0) < 100) return false;
      if (quickFilter === "VERIFIED" && s.project?.status !== "VERIFIED" && s.project?.status !== "COMPLETED") return false;

      return true;
    });
  }, [students, searchTerm, quickFilter]);

  // Sorting
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let comp = 0;
      if (sortBy === "name") {
        comp = a.fullName.localeCompare(b.fullName);
      } else if (sortBy === "roll") {
        comp = a.rollNumber.localeCompare(b.rollNumber);
      } else if (sortBy === "bids") {
        comp = (a.freelancerTracking?.bidsCompleted || 0) - (b.freelancerTracking?.bidsCompleted || 0);
      } else if (sortBy === "attendance") {
        comp = a.attendancePercentage - b.attendancePercentage;
      }
      return sortOrder === "asc" ? comp : -comp;
    });
  }, [filteredStudents, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage) || 1;
  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (type: "name" | "roll" | "bids" | "attendance") => {
    if (sortBy === type) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(type);
      setSortOrder("asc");
    }
  };

  const quickFilterOptions = [
    { label: "All", value: "ALL" },
    { label: "Div A", value: "Division A" },
    { label: "Div B", value: "Division B" },
    { label: "Ongoing", value: "ONGOING" },
    { label: "100 Bids", value: "100_BIDS" },
    { label: "Verified", value: "VERIFIED" },
    { label: "Done", value: "COMPLETED" },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Mobile & Desktop Search & Filter Toolbar */}
      <div className="p-3 border-b border-slate-100 space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search student or roll no..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {onAddStudentClick && (
            <button
              onClick={onAddStudentClick}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>

        {/* Quick Filter Chips (Thumb friendly) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {quickFilterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setQuickFilter(opt.value);
                setCurrentPage(1);
              }}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer",
                quickFilter === opt.value
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. MOBILE CARD VIEW (Optimized for phones) */}
      <div className="block md:hidden divide-y divide-slate-100">
        {paginatedStudents.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No students found.
          </div>
        ) : (
          paginatedStudents.map((student) => {
            const bids = student.freelancerTracking?.bidsCompleted || 0;
            const is100 = bids >= 100;
            const pStatus = student.project?.status || "NOT_STARTED";

            return (
              <div key={student.id} className="p-3 space-y-2 hover:bg-blue-50/20 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={`/students/${student.id}`}
                      className="font-bold text-sm text-slate-900 hover:text-blue-600 truncate block"
                    >
                      {student.fullName}
                    </Link>
                    <p className="text-[11px] text-slate-400 mt-0.5">{student.division}</p>
                  </div>

                  <Link
                    href={`/students/${student.id}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold text-xs shrink-0 hover:bg-blue-100"
                  >
                    <span>Manage</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Quick Info Bar */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50/80 p-2 rounded-lg border border-slate-100 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Bids (100)</span>
                    <span className={cn("font-bold", is100 ? "text-emerald-600" : "text-slate-800")}>
                      {bids}/100 {is100 && "✓"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Attendance</span>
                    <span className="font-bold text-slate-800">{student.attendancePercentage}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Project</span>
                    <span className={cn("font-semibold truncate block", getStatusBadgeClass(pStatus))}>
                      {pStatus.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 2. DESKTOP TABLE VIEW (Visible on tablet & desktop) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[780px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
              <th className="py-2.5 px-3 cursor-pointer" onClick={() => handleSort("name")}>
                <div className="flex items-center gap-1">
                  <span>Student Name</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer" onClick={() => handleSort("roll")}>
                <div className="flex items-center gap-1">
                  <span>Roll No.</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3">Division</th>
              <th className="py-2.5 px-3">Project</th>
              <th className="py-2.5 px-3">Project Status</th>
              <th className="py-2.5 px-3 cursor-pointer" onClick={() => handleSort("bids")}>
                <div className="flex items-center gap-1">
                  <span>Bids</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer" onClick={() => handleSort("attendance")}>
                <div className="flex items-center gap-1">
                  <span>Attendance</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3">OJT Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  No students found.
                </td>
              </tr>
            ) : (
              paginatedStudents.map((student) => {
                const bids = student.freelancerTracking?.bidsCompleted || 0;
                const is100Bids = bids >= 100;
                const pStatus = student.project?.status || "NOT_STARTED";

                return (
                  <tr key={student.id} className="hover:bg-blue-50/20 transition-colors">
                    {/* Student Name */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[11px] shrink-0">
                          {student.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <Link
                            href={`/students/${student.id}`}
                            className="font-bold text-slate-900 hover:text-blue-600 transition-colors"
                          >
                            {student.fullName}
                          </Link>
                        </div>
                      </div>
                    </td>

                    {/* Roll No */}
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-700">
                      {student.rollNumber}
                    </td>

                    {/* Division */}
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {student.division}
                      </span>
                    </td>

                    {/* Project */}
                    <td className="py-2.5 px-3 max-w-[160px]">
                      <p className="font-medium text-slate-800 truncate" title={student.project?.projectName || "No project"}>
                        {student.project?.projectName || "No Project"}
                      </p>
                    </td>

                    {/* Project Status */}
                    <td className="py-2.5 px-3">
                      <span className={cn("px-1.5 py-0.5 rounded border text-[10px] font-semibold", getStatusBadgeClass(pStatus))}>
                        {pStatus.replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* Bids */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5 w-24">
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              is100Bids ? "bg-emerald-500" : "bg-blue-600"
                            )}
                            style={{ width: `${Math.min(100, bids)}%` }}
                          />
                        </div>
                        <span className={cn("font-bold text-[10px] shrink-0", is100Bids ? "text-emerald-600" : "text-slate-800")}>
                          {bids}/100
                        </span>
                      </div>
                    </td>

                    {/* Attendance */}
                    <td className="py-2.5 px-3 font-bold text-[11px]">
                      <span
                        className={cn(
                          student.attendancePercentage >= 80
                            ? "text-emerald-600"
                            : student.attendancePercentage >= 60
                            ? "text-amber-600"
                            : "text-rose-600"
                        )}
                      >
                        {student.attendancePercentage}%
                      </span>
                    </td>

                    {/* OJT Status */}
                    <td className="py-2.5 px-3">
                      <span className={cn("px-1.5 py-0.5 rounded border text-[10px] font-bold", getStatusBadgeClass(student.ojtStatus))}>
                        {student.ojtStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right">
                      <Link
                        href={`/students/${student.id}`}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors"
                      >
                        <span>Manage</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-2.5 sm:p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="text-[11px]">
          {sortedStudents.length} students
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded border border-slate-200 disabled:opacity-30"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] px-1 font-semibold">{currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded border border-slate-200 disabled:opacity-30"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
