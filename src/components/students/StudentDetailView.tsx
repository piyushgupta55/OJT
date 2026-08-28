"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Calendar,
  Briefcase,
  FolderGit2,
  FileCheck,
  FileText,
  History,
  LayoutDashboard,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  Award,
  Plus,
  Check,
  X,
  Printer,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  updateFreelancerBids,
  updateProjectStatus,
  addAttendanceSession,
  addAssignmentRecord,
  generateStudentDocument,
  updateStudentDetails,
} from "@/actions/studentActions";
import { cn, formatDate, formatDateTime, getStatusBadgeClass } from "@/lib/utils";
import { DocumentPreviewModal } from "../documents/DocumentPreviewModal";

interface StudentDetailProps {
  student: {
    id: string;
    fullName: string;
    rollNumber: string;
    division: string;
    college: string;
    branch: string;
    email: string;
    phoneNumber: string;
    avatar?: string | null;
    startDate: Date;
    endDate: Date;
    durationDays: number;
    ojtStatus: string;
    codingVideosCompleted: boolean;
    clientCommunicationTraining: boolean;
    freelancingTraining: boolean;
    projectManagementTraining: boolean;
    finalProjectStatus: string;
    freelancerTracking?: {
      id: string;
      profileUrl?: string | null;
      accountCreated: boolean;
      planType: string;
      bidsCompleted: number;
      targetBids: number;
      taskStatus: string;
    } | null;
    project?: {
      id: string;
      projectName: string;
      description?: string | null;
      sourcePlaylist?: string | null;
      technologyUsed: string;
      status: string;
      githubUrl?: string | null;
      liveDemoUrl?: string | null;
      projectSubmittedDate?: Date | null;
      verificationStatus: string;
      verificationRemarks?: string | null;
      verifiedAt?: Date | null;
      verifiedBy?: string | null;
    } | null;
    attendanceRecords: {
      id: string;
      sessionNumber: number;
      date: Date;
      topic: string;
      status: string;
      remarks?: string | null;
    }[];
    assignments: {
      id: string;
      name: string;
      description?: string | null;
      dueDate: Date;
      submittedDate?: Date | null;
      submissionLink?: string | null;
      status: string;
      verificationStatus: string;
      remarks?: string | null;
    }[];
    documents: {
      id: string;
      type: string;
      title: string;
      status: string;
      issuedDate?: Date | null;
      documentNumber?: string | null;
      remarks?: string | null;
    }[];
    activityLogs: {
      id: string;
      action: string;
      adminName: string;
      description: string;
      createdAt: Date;
    }[];
  };
}

