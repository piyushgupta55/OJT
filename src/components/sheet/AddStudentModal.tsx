"use client";

import { useState } from "react";
import { quickAddStudent } from "@/actions/studentActions";
import { cn } from "@/lib/utils";
import type { StudentRecord } from "./StudentSheet";
import { UserPlus, X, Loader2 } from "lucide-react";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newStudent: StudentRecord) => void;
}

export function AddStudentModal({ isOpen, onClose, onAdd }: AddStudentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    rollNumber: "",
    division: "Division A",
    projectName: "Full-Stack Web App",
    githubUrl: "",
    bidsCompleted: 0,
    ojtStatus: "ONGOING",
    certificateSent: false,
    phoneNumber: "+91 98765 00000",
    college: "Thakur Ramnarayan College of Arts and Commerce",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = formData.fullName.trim();
    const roll = formData.rollNumber.trim();

    if (!name || !roll) {
      setErrorMsg("Student Full Name and Roll Number are required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await quickAddStudent({
        fullName: name,
        rollNumber: roll,
        division: formData.division,
        projectName: formData.projectName.trim() || "Full-Stack Web App",
        githubUrl: formData.githubUrl.trim() || undefined,
        bidsCompleted: Number(formData.bidsCompleted || 0),
        phoneNumber: formData.phoneNumber,
        college: formData.college,
        ojtStatus: formData.ojtStatus,
        certificateSent: formData.certificateSent,
      });

      if (res.success && res.studentId) {
        // Optimistically add to UI table
        const newRecord: StudentRecord = {
          id: res.studentId,
          fullName: name,
          rollNumber: roll,
          division: formData.division,
          email: `${roll.toLowerCase()}@student.k3studio.com`,
          phoneNumber: formData.phoneNumber,
          ojtStatus: formData.ojtStatus,
          certificateSent: formData.certificateSent,
          startDate: new Date("2026-08-01"),
          endDate: new Date("2026-08-30"),
          project: {
            projectName: formData.projectName.trim() || "Full-Stack Web App",
            githubUrl: formData.githubUrl.trim() || null,
            status: "IN_PROGRESS",
          },
          freelancerTracking: {
            bidsCompleted: Number(formData.bidsCompleted || 0),
            planType: "FREE",
          },
          attendanceRecords: [],
          documents: [],
        };

        onAdd(newRecord);
        onClose();
        // Reset form
        setFormData({
          fullName: "",
          rollNumber: "",
          division: "Division A",
          projectName: "Full-Stack Web App",
          githubUrl: "",
          bidsCompleted: 0,
          ojtStatus: "ONGOING",
          certificateSent: false,
          phoneNumber: "+91 98765 00000",
          college: "Thakur Ramnarayan College of Arts and Commerce",
        });
      } else {
        setErrorMsg(res.error || "Failed to add student.");
      }
    } catch {
      setErrorMsg("An unexpected error occurred while adding student.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Mobile Drag Indicator */}
        <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto mt-2.5 sm:hidden" />

        {/* Header */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Add New Student</h2>
              <p className="text-[11px] text-slate-500">Add student to live OJT roster</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto text-xs">
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Student Name */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Student Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Roll Number & Division */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Roll Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 2406150"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Division
              </label>
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

          {/* Project Title & GitHub URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Assigned Project Title
              </label>
              <input
                type="text"
                placeholder="e.g. Full-Stack Web App"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                GitHub Repository / Link
              </label>
              <input
                type="text"
                placeholder="https://github.com/..."
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Initial Freelancer Bids & OJT Status & Certificate */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Freelancer Bids (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="1000"
                value={formData.bidsCompleted}
                onChange={(e) => setFormData({ ...formData, bidsCompleted: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                OJT Status
              </label>
              <select
                value={formData.ojtStatus}
                onChange={(e) => setFormData({ ...formData, ojtStatus: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="ONGOING">ONGOING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="DROPPED">DROPPED</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Certificate Sent?
              </label>
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
                  Yes
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
                  No
                </button>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Student</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
