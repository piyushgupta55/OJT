"use client";

import { useRef } from "react";
import {
  X,
  Printer,
  Award,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: "OFFER_LETTER" | "INTERNSHIP_CERTIFICATE" | "COMPLETION_LETTER" | "OJT_DOCUMENTS";
  student: {
    fullName: string;
    rollNumber: string;
    division: string;
    college: string;
    branch: string;
    startDate: Date | string;
    endDate: Date | string;
    projectName?: string | null;
    documentNumber?: string | null;
  };
}

export function DocumentPreviewModal({ isOpen, onClose, documentType, student }: DocumentModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const docNumber = student.documentNumber || `K3-${documentType.slice(0, 4)}-2026-${student.rollNumber}`;
  const issueDate = formatDate(new Date());
  const startDateStr = formatDate(student.startDate);
  const endDateStr = formatDate(student.endDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[95vh] overflow-hidden">
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {documentType === "INTERNSHIP_CERTIFICATE" && "Internship Completion Certificate"}
                {documentType === "OFFER_LETTER" && "Official OJT Internship Offer Letter"}
                {documentType === "COMPLETION_LETTER" && "Letter of Recommendation & OJT Completion"}
                {documentType === "OJT_DOCUMENTS" && "OJT 30-Day Training Dossier"}
              </h3>
              <p className="text-[11px] text-slate-500">Document ID: <span className="font-mono font-semibold text-blue-700">{docNumber}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/60 flex justify-center">
          {/* A4 Document Card */}
          <div
            ref={printRef}
            className="printable-document bg-white w-full max-w-[800px] rounded-xl border border-slate-200 shadow-md p-8 sm:p-12 relative flex flex-col justify-between min-h-[960px] text-slate-900"
          >
            {/* Top Border Accent */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-blue-600 rounded-t-xl" />

            {/* Header / Brand */}
            <div>
              <div className="flex items-start justify-between border-b border-slate-200 pb-5 mt-1">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    K3
                  </div>
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">K3 STUDIO</h1>
                    <p className="text-xs text-blue-700 font-semibold tracking-wider uppercase">Software Engineering & Training Division</p>
                    <p className="text-[11px] text-slate-400">www.k3studio.com • contact@k3studio.com</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-bold">
                    Ref: {docNumber}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Date: {issueDate}</p>
                </div>
              </div>

              {/* Document Type Specific Content */}
              {documentType === "INTERNSHIP_CERTIFICATE" && (
                <div className="my-8 text-center">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-widest mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Certificate of Excellence
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-5 font-serif">
                    CERTIFICATE OF INTERNSHIP COMPLETION
                  </h2>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl mx-auto mb-5">
                    This is proudly presented to certify that
                  </p>

                  <div className="my-3 py-1.5 border-b-2 border-blue-600 inline-block px-8">
                    <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 tracking-tight font-serif">
                      {student.fullName}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 font-mono mt-1 mb-6">
                    Roll No: <span className="font-bold text-slate-800">{student.rollNumber}</span> • {student.division} • {student.branch}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl mx-auto text-justify sm:text-center">
                    has successfully completed the intensive <strong className="text-blue-900">30-Day On-the-Job Training (OJT) Internship Program</strong> conducted by K3 Studio from <strong className="text-slate-900">{startDateStr}</strong> to <strong className="text-slate-900">{endDateStr}</strong>. During this internship, they demonstrated outstanding dedication in modern fullstack software development, client communication, Freelancer bidding sprints, and capstone project delivery ({student.projectName || "Full-Stack Web Architecture"}).
                  </p>
                </div>
              )}

              {documentType === "OFFER_LETTER" && (
                <div className="my-6 text-left space-y-3.5">
                  <div className="text-center mb-5">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight uppercase">
                      Internship Offer Letter
                    </h2>
                    <p className="text-xs text-blue-700 font-semibold">30-Day On-the-Job Training (OJT) Program</p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                    <p><strong>To:</strong> {student.fullName}</p>
                    <p><strong>Roll No:</strong> {student.rollNumber} ({student.division})</p>
                    <p><strong>College:</strong> {student.college}</p>
                    <p><strong>Branch:</strong> {student.branch}</p>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    Dear <strong>{student.fullName}</strong>,
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    We are pleased to offer you the position of <strong>Software Engineering Intern (OJT Track)</strong> at K3 Studio. Your 30-day internship is scheduled from <strong>{startDateStr}</strong> through <strong>{endDateStr}</strong>.
                  </p>

                  <div className="text-xs text-slate-700 space-y-1.5">
                    <p className="font-bold text-slate-900">Scope of Work & Key Deliverables:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                      <li>Complete fullstack curriculum & coding modules (React, Next.js, TypeScript, Prisma).</li>
                      <li>Participate in client communication workshops and complete the target of 100 Freelancer.com project bids.</li>
                      <li>Architect, build, and deploy an industry-grade verified capstone project.</li>
                      <li>Maintain a minimum of 80% attendance across all 30 practical sessions.</li>
                    </ul>
                  </div>
                </div>
              )}

              {documentType === "COMPLETION_LETTER" && (
                <div className="my-6 text-left space-y-3.5">
                  <div className="text-center mb-5">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight uppercase">
                      Letter of Recommendation & OJT Completion
                    </h2>
                    <p className="text-xs text-blue-700 font-semibold">K3 Studio Technical Certification</p>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>To Whom It May Concern,</strong>
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed text-justify">
                    This is to verify and certify that <strong>{student.fullName}</strong> (Roll Number: <strong>{student.rollNumber}</strong>), a student of <strong>{student.college}</strong> ({student.branch}), has successfully completed their 30-day On-the-Job Training (OJT) Internship at K3 Studio between <strong>{startDateStr}</strong> and <strong>{endDateStr}</strong>.
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed text-justify">
                    During the program, {student.fullName} was engaged in practical software engineering tasks, successfully delivering the project <strong>"{student.projectName || "Fullstack Web Application"}"</strong> with great proficiency in modern web architecture, clean code standards, and agile sprint workflows.
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    We found them to be punctual, highly motivated, and quick to grasp complex engineering concepts. We recommend {student.fullName} for software development and internship roles with full confidence.
                  </p>
                </div>
              )}

              {documentType === "OJT_DOCUMENTS" && (
                <div className="my-6 text-left space-y-3.5">
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900 uppercase">OJT Student Evaluation Record</h2>
                    <p className="text-xs text-blue-700 font-semibold">30-Day Training Performance Summary</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div>
                      <p className="text-slate-500">Student Name:</p>
                      <p className="font-bold text-slate-900">{student.fullName}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Roll No & Division:</p>
                      <p className="font-bold text-slate-900">{student.rollNumber} ({student.division})</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Duration:</p>
                      <p className="font-bold text-slate-900">30 Days ({startDateStr} - {endDateStr})</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Project Verified:</p>
                      <p className="font-bold text-emerald-700">{student.projectName || "Verified"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Official Signature & Seal Footer */}
            <div className="pt-6 border-t border-slate-200 mt-10 flex items-end justify-between">
              {/* Official Seal Badge */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-blue-600 flex flex-col items-center justify-center text-center p-1 bg-blue-50/50">
                  <Award className="w-4 h-4 text-blue-700" />
                  <span className="text-[7px] font-black uppercase text-blue-900 tracking-tighter leading-tight">OFFICIAL SEAL</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  <p className="font-semibold text-slate-600">Verification ID: {docNumber}</p>
                  <p>Digitally Signed & Validated</p>
                </div>
              </div>

              {/* Admin Signature */}
              <div className="text-right">
                <div className="font-serif italic text-base font-bold text-slate-800 mb-0.5 tracking-wider">
                  Piyush Gupta
                </div>
                <div className="w-36 h-0.5 bg-slate-300 ml-auto mb-1" />
                <p className="text-xs font-bold text-slate-900">Piyush Gupta</p>
                <p className="text-[11px] text-blue-700 font-semibold">Founder & Technical Director</p>
                <p className="text-[10px] text-slate-500">K3 Studio</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
