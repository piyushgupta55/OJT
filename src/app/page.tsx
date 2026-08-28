import { prisma } from "@/lib/prisma";
import { StudentSheet } from "@/components/sheet/StudentSheet";

export const dynamic = "force-dynamic";

export default async function SheetHomePage() {
  let students = [];
  let dbError = null;

  try {
    students = await prisma.student.findMany({
      include: {
        project: true,
        freelancerTracking: true,
        attendanceRecords: true,
        documents: true,
      },
      orderBy: { rollNumber: "asc" },
    });
  } catch (error: any) {
    console.error("Database query failed on SheetHomePage:", error);
    dbError = error?.message || "Failed to load database records.";
  }

  return (
    <div className="space-y-2">
      {dbError && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-sm">
          <p className="font-semibold">⚠️ Database Connection Notice</p>
          <p className="text-xs text-amber-700 mt-1">
            Could not fetch students from the database. Please verify that your Supabase/PostgreSQL environment variables (<code>DATABASE_URL</code> and <code>DIRECT_URL</code>) are set in Vercel and that you ran <code>npx prisma db push</code>.
          </p>
          <p className="text-[11px] text-amber-600/80 font-mono mt-1">{dbError}</p>
        </div>
      )}
      {/* Interactive Sheet Grid */}
      <StudentSheet initialStudents={students as any} />
    </div>
  );
}
