"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  updateStudentField,
  deleteStudent,
} from "@/actions/studentActions";
import { EditStudentModal } from "./EditStudentModal";
import { cn, getStatusBadgeClass } from "@/lib/utils";

export interface StudentRecord {
  id: string;
  fullName: string;
  rollNumber: string;
  division: string;
  email: string;
  phoneNumber: string;
  ojtStatus: string;
  certificateSent?: boolean;
  startDate: Date;
  endDate: Date;
  project?: {
    projectName: string;
    githubUrl?: string | null;
    status: string;
  } | null;
  freelancerTracking?: {
    bidsCompleted: number;
    planType: string;
  } | null;
  attendanceRecords: {
    id: string;
    sessionNumber: number;
    status: string;
  }[];
  documents: {
    id: string;
    type: string;
    status: string;
    documentNumber?: string | null;
  }[];
}

export function StudentSheet({ initialStudents }: { initialStudents: StudentRecord[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Edit Student Modal State
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    student: StudentRecord | null;
  }>({ isOpen: false, student: null });

  const filterOptions = [
    { label: `All Students (${initialStudents.length})`, val: "ALL" },
    { label: "Division A", val: "Division A" },
    { label: "Division B", val: "Division B" },
    { label: "100 Bids Completed", val: "100_BIDS" },
    { label: "Cert Sent ✓", val: "CERT_SENT" },
    { label: "Cert Pending", val: "CERT_PENDING" },
    { label: "Ongoing OJT", val: "ONGOING" },
    { label: "Completed OJT", val: "COMPLETED" },
  ];

  // Filter students
  const filteredStudents = useMemo(() => {
    return initialStudents.filter((s) => {
      const matchSearch =
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.project?.projectName || "").toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      if (activeFilter === "Division A") return s.division === "Division A";
      if (activeFilter === "Division B") return s.division === "Division B";
      if (activeFilter === "ONGOING") return s.ojtStatus === "ONGOING";
      if (activeFilter === "COMPLETED") return s.ojtStatus === "COMPLETED";
      if (activeFilter === "100_BIDS") return (s.freelancerTracking?.bidsCompleted || 0) >= 100;
      if (activeFilter === "CERT_SENT") return !!s.certificateSent;
      if (activeFilter === "CERT_PENDING") return !s.certificateSent;

      return true;
    });
  }, [initialStudents, searchTerm, activeFilter]);

  // Handle Inline Field Change
  const handleFieldChange = async (
    studentId: string,
    field: "fullName" | "rollNumber" | "division" | "ojtStatus" | "bids" | "projectStatus" | "projectName" | "githubUrl" | "certificateSent",
    value: string | number | boolean
  ) => {
    await updateStudentField(studentId, field, value);
  };

  // Handle Row Delete
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete ${name}?`)) {
      await deleteStudent(id);
    }
  };

  // Handle Export to CSV with current active filters and search
  const handleExportCSV = () => {
    if (!filteredStudents.length) {
      alert("No students to export with the current filter.");
      return;
    }

    const headers = [
      "Roll Number",
      "Full Name",
      "Division",
      "Project Name",
      "Project / GitHub Link",
      "Project Status",
      "Freelancer Bids (100 Target)",
      "OJT Status",
      "Certificate Sent",
    ];

    const rows = filteredStudents.map((s) => {
      const bids = s.freelancerTracking?.bidsCompleted || 0;

      return [
        `"${s.rollNumber || ""}"`,
        `"${(s.fullName || "").replace(/"/g, '""')}"`,
        `"${s.division || ""}"`,
        `"${(s.project?.projectName || "").replace(/"/g, '""')}"`,
        `"${s.project?.githubUrl || ""}"`,
        `"${s.project?.status || "IN_PROGRESS"}"`,
        bids,
        `"${s.ojtStatus || "ONGOING"}"`,
        `"${s.certificateSent ? "YES" : "NO"}"`,
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    const filterTag = activeFilter !== "ALL" ? `_${activeFilter.replace(/\s+/g, "_")}` : "";
    const dateStr = new Date().toISOString().split("T")[0];
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `K3_Studio_OJT_Students${filterTag}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-2.5">
      {/* 1. SEARCH, ADD NEW STUDENT, FILTER & EXPORT TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search student or roll no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs font-normal"
          />
        </div>

        {/* Add Student, Filter & Export Buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
          <Link
            href="/students/new"
            className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold shadow-xs hover:shadow transition-all text-center"
          >
            Add New Student
          </Link>

          {/* Filter Button with Dropdown Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all cursor-pointer",
                activeFilter !== "ALL"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
              )}
            >
              {activeFilter === "ALL" ? "Filter" : `Filter: ${activeFilter.replace("Division ", "Div ")}`}
            </button>

            {isFilterOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsFilterOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl border border-slate-200 shadow-xl p-1.5 z-30 animate-in fade-in duration-100 space-y-0.5">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Filter by
                  </div>
                  {filterOptions.map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => {
                        setActiveFilter(opt.val);
                        setIsFilterOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer",
                        activeFilter === opt.val
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-slate-700 hover:bg-slate-100"
                      )}
                    >
                      <span>{opt.label}</span>
                      {activeFilter === opt.val && <span className="text-blue-600 font-bold text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Export Filtered CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            title={`Export ${filteredStudents.length} students matching current filter`}
          >
            <span>Export CSV</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-mono">
              {filteredStudents.length}
            </span>
          </button>
        </div>
      </div>

      {/* 2. MOBILE NAME LIST (Visible only on Mobile) */}
      <div className="block md:hidden bg-white rounded-lg border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        <div className="p-2.5 bg-slate-50 border-b border-slate-200 text-[11px] font-medium text-slate-500 uppercase flex items-center justify-between">
          <span>Student Roster ({filteredStudents.length})</span>
          <span className="text-blue-600 font-normal">Tap to edit</span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No students match your filter.
          </div>
        ) : (
          filteredStudents.map((s) => {
            const bids = s.freelancerTracking?.bidsCompleted || 0;
            const is100 = bids >= 100;

            return (
              <div
                key={s.id}
                onClick={() => setEditModal({ isOpen: true, student: s })}
                className="p-3 flex items-center justify-between gap-3 active:bg-blue-50/50 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="min-w-0">
                    <p className="font-normal text-sm text-slate-800 truncate">{s.fullName}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-mono text-slate-500">{s.rollNumber}</span>
                      <span>•</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-normal">{s.division}</span>
                      {s.certificateSent && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-normal text-[10px]">
                          Cert Sent ✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn("text-[11px] font-normal px-1.5 py-0.5 rounded", is100 ? "bg-emerald-50 text-emerald-700" : "text-slate-600")}>
                    {is100 ? "100 Bids ✓" : `${bids}/100 Bids`}
                  </span>
                  <span className="text-slate-400 font-normal text-xs">Edit →</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. DESKTOP GOOGLE SHEETS LIVE DATA GRID (Visible on Tablet & Desktop) */}
      <div className="hidden md:block bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-medium uppercase text-[11px] select-none">
                <th className="py-2 px-3 w-28">Roll No</th>
                <th className="py-2 px-3">Student Name</th>
                <th className="py-2 px-3 w-24">Division</th>
                <th className="py-2 px-3">Project & Link</th>
                <th className="py-2 px-3 w-32">Project Status</th>
                <th className="py-2 px-3 w-36">Freelancer Bids (100)</th>
                <th className="py-2 px-3 w-28">OJT Status</th>
                <th className="py-2 px-3 w-28 text-center">Cert Sent</th>
                <th className="py-2 px-3 w-16 text-center">Edit</th>
                <th className="py-2 px-2 w-14 text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 text-xs">
                    <div className="space-y-1">
                      <p className="font-medium text-slate-700 text-sm">No students match your filter.</p>
                      <p className="text-slate-400">Use the <strong className="text-blue-600 font-medium">Add New Student</strong> button above to add students.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const bids = s.freelancerTracking?.bidsCompleted || 0;
                  const is100 = bids >= 100;
                  const pStatus = s.project?.status || "IN_PROGRESS";

                  return (
                    <tr key={s.id} className="hover:bg-blue-50/20 transition-colors group font-normal">
                      {/* Roll No */}
                      <td className="py-2 px-3 font-mono text-slate-700 font-normal">
                        {s.rollNumber}
                      </td>

                      {/* Student Name */}
                      <td className="py-2 px-3 text-slate-900 font-normal">
                        {s.fullName}
                      </td>

                      {/* Division Dropdown */}
                      <td className="py-1.5 px-2">
                        <select
                          value={s.division}
                          onChange={(e) => handleFieldChange(s.id, "division", e.target.value)}
                          className="w-full px-1.5 py-0.5 rounded bg-transparent hover:bg-slate-100 text-slate-700 text-xs font-normal focus:bg-white focus:outline-none cursor-pointer"
                        >
                          <option value="Division A">Div A</option>
                          <option value="Division B">Div B</option>
                        </select>
                      </td>

                      {/* Project & Link */}
                      <td className="py-2 px-3 max-w-[200px]">
                        <div className="flex items-center justify-between gap-1">
                          <span className="truncate font-normal text-slate-800" title={s.project?.projectName || "No Project"}>
                            {s.project?.projectName || "No Project"}
                          </span>
                          {s.project?.githubUrl && (
                            <a
                              href={s.project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-normal text-[11px] underline shrink-0 px-1 py-0.5 rounded hover:bg-blue-50"
                              title={s.project.githubUrl}
                            >
                              {s.project.githubUrl.includes("github.com") ? "GitHub" : "Link"}
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Project Status Dropdown */}
                      <td className="py-1.5 px-2">
                        <select
                          value={pStatus}
                          onChange={(e) => handleFieldChange(s.id, "projectStatus", e.target.value)}
                          className={cn(
                            "w-full px-1.5 py-0.5 rounded border text-[11px] font-normal focus:bg-white focus:outline-none cursor-pointer",
                            getStatusBadgeClass(pStatus)
                          )}
                        >
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="SUBMITTED">Submitted</option>
                          <option value="UNDER_VERIFICATION">Under Review</option>
                          <option value="VERIFIED">Verified</option>
                          <option value="NEEDS_CHANGES">Changes Req.</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </td>

                      {/* Freelancer Bids (1-click incrementers) */}
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-1">
                          <span className={cn("text-xs w-8 text-center shrink-0 font-normal", is100 ? "text-emerald-700 font-medium" : "text-slate-800")}>
                            {bids}
                          </span>
                          <button
                            onClick={() => handleFieldChange(s.id, "bids", Math.min(100, bids + 5))}
                            className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-normal cursor-pointer"
                            title="Add 5 bids"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => handleFieldChange(s.id, "bids", Math.min(100, bids + 10))}
                            className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-normal cursor-pointer"
                            title="Add 10 bids"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => handleFieldChange(s.id, "bids", 100)}
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-normal cursor-pointer",
                              is100 ? "bg-emerald-100 text-emerald-800" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                            )}
                            title="Set 100 bids max"
                          >
                            {is100 ? "✓ 100" : "100"}
                          </button>
                        </div>
                      </td>

                      {/* OJT Status Dropdown */}
                      <td className="py-1.5 px-2">
                        <select
                          value={s.ojtStatus}
                          onChange={(e) => handleFieldChange(s.id, "ojtStatus", e.target.value)}
                          className={cn(
                            "w-full px-1.5 py-0.5 rounded border text-[11px] font-normal focus:bg-white focus:outline-none cursor-pointer",
                            getStatusBadgeClass(s.ojtStatus)
                          )}
                        >
                          <option value="ONGOING">ONGOING</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="DROPPED">DROPPED</option>
                        </select>
                      </td>

                      {/* Certificate Sent (1-Click Switcher) */}
                      <td className="py-1.5 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleFieldChange(s.id, "certificateSent", !s.certificateSent)}
                          className={cn(
                            "px-2.5 py-1 rounded-md text-[11px] font-normal transition-all cursor-pointer w-full text-center",
                            s.certificateSent
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-medium"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          )}
                          title="Click to toggle Certificate Sent status"
                        >
                          {s.certificateSent ? "Sent ✓" : "Pending"}
                        </button>
                      </td>

                      {/* Edit Row Action */}
                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => setEditModal({ isOpen: true, student: s })}
                          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[11px] font-normal transition-colors cursor-pointer"
                          title="Edit Student Details"
                        >
                          Edit
                        </button>
                      </td>

                      {/* Delete Row */}
                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => handleDelete(s.id, s.fullName)}
                          className="px-2 py-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-[11px] font-normal transition-colors cursor-pointer"
                          title="Delete Row"
                        >
                          Del
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. EDIT STUDENT MODAL (Used for both Desktop and Mobile direct edits) */}
      <EditStudentModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, student: null })}
        student={editModal.student}
        onDelete={handleDelete}
      />
    </div>
  );
}
