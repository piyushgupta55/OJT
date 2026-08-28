import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StudentDetailView } from "@/components/students/StudentDetailView";

export const dynamic = "force-dynamic";

interface StudentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { id } = await params;

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      project: true,
      freelancerTracking: true,
      attendanceRecords: {
        orderBy: { sessionNumber: "asc" },
      },
      assignments: {
        orderBy: { dueDate: "asc" },
      },
      documents: {
        orderBy: { createdAt: "asc" },
      },
      activityLogs: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!student) {
    notFound();
  }

  return <StudentDetailView student={student} />;
}
