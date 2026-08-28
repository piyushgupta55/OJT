"use client";

import {
  BarChart3,
  Award,
  CheckCircle2,
  Briefcase,
} from "lucide-react";

interface AnalyticsData {
  divisionStats: { division: string; count: number; percentage: number }[];
  ojtStatusStats: { status: string; count: number; color: string }[];
  projectStatusStats: { status: string; count: number; color: string }[];
  freelancerProgress: {
    totalBidsSubmitted: number;
    avgBidsPerStudent: number;
    completed100BidsCount: number;
    inProgressCount: number;
  };
  certificateStats: {
    issued: number;
    generated: number;
    notIssued: number;
    total: number;
  };
}

export function AnalyticsCharts({ data }: { data: AnalyticsData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* 1. Students by Division & OJT Status */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Students by Division</h3>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">Distribution</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {data.divisionStats.map((div) => (
              <div key={div.division}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">{div.division}</span>
                  <span className="font-bold text-blue-700">{div.count} students ({div.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${div.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* OJT Status Pill summary */}
        <div className="mt-5 pt-3.5 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">OJT Status Breakdown</p>
          <div className="flex flex-wrap gap-2">
            {data.ojtStatusStats.map((item) => (
              <div key={item.status} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color === "#7c3aed" ? "#2563eb" : item.color }} />
                <span className="font-medium text-slate-700">{item.status}:</span>
                <span className="font-bold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Freelancer 100-Bids Milestone Tracker */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Freelancer Bids Progress</h3>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">100 Target</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
              <p className="text-[11px] font-medium text-slate-500">Total Bids Placed</p>
              <p className="text-xl font-bold text-blue-700 mt-0.5">{data.freelancerProgress.totalBidsSubmitted}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Across cohort</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
              <p className="text-[11px] font-medium text-slate-500">Avg Bids / Student</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{data.freelancerProgress.avgBidsPerStudent}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Target: 100 bids</p>
            </div>
          </div>

          {/* Milestone Hit Ratio */}
          <div className="mt-4 p-3 rounded-xl bg-blue-50/70 border border-blue-100">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5 text-blue-900">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                100 Bids Completed
              </span>
              <span className="font-bold text-blue-700">{data.freelancerProgress.completed100BidsCount} Students</span>
            </div>
            <div className="w-full bg-blue-200/60 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((data.freelancerProgress.completed100BidsCount / (data.freelancerProgress.completed100BidsCount + data.freelancerProgress.inProgressCount || 1)) * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>In Progress: <b className="text-slate-800">{data.freelancerProgress.inProgressCount} students</b></span>
          <span className="text-blue-600 font-semibold">Active Daily Bidding</span>
        </div>
      </div>

      {/* 3. Project Verification & Certificate Issuance */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Projects & Certificates</h3>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800">Verification</span>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Project Verification Pipeline</span>
                <span className="text-[11px] font-normal text-slate-400">Total: {data.projectStatusStats.reduce((a, b) => a + b.count, 0)}</span>
              </p>
              <div className="grid grid-cols-3 gap-2">
                {data.projectStatusStats.slice(0, 3).map((item) => (
                  <div key={item.status} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center">
                    <p className="text-[10px] font-semibold text-slate-500 truncate">{item.status}</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{item.count}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate Status Gauge */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs mb-1 font-semibold text-slate-700">
                <span>Certificates Issued</span>
                <span className="font-bold text-blue-700">
                  {data.certificateStats.issued} / {data.certificateStats.total} ({Math.round((data.certificateStats.issued / (data.certificateStats.total || 1)) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full"
                  style={{ width: `${(data.certificateStats.issued / (data.certificateStats.total || 1)) * 100}%` }}
                />
                <div
                  className="bg-blue-400 h-full"
                  style={{ width: `${(data.certificateStats.generated / (data.certificateStats.total || 1)) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Issued ({data.certificateStats.issued})</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Draft ({data.certificateStats.generated})</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> Pending ({data.certificateStats.notIssued})</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Official K3 Certificate Format</span>
          <span className="text-blue-600 font-semibold">Ready for Print</span>
        </div>
      </div>
    </div>
  );
}
