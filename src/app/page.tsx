import { prisma } from "@/lib/prisma";
import { StudentSheet } from "@/components/sheet/StudentSheet";

export const dynamic = "force-dynamic";

export default async function SheetHomePage() {
  const students = await prisma.student.findMany({
    include: {
      project: true,
      freelancerTracking: true,
      attendanceRecords: true,
      documents: true,
    },
    orderBy: { rollNumber: "asc" },
  });

  return (
    <div className="space-y-2">
      {/* Interactive Sheet Grid */}
      <StudentSheet initialStudents={students as any} />
    </div>
  );
}
