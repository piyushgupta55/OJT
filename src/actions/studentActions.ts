"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const revalidateStudentsCache = () => {
  try {
    revalidatePath("/", "page");
  } catch {}
};

const CURRENT_ADMIN = "Piyush Gupta";

export async function quickAddStudent(data: {
  fullName: string;
  rollNumber: string;
  division?: string;
  college?: string;
  branch?: string;
  email?: string;
  phoneNumber?: string;
  projectName?: string;
  githubUrl?: string;
  bidsCompleted?: number;
  ojtStatus?: string;
  certificateSent?: boolean;
}) {
  try {
    const roll = data.rollNumber.trim();
    const name = data.fullName.trim();
    if (!name || !roll) {
      return { success: false, error: "Name and Roll Number are required" };
    }

    const email = data.email?.trim() || `${roll.toLowerCase()}@student.k3studio.com`;
    const division = data.division || "Division A";
    const bids = Number(data.bidsCompleted || 0);

    const startDate = new Date("2026-08-01");
    const endDate = new Date("2026-08-30");

    const student = await prisma.student.create({
      data: {
        fullName: name,
        rollNumber: roll,
        division,
        college: data.college || "Thakur Ramnarayan College of Arts and Commerce",
        branch: "Computer Science",
        email,
        phoneNumber: data.phoneNumber?.trim() || "+91 98765 00000",
        startDate,
        endDate,
        durationDays: 30,
        ojtStatus: data.ojtStatus || "ONGOING",
        certificateSent: data.certificateSent || false,
        codingVideosCompleted: true,
        clientCommunicationTraining: true,
        freelancingTraining: true,
        projectManagementTraining: true,
        finalProjectStatus: "IN_PROGRESS",
        freelancerTracking: {
          create: {
            profileUrl: `https://freelancer.com/u/${roll.toLowerCase()}`,
            accountCreated: true,
            planType: "FREE",
            bidsCompleted: bids,
            targetBids: 100,
            taskStatus: bids >= 100 ? "COMPLETED_100_BIDS" : bids > 0 ? "IN_PROGRESS" : "NOT_STARTED",
          },
        },
        project: {
          create: {
            projectName: data.projectName?.trim() || "Full-Stack Web App",
            technologyUsed: "Next.js, TypeScript, Tailwind",
            githubUrl: data.githubUrl?.trim() || null,
            status: "IN_PROGRESS",
            verificationStatus: "PENDING",
          },
        },
        documents: {
          create: [
            {
              type: "INTERNSHIP_CERTIFICATE",
              title: "Certificate of Internship Completion",
              status: "NOT_ISSUED",
              documentNumber: `K3-CERT-2026-${roll}`,
            },
            {
              type: "OFFER_LETTER",
              title: "K3 Studio 30-Day OJT Offer Letter",
              status: "ISSUED",
              issuedDate: new Date(),
              documentNumber: `K3-OL-2026-${roll}`,
            },
          ],
        },
        activityLogs: {
          create: {
            action: "ADD_ROW",
            adminName: CURRENT_ADMIN,
            description: `Added student ${name} (${roll}, ${division}) to sheet.`,
          },
        },
      },
    });

    revalidateStudentsCache();
    return { success: true, studentId: student.id };
  } catch (error: unknown) {
    console.error("Error adding row:", error);
    if ((error as any)?.code === "P2002") {
      const target = (error as any)?.meta?.target;
      const targetStr = Array.isArray(target) ? target.join(",") : String(target || "");
      if (targetStr.includes("rollNumber")) {
        return { success: false, error: `Student with Roll Number "${data.rollNumber.trim()}" already exists in the roster.` };
      }
      if (targetStr.includes("email")) {
        return { success: false, error: `A student with this email already exists.` };
      }
      return { success: false, error: "A student with this Roll Number or Email already exists." };
    }
    const msg = error instanceof Error ? error.message : "Failed to add student row";
    return { success: false, error: msg };
  }
}

