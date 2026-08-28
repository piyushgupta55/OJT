"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addStudent } from "@/actions/studentActions";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddStudentModal({ isOpen, onClose }: AddStudentModalProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"personal" | "internship" | "freelance" | "project" | "ojt">("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    rollNumber: "",
    division: "Division A",
    college: "",
    branch: "Computer Science & Engineering",
    email: "",
    phoneNumber: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    durationDays: 30,
    ojtStatus: "ONGOING",
    freelancerProfileUrl: "",
    freelancerAccountCreated: true,
    freelancerPlan: "FREE",
    initialBids: 0,
    projectName: "",
    projectDescription: "",
    technologyUsed: "Next.js, TypeScript, Tailwind CSS",
    githubUrl: "",
    liveDemoUrl: "",
    codingVideosCompleted: false,
    clientCommTraining: false,
    freelancingTraining: false,
    pmTraining: false,
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.rollNumber) {
      setErrorMsg("Please fill Full Name and Roll Number.");
      setActiveSection("personal");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await addStudent({
        ...formData,
        durationDays: Number(formData.durationDays),
        initialBids: Number(formData.initialBids),
      });

      if (res.success) {
        onClose();
        router.refresh();
        if (res.studentId) {
          router.push(`/students/${res.studentId}`);
        }
      } else {
        setErrorMsg(res.error || "Failed to create student");
      }
    } catch {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = [
    { id: "personal", label: "1. Personal" },
    { id: "internship", label: "2. Dates" },
    { id: "freelance", label: "3. Bids" },
    { id: "project", label: "4. Project" },
    { id: "ojt", label: "5. Checklist" },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Enroll New Student</h2>
            <p className="text-[11px] text-slate-500">Add student to OJT roster</p>
          </div>
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-lg text-slate-500 hover:text-slate-800 bg-slate-100 font-bold text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Horizontal Steps Bar */}
        <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 border-b border-slate-200 overflow-x-auto no-scrollbar">
          {sections.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`px-3 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                {sec.label}
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {activeSection === "personal" && (
            <div className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Roll Number *</label>
                  <input
                    type="text"
                    name="rollNumber"
                    required
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="e.g. 21CS09"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Division</label>
                  <select
                    name="division"
                    value={formData.division}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  >
                    <option value="Division A">Division A</option>
                    <option value="Division B">Division B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Email (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@example.com"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Phone</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">College</label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="Engineering College"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "internship" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>
            </div>
          )}

          {activeSection === "freelance" && (
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Freelancer Profile URL</label>
                <input
                  type="url"
                  name="freelancerProfileUrl"
                  value={formData.freelancerProfileUrl}
                  onChange={handleChange}
                  placeholder="https://www.freelancer.com/u/..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Plan</label>
                  <select
                    name="freelancerPlan"
                    value={formData.freelancerPlan}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  >
                    <option value="FREE">Free</option>
                    <option value="PREMIUM">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Initial Bids (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    name="initialBids"
                    value={formData.initialBids}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "project" && (
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Project Name</label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="e.g. AI Resume Screener"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">GitHub URL</label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>
            </div>
          )}

          {activeSection === "ojt" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  name="codingVideosCompleted"
                  checked={formData.codingVideosCompleted}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 text-blue-600 rounded"
                />
                <span>Coding Videos Done</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  name="clientCommTraining"
                  checked={formData.clientCommTraining}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 text-blue-600 rounded"
                />
                <span>Client Communication</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  name="freelancingTraining"
                  checked={formData.freelancingTraining}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 text-blue-600 rounded"
                />
                <span>Freelancing Sprint</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  name="pmTraining"
                  checked={formData.pmTraining}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 text-blue-600 rounded"
                />
                <span>Project Management</span>
              </label>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600"
          >
            Cancel
          </button>

          <div className="flex items-center gap-1.5">
            {activeSection !== "personal" && (
              <button
                type="button"
                onClick={() => {
                  const idx = sections.findIndex((s) => s.id === activeSection);
                  if (idx > 0) setActiveSection(sections[idx - 1].id);
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700"
              >
                Back
              </button>
            )}

            {activeSection !== "ojt" ? (
              <button
                type="button"
                onClick={() => {
                  const idx = sections.findIndex((s) => s.id === activeSection);
                  if (idx < sections.length - 1) setActiveSection(sections[idx + 1].id);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Saving..." : "Save Student"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