export function StudentDetailView({ student }: StudentDetailProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "freelancing" | "project" | "attendance" | "documents" | "personal" | "assignments" | "activity"
  >("overview");

  // Document modal state
  const [activeDocModal, setActiveDocModal] = useState<{
    isOpen: boolean;
    type: "OFFER_LETTER" | "INTERNSHIP_CERTIFICATE" | "COMPLETION_LETTER" | "OJT_DOCUMENTS";
  }>({ isOpen: false, type: "INTERNSHIP_CERTIFICATE" });

  // Freelancer Bids State
  const [bidsInput, setBidsInput] = useState(student.freelancerTracking?.bidsCompleted || 0);
  const [isUpdatingBids, setIsUpdatingBids] = useState(false);

  // Project Verification State
  const [projectRemarks, setProjectRemarks] = useState(student.project?.verificationRemarks || "");
  const [isUpdatingProject, setIsUpdatingProject] = useState(false);

  // Attendance Form State
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [newAttendance, setNewAttendance] = useState({
    sessionNumber: student.attendanceRecords.length + 1,
    date: new Date().toISOString().split("T")[0],
    topic: `Session ${student.attendanceRecords.length + 1}: Practical Workshop`,
    status: "PRESENT",
    remarks: "",
  });

  // Assignment Modal State
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    name: "",
    description: "",
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    submissionLink: "",
    status: "PENDING",
    remarks: "",
  });

  // Personal Info Edit State
  const [personalForm, setPersonalForm] = useState({
    fullName: student.fullName,
    division: student.division,
    college: student.college,
    branch: student.branch,
    email: student.email,
    phoneNumber: student.phoneNumber,
    ojtStatus: student.ojtStatus,
    codingVideosCompleted: student.codingVideosCompleted,
    clientCommunicationTraining: student.clientCommunicationTraining,
    freelancingTraining: student.freelancingTraining,
    projectManagementTraining: student.projectManagementTraining,
  });
  const [isSavingPersonal, setIsSavingPersonal] = useState(false);

  // Calculate Attendance Stats
  const totalSessions = student.attendanceRecords.length;
  const presentCount = student.attendanceRecords.filter((r) => r.status === "PRESENT" || r.status === "LATE").length;
  const absentCount = student.attendanceRecords.filter((r) => r.status === "ABSENT").length;
  const attendancePercentage = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 100;

  // Composite Score
  const bidsScore = Math.min(100, student.freelancerTracking?.bidsCompleted || 0);
  const projectScore = student.project?.status === "VERIFIED" || student.project?.status === "COMPLETED" ? 100 : student.project?.status === "UNDER_VERIFICATION" ? 60 : 30;
  const overallProgress = Math.round((attendancePercentage * 0.35) + (bidsScore * 0.35) + (projectScore * 0.30));

  // Handle Bid Update
  const handleUpdateBids = async (targetCount: number) => {
    setIsUpdatingBids(true);
    try {
      const res = await updateFreelancerBids(student.id, targetCount);
      if (res.success) {
        setBidsInput(targetCount);
        if (targetCount >= 100) {
          confetti({
            particleCount: 100,
            spread: 60,
            origin: { y: 0.6 },
          });
        }
        router.refresh();
      }
    } finally {
      setIsUpdatingBids(false);
    }
  };

  // Handle Project Status
  const handleProjectStatusChange = async (status: string) => {
    setIsUpdatingProject(true);
    try {
      await updateProjectStatus(student.id, {
        status,
        verificationRemarks: projectRemarks,
      });
      if (status === "VERIFIED" || status === "COMPLETED") {
        confetti({
          particleCount: 80,
          spread: 50,
          origin: { y: 0.5 },
        });
      }
      router.refresh();
    } finally {
      setIsUpdatingProject(false);
    }
  };

  // Handle Attendance Save
  const handleSaveAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAttendanceSession(student.id, newAttendance);
    setIsAttendanceModalOpen(false);
    router.refresh();
  };

  // Handle Assignment Save
  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAssignmentRecord(student.id, newAssignment);
    setIsAssignmentModalOpen(false);
    router.refresh();
  };

  // Handle Personal Info Save
  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPersonal(true);
    try {
      await updateStudentDetails(student.id, personalForm);
      router.refresh();
    } finally {
      setIsSavingPersonal(false);
    }
  };

  // Handle Document Generation
  const handleGenerateDoc = async (type: string) => {
    await generateStudentDocument(student.id, type);
    setActiveDocModal({
      isOpen: true,
      type: type as any,
    });
    router.refresh();
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "freelancing", label: "Bids (100)", icon: Briefcase },
    { id: "project", label: "Project", icon: FolderGit2 },
    { id: "attendance", label: "Attendance", icon: Calendar },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "personal", label: "Profile", icon: User },
    { id: "assignments", label: "Assignments", icon: FileCheck },
    { id: "activity", label: "Logs", icon: History },
  ] as const;

  return (
    <div className="space-y-3">
      {/* Compact Top Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              href="/"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 shrink-0"
              aria-label="Back to students list"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">{student.fullName}</h1>
                <span className="text-[11px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                  {student.rollNumber}
                </span>
                <span className={cn("px-2 py-0.2 rounded text-[10px] font-bold border", getStatusBadgeClass(student.ojtStatus))}>
                  {student.ojtStatus}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {student.division} • {student.branch} • {student.college}
              </p>
            </div>
          </div>

          {/* Quick 1-Tap Actions */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            <button
              onClick={() => handleGenerateDoc("INTERNSHIP_CERTIFICATE")}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Certificate</span>
            </button>
            <button
              onClick={() => handleGenerateDoc("OFFER_LETTER")}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Offer Letter</span>
            </button>
          </div>
        </div>

        {/* Scrollable Tab Navigation */}
        <div className="flex items-center gap-1 border-t border-slate-100 pt-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer",
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB: OVERVIEW */}
      {/* ============================================================ */}
      {activeTab === "overview" && (
        <div className="space-y-3">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Overall Progress</span>
              <span className="text-lg font-bold text-blue-700">{overallProgress}%</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Freelancer Bids</span>
              <span className="text-lg font-bold text-slate-900">{student.freelancerTracking?.bidsCompleted || 0}/100</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Attendance Rate</span>
              <span className="text-lg font-bold text-emerald-600">{attendancePercentage}%</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Project Status</span>
              <span className="text-xs font-bold text-slate-800 truncate block mt-1">
                {student.project?.status || "NOT_STARTED"}
              </span>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Quick Bids Updater Card */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Freelancer Bids Sprint</span>
                <span className="text-xs font-bold text-blue-700">{bidsInput}/100</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full", bidsInput >= 100 ? "bg-emerald-500" : "bg-blue-600")}
                  style={{ width: `${Math.min(100, bidsInput)}%` }}
                />
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                {[+1, +5, +10, +25].map((inc) => (
                  <button
                    key={inc}
                    disabled={isUpdatingBids}
                    onClick={() => handleUpdateBids(Math.min(100, bidsInput + inc))}
                    className="flex-1 py-1 rounded bg-slate-50 border border-slate-200 text-xs font-bold hover:bg-slate-100"
                  >
                    +{inc}
                  </button>
                ))}
                <button
                  disabled={isUpdatingBids}
                  onClick={() => handleUpdateBids(100)}
                  className="px-2.5 py-1 rounded bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shrink-0"
                >
                  100 Max
                </button>
              </div>
            </div>

            {/* Project Quick View */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Capstone Project</span>
                <span className={cn("px-1.5 py-0.2 rounded border text-[10px] font-bold", getStatusBadgeClass(student.project?.status || "NOT_STARTED"))}>
                  {student.project?.status || "NOT_STARTED"}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 truncate">{student.project?.projectName || "No project"}</p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setActiveTab("project")}
                  className="flex-1 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold text-center hover:bg-blue-700"
                >
                  Verify / Review
                </button>
                {student.project?.githubUrl && (
                  <a
                    href={student.project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 shrink-0"
                  >
                    <GitBranch className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB: FREELANCING */}
      {/* ============================================================ */}
      {activeTab === "freelancing" && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Freelancer Bids Counter</h2>
              <p className="text-[11px] text-slate-500">Plan: {student.freelancerTracking?.planType || "FREE"}</p>
            </div>
            <span className="text-lg font-bold text-blue-700">{bidsInput} / 100</span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", bidsInput >= 100 ? "bg-emerald-500" : "bg-blue-600")}
              style={{ width: `${Math.min(100, bidsInput)}%` }}
            />
          </div>

          {/* Large Mobile Touch Targets */}
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {[+1, +5, +10, +25].map((inc) => (
              <button
                key={inc}
                disabled={isUpdatingBids}
                onClick={() => handleUpdateBids(Math.min(100, bidsInput + inc))}
                className="py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold hover:bg-slate-100"
              >
                +{inc}
              </button>
            ))}
            <button
              disabled={isUpdatingBids}
              onClick={() => handleUpdateBids(100)}
              className="py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
            >
              100 Max
            </button>
          </div>

          {student.freelancerTracking?.profileUrl && (
            <a
              href={student.freelancerTracking.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline pt-1"
            >
              <span>Open Freelancer.com Profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB: PROJECT */}
      {/* ============================================================ */}
      {activeTab === "project" && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Project Verification</h2>
            <span className={cn("px-2 py-0.5 rounded text-xs font-bold border", getStatusBadgeClass(student.project?.status || "NOT_STARTED"))}>
              {student.project?.status || "NOT_STARTED"}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
            <p className="font-bold text-slate-900">{student.project?.projectName || "No Project"}</p>
            <p className="text-slate-600 text-[11px]">{student.project?.description || "No description."}</p>
            <p className="text-slate-500 text-[11px]"><strong className="text-slate-700">Tech:</strong> {student.project?.technologyUsed || "Next.js"}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Verification Remarks</label>
            <textarea
              rows={2}
              value={projectRemarks}
              onChange={(e) => setProjectRemarks(e.target.value)}
              placeholder="Enter review feedback..."
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* 1-Tap Action Row */}
          <div className="flex items-center gap-2 pt-1">
            <button
              disabled={isUpdatingProject}
              onClick={() => handleProjectStatusChange("NEEDS_CHANGES")}
              className="flex-1 py-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100"
            >
              Changes Needed
            </button>
            <button
              disabled={isUpdatingProject}
              onClick={() => handleProjectStatusChange("VERIFIED")}
              className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
            >
              Verify Project
            </button>
            <button
              disabled={isUpdatingProject}
              onClick={() => handleProjectStatusChange("COMPLETED")}
              className="flex-1 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
            >
              Complete
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB: ATTENDANCE */}
      {/* ============================================================ */}
      {activeTab === "attendance" && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Attendance Log</h2>
              <p className="text-[11px] text-slate-500">{presentCount} Present / {totalSessions} Total ({attendancePercentage}%)</p>
            </div>
            <button
              onClick={() => setIsAttendanceModalOpen(true)}
              className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
            >
              + Log Session
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {student.attendanceRecords.map((rec) => (
              <div key={rec.id} className="py-2 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-900">Session #{rec.sessionNumber}</span>
                  <span className="text-[11px] text-slate-400 block">{rec.topic} • {formatDate(rec.date)}</span>
                </div>
                <span className={cn("px-1.5 py-0.2 rounded border text-[10px] font-bold", getStatusBadgeClass(rec.status))}>
                  {rec.status}
                </span>
              </div>
            ))}
          </div>

          {/* Add Attendance Session Modal */}
          {isAttendanceModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <div className="bg-white w-full max-w-sm rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-900">Log Attendance Session</h3>
                  <button onClick={() => setIsAttendanceModalOpen(false)} className="text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleSaveAttendance} className="space-y-2.5 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-0.5">Session #</label>
                    <input
                      type="number"
                      value={newAttendance.sessionNumber}
                      onChange={(e) => setNewAttendance({ ...newAttendance, sessionNumber: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Status</label>
                    <select
                      value={newAttendance.status}
                      onChange={(e) => setNewAttendance({ ...newAttendance, status: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-200"
                    >
                      <option value="PRESENT">Present</option>
                      <option value="LATE">Late</option>
                      <option value="ABSENT">Absent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Topic</label>
                    <input
                      type="text"
                      value={newAttendance.topic}
                      onChange={(e) => setNewAttendance({ ...newAttendance, topic: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-200"
                    />
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button type="button" onClick={() => setIsAttendanceModalOpen(false)} className="px-3 py-1 rounded border">
                      Cancel
                    </button>
                    <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white font-semibold">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB: DOCUMENTS */}
      {/* ============================================================ */}
      {activeTab === "documents" && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Official Documents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { type: "OFFER_LETTER", label: "Offer Letter" },
              { type: "INTERNSHIP_CERTIFICATE", label: "Internship Certificate" },
              { type: "COMPLETION_LETTER", label: "Completion Letter" },
              { type: "OJT_DOCUMENTS", label: "OJT Dossier" },
            ].map((item) => {
              const doc = student.documents.find((d) => d.type === item.type);
              const isIssued = doc?.status === "ISSUED";

              return (
                <div key={item.type} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{item.label}</p>
                    <span className={cn("text-[10px] font-bold px-1 py-0.2 rounded", getStatusBadgeClass(doc?.status || "NOT_ISSUED"))}>
                      {doc?.status || "NOT_ISSUED"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleGenerateDoc(item.type)}
                      className="px-2 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                    >
                      Gen
                    </button>
                    {isIssued && (
                      <button
                        onClick={() => setActiveDocModal({ isOpen: true, type: item.type as any })}
                        className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                      >
                        Print
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB: PROFILE */}
      {/* ============================================================ */}
      {activeTab === "personal" && (
        <form onSubmit={handleSavePersonal} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900">Edit Profile</h2>
            <button type="submit" disabled={isSavingPersonal} className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold">
              Save
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div>
              <label className="block text-slate-600 mb-0.5">Full Name</label>
              <input
                type="text"
                value={personalForm.fullName}
                onChange={(e) => setPersonalForm({ ...personalForm, fullName: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-0.5">Division</label>
              <select
                value={personalForm.division}
                onChange={(e) => setPersonalForm({ ...personalForm, division: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded border border-slate-200"
              >
                <option value="Division A">Division A</option>
                <option value="Division B">Division B</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 mb-0.5">Email</label>
              <input
                type="email"
                value={personalForm.email}
                onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-0.5">Phone</label>
              <input
                type="text"
                value={personalForm.phoneNumber}
                onChange={(e) => setPersonalForm({ ...personalForm, phoneNumber: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded border border-slate-200"
              />
            </div>
          </div>
        </form>
      )}

      {/* ============================================================ */}
      {/* TAB: LOGS */}
      {/* ============================================================ */}
      {activeTab === "activity" && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
          <h2 className="text-sm font-bold text-slate-900">Activity History</h2>
          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {student.activityLogs.map((log) => (
              <div key={log.id} className="py-2 text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>{log.adminName}</span>
                  <span>{formatDateTime(log.createdAt)}</span>
                </div>
                <p className="text-slate-800 mt-0.5">{log.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Printable Document Modal */}
      <DocumentPreviewModal
        isOpen={activeDocModal.isOpen}
        onClose={() => setActiveDocModal({ ...activeDocModal, isOpen: false })}
        documentType={activeDocModal.type}
        student={{
          fullName: student.fullName,
          rollNumber: student.rollNumber,
          division: student.division,
          college: student.college,
          branch: student.branch,
          startDate: student.startDate,
          endDate: student.endDate,
          projectName: student.project?.projectName,
          documentNumber: student.documents.find((d) => d.type === activeDocModal.type)?.documentNumber,
        }}
      />
    </div>
  );
}