export async function updateStudentField(
  studentId: string,
  field: "fullName" | "rollNumber" | "division" | "ojtStatus" | "bids" | "projectStatus" | "projectName" | "githubUrl" | "attendance" | "certificateSent",
  value: string | number | boolean
) {
  try {
    if (field === "certificateSent") {
      const boolVal = typeof value === "boolean" ? value : value === "true" || value === 1 || value === "1";
      await prisma.student.update({
        where: { id: studentId },
        data: { certificateSent: boolVal },
      });
    } else if (field === "bids") {
      const bids = Math.max(0, Math.min(1000, Number(value)));
      await prisma.freelancerTracking.updateMany({
        where: { studentId },
        data: {
          bidsCompleted: bids,
          taskStatus: bids >= 100 ? "COMPLETED_100_BIDS" : "IN_PROGRESS",
        },
      });
    } else if (field === "projectStatus") {
      const status = String(value);
      const isVerified = status === "VERIFIED" || status === "COMPLETED";
      await prisma.project.updateMany({
        where: { studentId },
        data: {
          status,
          verificationStatus: isVerified ? "VERIFIED" : "PENDING",
          ...(isVerified && { verifiedAt: new Date(), verifiedBy: CURRENT_ADMIN }),
        },
      });
    } else if (field === "projectName" || field === "githubUrl") {
      await prisma.project.updateMany({
        where: { studentId },
        data: {
          [field]: String(value),
        },
      });
    } else {
      await prisma.student.update({
        where: { id: studentId },
        data: {
          [field]: value,
        },
      });
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating field:", error);
    return { success: false, error: "Failed to update field" };
  }
}

export async function toggleCertificateSent(studentId: string) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { certificateSent: true },
    });
    if (!student) return { success: false, error: "Student not found" };

    const updated = await prisma.student.update({
      where: { id: studentId },
      data: { certificateSent: !student.certificateSent },
    });

    revalidateStudentsCache();
    return { success: true, certificateSent: updated.certificateSent };
  } catch (error: unknown) {
    console.error("Error toggling certificate:", error);
    return { success: false, error: "Failed to toggle certificate" };
  }
}

export async function deleteStudent(studentId: string) {
  try {
    await prisma.student.delete({ where: { id: studentId } });
    revalidateStudentsCache();
    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting student:", error);
    return { success: false, error: "Failed to delete student" };
  }
}

export async function generateStudentDocument(studentId: string, docType: string) {
  try {
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) return { success: false, error: "Student not found" };

    const docNumber = `K3-${docType === "INTERNSHIP_CERTIFICATE" ? "CERT" : "DOC"}-2026-${student.rollNumber}`;

    await prisma.$transaction(async (tx) => {
      await tx.document.upsert({
        where: { id: `${studentId}_${docType}` },
        create: {
          id: `${studentId}_${docType}`,
          studentId,
          type: docType,
          title: docType === "INTERNSHIP_CERTIFICATE" ? "Certificate of Internship Completion" : "OJT Official Document",
          status: "ISSUED",
          issuedDate: new Date(),
          documentNumber: docNumber,
        },
        update: {
          status: "ISSUED",
          issuedDate: new Date(),
          documentNumber: docNumber,
        },
      });

      await tx.activityLog.create({
        data: {
          studentId,
          action: "GENERATE_DOCUMENT",
          adminName: CURRENT_ADMIN,
          description: `Issued ${docType} (${docNumber}) for ${student.fullName}.`,
        },
      });

      if (docType === "INTERNSHIP_CERTIFICATE") {
        await tx.student.update({
          where: { id: studentId },
          data: { ojtStatus: "COMPLETED" },
        });
      }
    });

    revalidateStudentsCache();
    return { success: true, documentNumber: docNumber };
  } catch (error: unknown) {
    console.error("Error generating doc:", error);
    return { success: false, error: "Failed to generate document" };
  }
}

