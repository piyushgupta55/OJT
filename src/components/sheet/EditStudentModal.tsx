"use client";

import { useState, useEffect } from "react";
import { editStudentFull } from "@/actions/studentActions";
import { cn } from "@/lib/utils";
import type { StudentRecord } from "./StudentSheet";

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRecord | null;
  onDelete?: (id: string, name: string) => void;
}

export function EditStudentModal({ isOpen, onClose, student, onDelete }: EditStudentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    rollNumber: "",
    division: "Division A",
    projectName: "",
    githubUrl: "",
    projectStatus: "IN_PROGRESS",
    bidsCompleted: 0,
    ojtStatus: "ONGOING",
    certificateSent: false,
  });

  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.fullName || "",
        rollNumber: student.rollNumber || "",
        division: student.division || "Division A",
        projectName: student.project?.projectName || "",
        githubUrl: student.project?.githubUrl || "",
        projectStatus: student.project?.status || "IN_PROGRESS",
        bidsCompleted: student.freelancerTracking?.bidsCompleted || 0,
        ojtStatus: student.ojtStatus || "ONGOING",
        certificateSent: student.certificateSent || false,
      });
      setErrorMsg("");
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.rollNumber.trim()) {
      setErrorMsg("Student Name and Roll Number are required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await editStudentFull(student.id, {
        ...formData,
        bidsCompleted: Number(formData.bidsCompleted),
      });

      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.error || "Failed to update student details");
      }
    } catch {
      setErrorMsg("An unexpected error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (onDelete && student) {
      onDelete(student.id, student.fullName);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Mobile Top Drag Indicator */}
        <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto mt-2.5 sm:hidden" />

        {/* Modal Header */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Edit Student Details</h2>
            <p className="text-[11px] text-slate-500">Update profile, project, and OJT status</p>
          </div>
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-800 bg-slate-100 font-bold text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Student Name */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Student Full Name *</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Roll Number & Division */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Roll Number *</label>
              <input
                type="text"
                required
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Division</label>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 h-[36px]">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, division: "Division A" })}
                  className={cn(
                    "flex-1 h-full rounded-md text-xs font-semibold transition-all cursor-pointer",
                    formData.division === "Division A"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  Div A
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, division: "Division B" })}
                  className={cn(
                    "flex-1 h-full rounded-md text-xs font-semibold transition-all cursor-pointer",
                    formData.division === "Division B"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  Div B
                </button>
              </div>
            </div>
          </div>

          {/* Capstone Project Details */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">Capstone Project</span>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Project Name</label>
              <input
                type="text"
                placeholder="e.g. Smart RFID Attendance"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">GitHub or Project URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/... or https://project.com"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Project Status</label>
                <select
                  value={formData.projectStatus}
                  onChange={(e) => setFormData({ ...formData, projectStatus: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="UNDER_VERIFICATION">Under Review</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="NEEDS_CHANGES">Changes Requested</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Freelancer Bids & OJT Status */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">100 Bids Completed?</label>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 h-[36px]">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, bidsCompleted: 100 })}
                  className={cn(
                    "flex-1 h-full rounded-md text-xs font-semibold transition-all cursor-pointer",
                    Number(formData.bidsCompleted) >= 100
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, bidsCompleted: 0 })}
                  className={cn(
                    "flex-1 h-full rounded-md text-xs font-semibold transition-all cursor-pointer",
                    Number(formData.bidsCompleted) < 100
                      ? "bg-white text-slate-800 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  No
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">OJT Status</label>
              <select
                value={formData.ojtStatus}
                onChange={(e) => setFormData({ ...formData, ojtStatus: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-blue-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="ONGOING">ONGOING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="DROPPED">DROPPED</option>
              </select>
            </div>
          </div>

          {/* Certificate Sent Option */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Certificate Sent?</label>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 h-[36px]">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, certificateSent: true })}
                className={cn(
                  "flex-1 h-full rounded-md text-xs font-semibold transition-all cursor-pointer",
                  formData.certificateSent
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                Sent (Yes)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, certificateSent: false })}
                className={cn(
                  "flex-1 h-full rounded-md text-xs font-semibold transition-all cursor-pointer",
                  !formData.certificateSent
                    ? "bg-white text-slate-800 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                Not Sent (Pending)
              </button>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
            {onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors cursor-pointer"
              >
                Delete Student
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-semibold text-xs shadow-xs hover:shadow transition-all cursor-pointer"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
