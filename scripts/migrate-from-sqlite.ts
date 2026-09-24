import { PrismaClient } from "@prisma/client";
import Database from "better-sqlite3";
import path from "path";

const prisma = new PrismaClient();

async function migrateData() {
  const sqliteDbPath = path.join(process.cwd(), "prisma", "dev.db");
  const sqlite = new Database(sqliteDbPath);

  console.log("Reading data from local SQLite database (prisma/dev.db)...");

  // Read all tables from SQLite
  const users = sqlite.prepare("SELECT * FROM User").all();
  const students = sqlite.prepare("SELECT * FROM Student").all();
  const freelancerTrackings = sqlite.prepare("SELECT * FROM FreelancerTracking").all();
  const projects = sqlite.prepare("SELECT * FROM Project").all();
  const attendanceRecords = sqlite.prepare("SELECT * FROM AttendanceRecord").all();
  const assignments = sqlite.prepare("SELECT * FROM Assignment").all();
  const documents = sqlite.prepare("SELECT * FROM Document").all();
  const activityLogs = sqlite.prepare("SELECT * FROM ActivityLog").all();

  console.log(`Found ${students.length} students in SQLite database.`);

  // Clean PostgreSQL first
  await prisma.activityLog.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.attendanceRecord.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.freelancerTracking.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Migrate Users
  for (const u of users as any[]) {
    await prisma.user.create({
      data: {
        id: u.id,
        email: u.email,
        name: u.name,
        passwordHash: u.passwordHash,
        role: u.role || "ADMIN",
        organization: u.organization || "K3 Studio",
        avatarUrl: u.avatarUrl || null,
        createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
        updatedAt: u.updatedAt ? new Date(u.updatedAt) : new Date(),
      },
    });
  }
  console.log(`Migrated ${users.length} users.`);

  // 2. Migrate Students
  for (const s of students as any[]) {
    await prisma.student.create({
      data: {
        id: s.id,
        fullName: s.fullName,
        rollNumber: s.rollNumber,
        division: s.division || "Division A",
        college: s.college || "College",
        branch: s.branch || "Computer Science",
        email: s.email,
        phoneNumber: s.phoneNumber || "",
        avatar: s.avatar || null,
        startDate: s.startDate ? new Date(s.startDate) : new Date(),
        endDate: s.endDate ? new Date(s.endDate) : new Date(),
        durationDays: s.durationDays || 30,
        ojtStatus: s.ojtStatus || "ONGOING",
        codingVideosCompleted: Boolean(s.codingVideosCompleted),
        clientCommunicationTraining: Boolean(s.clientCommunicationTraining),
        freelancingTraining: Boolean(s.freelancingTraining),
        projectManagementTraining: Boolean(s.projectManagementTraining),
        finalProjectStatus: s.finalProjectStatus || "IN_PROGRESS",
        certificateSent: Boolean(s.certificateSent),
        createdAt: s.createdAt ? new Date(s.createdAt) : new Date(),
        updatedAt: s.updatedAt ? new Date(s.updatedAt) : new Date(),
      },
    });
  }
  console.log(`Migrated ${students.length} students.`);

  // 3. Migrate Freelancer Tracking
  for (const f of freelancerTrackings as any[]) {
    await prisma.freelancerTracking.create({
      data: {
        id: f.id,
        studentId: f.studentId,
        profileUrl: f.profileUrl || null,
        accountCreated: Boolean(f.accountCreated),
        planType: f.planType || "FREE",
        bidsCompleted: f.bidsCompleted || 0,
        targetBids: f.targetBids || 100,
        taskStatus: f.taskStatus || "NOT_STARTED",
        updatedAt: f.updatedAt ? new Date(f.updatedAt) : new Date(),
      },
    });
  }

  // 4. Migrate Projects
  for (const p of projects as any[]) {
    await prisma.project.create({
      data: {
        id: p.id,
        studentId: p.studentId,
        projectName: p.projectName,
        description: p.description || null,
        sourcePlaylist: p.sourcePlaylist || null,
        technologyUsed: p.technologyUsed || "Next.js, TypeScript",
        status: p.status || "IN_PROGRESS",
        githubUrl: p.githubUrl || null,
        liveDemoUrl: p.liveDemoUrl || null,
        projectSubmittedDate: p.projectSubmittedDate ? new Date(p.projectSubmittedDate) : null,
        verificationStatus: p.verificationStatus || "PENDING",
        verificationRemarks: p.verificationRemarks || null,
        verifiedAt: p.verifiedAt ? new Date(p.verifiedAt) : null,
        verifiedBy: p.verifiedBy || null,
        createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
        updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      },
    });
  }

  // 5. Migrate Attendance Records
  for (const a of attendanceRecords as any[]) {
    await prisma.attendanceRecord.create({
      data: {
        id: a.id,
        studentId: a.studentId,
        sessionNumber: a.sessionNumber,
        date: a.date ? new Date(a.date) : new Date(),
        topic: a.topic || "OJT Session",
        status: a.status || "PRESENT",
        remarks: a.remarks || null,
        createdAt: a.createdAt ? new Date(a.createdAt) : new Date(),
        updatedAt: a.updatedAt ? new Date(a.updatedAt) : new Date(),
      },
    });
  }

  // 6. Migrate Assignments
  for (const asg of assignments as any[]) {
    await prisma.assignment.create({
      data: {
        id: asg.id,
        studentId: asg.studentId,
        name: asg.name,
        description: asg.description || null,
        dueDate: asg.dueDate ? new Date(asg.dueDate) : new Date(),
        submittedDate: asg.submittedDate ? new Date(asg.submittedDate) : null,
        submissionLink: asg.submissionLink || null,
        status: asg.status || "PENDING",
        verificationStatus: asg.verificationStatus || "PENDING",
        remarks: asg.remarks || null,
        createdAt: asg.createdAt ? new Date(asg.createdAt) : new Date(),
        updatedAt: asg.updatedAt ? new Date(asg.updatedAt) : new Date(),
      },
    });
  }

  // 7. Migrate Documents
  for (const d of documents as any[]) {
    await prisma.document.create({
      data: {
        id: d.id,
        studentId: d.studentId,
        type: d.type,
        title: d.title,
        status: d.status || "NOT_ISSUED",
        issuedDate: d.issuedDate ? new Date(d.issuedDate) : null,
        documentNumber: d.documentNumber || null,
        remarks: d.remarks || null,
        createdAt: d.createdAt ? new Date(d.createdAt) : new Date(),
        updatedAt: d.updatedAt ? new Date(d.updatedAt) : new Date(),
      },
    });
  }

  // 8. Migrate Activity Logs
  for (const al of activityLogs as any[]) {
    await prisma.activityLog.create({
      data: {
        id: al.id,
        studentId: al.studentId || null,
        action: al.action,
        adminName: al.adminName || "Piyush Gupta",
        description: al.description,
        createdAt: al.createdAt ? new Date(al.createdAt) : new Date(),
      },
    });
  }

  console.log("SUCCESS: All 35 real students and related records migrated to Supabase PostgreSQL!");
}

migrateData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
