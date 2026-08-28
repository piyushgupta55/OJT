"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addStudent } from "@/actions/studentActions";
import { cn } from "@/lib/utils";

export default function NewStudentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    rollNumber: "",
    division: "Division A",
    college: "Thakur Ramnarayan College of Arts and Commerce",
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
    certificateSent: false,
    codingVideosCompleted: false,
    clientCommTraining: false,
    freelancingTraining: false,
    pmTraining: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
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
    if (!formData.fullName.trim() || !formData.rollNumber.trim()) {
      setErrorMsg("Please fill Student Full Name and Roll Number.");
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
        router.push("/");
        router.refresh();
      } else {
        setErrorMsg(res.error || "Failed to create student record.");
      }
    } catch {
      setErrorMsg("An unexpected error occurred while saving student.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 px-3 sm:px-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              ← Back to Live Sheet
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Add New Student
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Enroll a student into the 30-Day OJT Internship Program
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-xs font-semibold text-white shadow-xs hover:shadow transition-all cursor-pointer"
          >
            {isSubmitting ? "Saving Student..." : "Save Student"}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Basic Student Info */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900">1. Personal Information</h2>
            <p className="text-[11px] text-slate-500">Student identity and academic background</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="e.g. Aarav Sharma"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Roll Number *
              </label>
              <input
                type="text"
                name="rollNumber"
                required
                placeholder="e.g. 2406001"
                value={formData.rollNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Division
              </label>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 h-[38px]">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, division: "Division A" })}
                  className={cn(
                    "flex-1 h-full rounded-md text-xs font-medium transition-all cursor-pointer",
                    formData.division === "Division A"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  Division A
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, division: "Division B" })}
                  className={cn(
                    "flex-1 h-full rounded-md text-xs font-medium transition-all cursor-pointer",
                    formData.division === "Division B"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  Division B
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College / Institution
              </label>
              <input
                type="text"
                name="college"
                placeholder="Thakur Ramnarayan College of Arts and Commerce"
                value={formData.college}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal"
              />
            </div>
          </div>
        </div>

        {/* 2. Capstone Project Details */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900">2. Capstone Project</h2>
            <p className="text-[11px] text-slate-500">Assigned real-world project and GitHub repository</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Title
              </label>
              <input
                type="text"
                name="projectName"
                placeholder="e.g. Smart Attendance System via RFID & Next.js"
                value={formData.projectName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GitHub Repository or Project URL
              </label>
              <input
                type="url"
                name="githubUrl"
                placeholder="https://github.com/... or https://project.com"
                value={formData.githubUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Freelancer.com Tracking */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900">3. Freelancer Sprint</h2>
            <p className="text-[11px] text-slate-500">100-Bid sprint progress and account configuration</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                100 Bids Completed?
              </label>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 h-[38px]">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, initialBids: 100 })}
                  className={cn(
                    "flex-1 h-full rounded-md text-xs font-semibold transition-all cursor-pointer",
                    formData.initialBids >= 100
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, initialBids: 0 })}
                  className={cn(
                    "flex-1 h-full rounded-md text-xs font-semibold transition-all cursor-pointer",
                    formData.initialBids < 100
                      ? "bg-white text-slate-800 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  No
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                OJT Status
              </label>
              <select
                name="ojtStatus"
                value={formData.ojtStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-blue-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="ONGOING">ONGOING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="DROPPED">DROPPED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Certificate Sent?
              </label>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 h-[38px]">
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
                  Pending (No)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 pb-6">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-xs font-semibold text-white shadow-xs hover:shadow transition-all cursor-pointer"
          >
            {isSubmitting ? "Saving Student..." : "Save & Enroll Student"}
          </button>
        </div>
      </form>
    </div>
  );
}