export async function editStudentFull(
  studentId: string,
  data: {
    fullName?: string;
    rollNumber?: string;
    division?: string;
    projectName?: string;
    githubUrl?: string;
    projectStatus?: string;
    bidsCompleted?: number;
    ojtStatus?: string;
    certificateSent?: boolean;
  }
) {
  try {
    const studentUpdateData: Record<string, any> = {};
    if (data.fullName !== undefined) studentUpdateData.fullName = data.fullName.trim();
    if (data.rollNumber !== undefined) studentUpdateData.rollNumber = data.rollNumber.trim();
    if (data.division !== undefined) studentUpdateData.division = data.division;
    if (data.ojtStatus !== undefined) studentUpdateData.ojtStatus = data.ojtStatus;
    if (data.certificateSent !== undefined) studentUpdateData.certificateSent = data.certificateSent;

    const bids = data.bidsCompleted !== undefined ? Math.max(0, Math.min(1000, Number(data.bidsCompleted))) : undefined;

    await prisma.student.update({
      where: { id: studentId },
      data: {
        ...studentUpdateData,
        ...(bids !== undefined && {
          freelancerTracking: {
            upsert: {
              create: {
                bidsCompleted: bids,
                targetBids: 100,
                taskStatus: bids >= 100 ? "COMPLETED_100_BIDS" : "IN_PROGRESS",
                planType: "FREE",
                accountCreated: true,
              },
              update: {
                bidsCompleted: bids,
                taskStatus: bids >= 100 ? "COMPLETED_100_BIDS" : "IN_PROGRESS",
              },
            },
          },
        }),
        ...((data.projectName !== undefined || data.githubUrl !== undefined || data.projectStatus !== undefined) && {
          project: {
            upsert: {
              create: {
                projectName: data.projectName || "Capstone Project",
                githubUrl: data.githubUrl || null,
                status: data.projectStatus || "IN_PROGRESS",
                technologyUsed: "Next.js, TypeScript",
              },
              update: {
                ...(data.projectName !== undefined && { projectName: data.projectName }),
                ...(data.githubUrl !== undefined && { githubUrl: data.githubUrl }),
                ...(data.projectStatus !== undefined && { status: data.projectStatus }),
              },
            },
          },
        }),
      },
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Error editing student:", error);
    const msg = error instanceof Error ? error.message : "Failed to edit student";
    return { success: false, error: msg };
  }
}

export async function updateStudentDetails(studentId: string, data: any) {
  try {
    await prisma.student.update({
      where: { id: studentId },
      data,
    });
    revalidateStudentsCache();
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: "Failed to update" };
  }
}

export async function updateFreelancerBids(studentId: string, bids: number) {
  return updateStudentField(studentId, "bids", bids);
}

export async function updateProjectStatus(studentId: string, params: any) {
  return updateStudentField(studentId, "projectStatus", params.status);
}

export async function addAttendanceSession(studentId: string, data: any) {
  try {
    await prisma.attendanceRecord.create({
      data: {
        studentId,
        sessionNumber: data.sessionNumber,
        date: new Date(data.date),
        topic: data.topic,
        status: data.status,
        remarks: data.remarks || null,
      },
    });
    revalidateStudentsCache();
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function addAssignmentRecord(studentId: string, data: any) {
  try {
    await prisma.assignment.create({
      data: {
        studentId,
        name: data.name,
        description: data.description,
        dueDate: new Date(data.dueDate),
        status: data.status,
      },
    });
    revalidateStudentsCache();
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function addStudent(formData: any) {
  return quickAddStudent({
    fullName: formData.fullName,
    rollNumber: formData.rollNumber,
    division: formData.division,
    college: formData.college,
    branch: formData.branch,
    email: formData.email,
    phoneNumber: formData.phoneNumber,
    projectName: formData.projectName,
    githubUrl: formData.githubUrl,
    bidsCompleted: formData.initialBids,
    ojtStatus: formData.ojtStatus,
    certificateSent: formData.certificateSent,
  });
}
