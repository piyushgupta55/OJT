import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean up existing
  await prisma.activityLog.deleteMany();
  await prisma.document.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.project.deleteMany();
  await prisma.freelancerTracking.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin User
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Piyush Gupta",
      email: "admin@k3studio.com",
      passwordHash,
      role: "ADMIN",
      organization: "K3 Studio",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log("Created admin user:", admin.email);

  const sampleStudents = [
    {
      fullName: "Aarav Sharma",
      rollNumber: "21CS01",
      division: "Division A",
      college: "Government Engineering College",
      branch: "Computer Science & Engineering",
      email: "aarav.sharma@example.com",
      phoneNumber: "+91 98765 43210",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      ojtStatus: "ONGOING",
      codingVideosCompleted: true,
      clientCommunicationTraining: true,
      freelancingTraining: true,
      projectManagementTraining: true,
      finalProjectStatus: "IN_PROGRESS",
      freelancer: {
        profileUrl: "https://www.freelancer.com/u/aaravtech21",
        accountCreated: true,
        planType: "PREMIUM",
        bidsCompleted: 100,
        targetBids: 100,
        taskStatus: "COMPLETED_100_BIDS",
      },
      project: {
        projectName: "AI Resume Screener & Job Matcher",
        description: "An automated candidate ranking and resume parsing portal using Next.js, OpenAI API, and PostgreSQL.",
        sourcePlaylist: "Next.js 15 Fullstack Course - K3 Studio",
        technologyUsed: "Next.js 15, TypeScript, Tailwind CSS, PostgreSQL, OpenAI",
        status: "VERIFIED",
        githubUrl: "https://github.com/aaravsharma/ai-resume-screener",
        liveDemoUrl: "https://ai-resume-screener-demo.vercel.app",
        projectSubmittedDate: new Date(Date.now() - 5 * 86400000),
        verificationStatus: "VERIFIED",
        verificationRemarks: "Exceptional UI and clean TypeScript architecture. All API rate limits handled gracefully.",
        verifiedAt: new Date(Date.now() - 2 * 86400000),
        verifiedBy: "Piyush Gupta",
      },
      attendanceCount: 22,
      bids: 100,
    },
    {
      fullName: "Ananya Patel",
      rollNumber: "21CS02",
      division: "Division A",
      college: "Institute of Technology & Science",
      branch: "Information Technology",
      email: "ananya.patel@example.com",
      phoneNumber: "+91 98234 56781",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      ojtStatus: "COMPLETED",
      codingVideosCompleted: true,
      clientCommunicationTraining: true,
      freelancingTraining: true,
      projectManagementTraining: true,
      finalProjectStatus: "COMPLETED",
      freelancer: {
        profileUrl: "https://www.freelancer.com/u/ananyadeveloper",
        accountCreated: true,
        planType: "PREMIUM",
        bidsCompleted: 100,
        targetBids: 100,
        taskStatus: "COMPLETED_100_BIDS",
      },
      project: {
        projectName: "E-Commerce Multi-Vendor Storefront",
        description: "High-performance storefront with Stripe checkout, merchant admin panel, and real-time inventory tracking.",
        sourcePlaylist: "Advanced Full-Stack Engineering - K3 Studio",
        technologyUsed: "React 19, Node.js, Prisma, Tailwind CSS, Redis",
        status: "COMPLETED",
        githubUrl: "https://github.com/ananyapatel/multivendor-ecommerce",
        liveDemoUrl: "https://ananya-shop-demo.vercel.app",
        projectSubmittedDate: new Date(Date.now() - 10 * 86400000),
        verificationStatus: "VERIFIED",
        verificationRemarks: "Outstanding project delivery! Clean code, test coverage, and responsive layout.",
        verifiedAt: new Date(Date.now() - 8 * 86400000),
        verifiedBy: "Piyush Gupta",
      },
      attendanceCount: 25,
      bids: 100,
    },
    {
      fullName: "Rohan Verma",
      rollNumber: "21CS03",
      division: "Division B",
      college: "National Institute of Science",
      branch: "Computer Science & Engineering",
      email: "rohan.verma@example.com",
      phoneNumber: "+91 97123 45678",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      ojtStatus: "ONGOING",
      codingVideosCompleted: true,
      clientCommunicationTraining: true,
      freelancingTraining: true,
      projectManagementTraining: false,
      finalProjectStatus: "IN_PROGRESS",
      freelancer: {
        profileUrl: "https://www.freelancer.com/u/rohanvdev",
        accountCreated: true,
        planType: "FREE",
        bidsCompleted: 68,
        targetBids: 100,
        taskStatus: "IN_PROGRESS",
      },
      project: {
        projectName: "Collaborative Whiteboard & Task Suite",
        description: "Real-time canvas with WebSockets, sticky notes, and sprint planning board.",
        sourcePlaylist: "WebSockets & Next.js - K3 Studio",
        technologyUsed: "Next.js, Tailwind CSS, Socket.io, Zustand",
        status: "UNDER_VERIFICATION",
        githubUrl: "https://github.com/rohanverma/collab-board",
        liveDemoUrl: "https://collab-board-preview.vercel.app",
        projectSubmittedDate: new Date(Date.now() - 1 * 86400000),
        verificationStatus: "PENDING",
        verificationRemarks: "Awaiting final review on mobile responsiveness.",
        verifiedAt: null,
        verifiedBy: null,
      },
      attendanceCount: 19,
      bids: 68,
    },
    {
      fullName: "Sneha Kulkarni",
      rollNumber: "21CS04",
      division: "Division A",
      college: "Government Engineering College",
      branch: "Computer Engineering",
      email: "sneha.kulkarni@example.com",
      phoneNumber: "+91 96543 21876",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      ojtStatus: "ONGOING",
      codingVideosCompleted: true,
      clientCommunicationTraining: true,
      freelancingTraining: true,
      projectManagementTraining: true,
      finalProjectStatus: "IN_PROGRESS",
      freelancer: {
        profileUrl: "https://www.freelancer.com/u/snehakodes",
        accountCreated: true,
        planType: "PREMIUM",
        bidsCompleted: 92,
        targetBids: 100,
        taskStatus: "IN_PROGRESS",
      },
      project: {
        projectName: "Healthcare Patient & Teleconsultation Portal",
        description: "Appointment booking, doctor schedules, WebRTC video calling, and digital prescription generator.",
        sourcePlaylist: "HealthTech Masterclass - K3 Studio",
        technologyUsed: "Next.js 15, Prisma, PostgreSQL, WebRTC, Tailwind",
        status: "NEEDS_CHANGES",
        githubUrl: "https://github.com/snehakulkarni/health-portal",
        liveDemoUrl: "https://telehealth-demo.vercel.app",
        projectSubmittedDate: new Date(Date.now() - 3 * 86400000),
        verificationStatus: "NEEDS_CHANGES",
        verificationRemarks: "Fix WebRTC connection timeout on Safari and add empty state illustrations.",
        verifiedAt: new Date(Date.now() - 1 * 86400000),
        verifiedBy: "Piyush Gupta",
      },
      attendanceCount: 21,
      bids: 92,
    },
    {
      fullName: "Vikram Malhotra",
      rollNumber: "21CS05",
      division: "Division A",
      college: "Apex College of Engineering",
      branch: "Electronics & Telecommunication",
      email: "vikram.malhotra@example.com",
      phoneNumber: "+91 98451 23456",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      ojtStatus: "ONGOING",
      codingVideosCompleted: false,
      clientCommunicationTraining: false,
      freelancingTraining: true,
      projectManagementTraining: false,
      finalProjectStatus: "NOT_STARTED",
      freelancer: {
        profileUrl: "https://www.freelancer.com/u/vikrammalhotra",
        accountCreated: true,
        planType: "FREE",
        bidsCompleted: 24,
        targetBids: 100,
        taskStatus: "IN_PROGRESS",
      },
      project: {
        projectName: "Smart Attendance & RFID Sync Dashboard",
        description: "IoT sensor dashboard with attendance tracking, leave requests, and biometric webhook integration.",
        sourcePlaylist: "IoT & Full-Stack - K3 Studio",
        technologyUsed: "React, Express, SQLite, Chart.js",
        status: "IN_PROGRESS",
        githubUrl: "https://github.com/vikramm/smart-attendance",
        liveDemoUrl: null,
        projectSubmittedDate: null,
        verificationStatus: "PENDING",
        verificationRemarks: null,
        verifiedAt: null,
        verifiedBy: null,
      },
      attendanceCount: 14,
      bids: 24,
    },
    {
      fullName: "Pooja Deshmukh",
      rollNumber: "21CS06",
      division: "Division B",
      college: "Institute of Technology & Science",
      branch: "Computer Science",
      email: "pooja.deshmukh@example.com",
      phoneNumber: "+91 97654 32109",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      ojtStatus: "COMPLETED",
      codingVideosCompleted: true,
      clientCommunicationTraining: true,
      freelancingTraining: true,
      projectManagementTraining: true,
      finalProjectStatus: "COMPLETED",
      freelancer: {
        profileUrl: "https://www.freelancer.com/u/poojadeshmukh",
        accountCreated: true,
        planType: "PREMIUM",
        bidsCompleted: 100,
        targetBids: 100,
        taskStatus: "COMPLETED_100_BIDS",
      },
      project: {
        projectName: "FinTech Expense Tracker & Budget Planner",
        description: "Personal finance analytics app with CSV transaction importer, visual budgeting charts, and recurring alerts.",
        sourcePlaylist: "Fullstack FinTech - K3 Studio",
        technologyUsed: "Next.js 15, Recharts, Tailwind CSS, SQLite, Prisma",
        status: "COMPLETED",
        githubUrl: "https://github.com/poojadeshmukh/fintech-tracker",
        liveDemoUrl: "https://fintech-tracker-demo.vercel.app",
        projectSubmittedDate: new Date(Date.now() - 12 * 86400000),
        verificationStatus: "VERIFIED",
        verificationRemarks: "Superb attention to detail! Financial chart breakdowns are clean and responsive.",
        verifiedAt: new Date(Date.now() - 9 * 86400000),
        verifiedBy: "Piyush Gupta",
      },
      attendanceCount: 25,
      bids: 100,
    },
    {
      fullName: "Karan Johar",
      rollNumber: "21CS07",
      division: "Division B",
      college: "Apex College of Engineering",
      branch: "Computer Science & Engineering",
      email: "karan.johar@example.com",
      phoneNumber: "+91 98123 45987",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      ojtStatus: "ONGOING",
      codingVideosCompleted: true,
      clientCommunicationTraining: true,
      freelancingTraining: false,
      projectManagementTraining: false,
      finalProjectStatus: "IN_PROGRESS",
      freelancer: {
        profileUrl: "https://www.freelancer.com/u/karanj_dev",
        accountCreated: true,
        planType: "FREE",
        bidsCompleted: 45,
        targetBids: 100,
        taskStatus: "IN_PROGRESS",
      },
      project: {
        projectName: "Cloud File Vault & Secure Sharing",
        description: "End-to-end encrypted file sharing system with time-limited public links and download passwords.",
        sourcePlaylist: "Security in Web Apps - K3 Studio",
        technologyUsed: "Next.js, AWS S3, Tailwind, Prisma",
        status: "SUBMITTED",
        githubUrl: "https://github.com/karanj/file-vault",
        liveDemoUrl: "https://cloud-vault-preview.vercel.app",
        projectSubmittedDate: new Date(Date.now() - 2 * 86400000),
        verificationStatus: "PENDING",
        verificationRemarks: "Project submitted for admin verification. Checking AWS S3 IAM security rules.",
        verifiedAt: null,
        verifiedBy: null,
      },
      attendanceCount: 18,
      bids: 45,
    },
    {
      fullName: "Riya Sen",
      rollNumber: "21CS08",
      division: "Division B",
      college: "National Institute of Science",
      branch: "Information Science",
      email: "riya.sen@example.com",
      phoneNumber: "+91 97890 12345",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      ojtStatus: "ONGOING",
      codingVideosCompleted: true,
      clientCommunicationTraining: true,
      freelancingTraining: true,
      projectManagementTraining: true,
      finalProjectStatus: "IN_PROGRESS",
      freelancer: {
        profileUrl: "https://www.freelancer.com/u/riyasen_fullstack",
        accountCreated: true,
        planType: "PREMIUM",
        bidsCompleted: 85,
        targetBids: 100,
        taskStatus: "IN_PROGRESS",
      },
      project: {
        projectName: "Modern Learning Management System (LMS)",
        description: "Course catalog, video player with progress persistence, quiz engine, and certificate generation.",
        sourcePlaylist: "EdTech Architecture - K3 Studio",
        technologyUsed: "Next.js 15, Prisma, Tailwind CSS, TypeScript",
        status: "UNDER_VERIFICATION",
        githubUrl: "https://github.com/riyasen/lms-portal",
        liveDemoUrl: "https://lms-portal-demo.vercel.app",
        projectSubmittedDate: new Date(Date.now() - 2 * 86400000),
        verificationStatus: "PENDING",
        verificationRemarks: "Under active code review.",
        verifiedAt: null,
        verifiedBy: null,
      },
      attendanceCount: 23,
      bids: 85,
    },
  ];

  const sessionTopics = [
    "Orientation & Development Environment Setup",
    "Modern Git & GitHub Workflow for Teams",
    "Advanced TypeScript Types & Generics",
    "React 19 Hooks, Server Actions & App Architecture",
    "Tailwind CSS Layouts, Design Systems & Glassmorphism",
    "Relational Database Design & Prisma ORM Modeling",
    "Building Secure REST and GraphQL Endpoints",
    "Authentication with JWT, Cookies & Role-Based Access",
    "Freelancer.com Profile Setup & Verification",
    "Crafting High-Converting Client Proposals & Bids",
    "Project Architecture & Wireframing Workshop",
    "Component-Driven Development with Shadcn UI",
    "State Management Strategies (Zustand & React Context)",
    "Payment Gateway Integration (Stripe & Razorpay)",
    "File Uploads & Cloud Storage Integration (AWS S3)",
    "Client Communication, Negotiation & Rate Calculation",
    "Handling Client Revisions and Feedback Loops",
    "Mid-Term Project Review & Live Feedback Session",
    "Writing Unit & Integration Tests (Jest & Vitest)",
    "Performance Optimization & Core Web Vitals",
    "Building Real-Time Features with WebSockets",
    "CI/CD Pipeline with GitHub Actions & Vercel",
    "Freelancer Bidding Sprint: Target 100 Bids",
    "Final Project Submission & Code Verification",
    "Career Guidance, Resume Building & Tech Portfolio",
  ];

  for (const s of sampleStudents) {
    const startDate = new Date("2026-08-01");
    const endDate = new Date("2026-08-30");

    const student = await prisma.student.create({
      data: {
        fullName: s.fullName,
        rollNumber: s.rollNumber,
        division: s.division,
        college: s.college,
        branch: s.branch,
        email: s.email,
        phoneNumber: s.phoneNumber,
        avatar: s.avatar,
        startDate,
        endDate,
        durationDays: 30,
        ojtStatus: s.ojtStatus,
        codingVideosCompleted: s.codingVideosCompleted,
        clientCommunicationTraining: s.clientCommunicationTraining,
        freelancingTraining: s.freelancingTraining,
        projectManagementTraining: s.projectManagementTraining,
        finalProjectStatus: s.finalProjectStatus,
      },
    });

    // Create Freelancer Tracking
    await prisma.freelancerTracking.create({
      data: {
        studentId: student.id,
        profileUrl: s.freelancer.profileUrl,
        accountCreated: s.freelancer.accountCreated,
        planType: s.freelancer.planType,
        bidsCompleted: s.freelancer.bidsCompleted,
        targetBids: 100,
        taskStatus: s.freelancer.bidsCompleted >= 100 ? "COMPLETED_100_BIDS" : "IN_PROGRESS",
      },
    });

    // Create Project
    await prisma.project.create({
      data: {
        studentId: student.id,
        projectName: s.project.projectName,
        description: s.project.description,
        sourcePlaylist: s.project.sourcePlaylist,
        technologyUsed: s.project.technologyUsed,
        status: s.project.status,
        githubUrl: s.project.githubUrl,
        liveDemoUrl: s.project.liveDemoUrl,
        projectSubmittedDate: s.project.projectSubmittedDate,
        verificationStatus: s.project.verificationStatus,
        verificationRemarks: s.project.verificationRemarks,
        verifiedAt: s.project.verifiedAt,
        verifiedBy: s.project.verifiedBy,
      },
    });

    // Create Attendance records
    for (let i = 0; i < 25; i++) {
      const sessionDate = new Date(startDate.getTime() + i * 86400000);
      const isPresent = i < s.attendanceCount;
      const status = isPresent ? (i % 7 === 0 ? "LATE" : "PRESENT") : "ABSENT";
      const remarks = status === "LATE" ? "Joined 10 mins late" : status === "ABSENT" ? "Informed leave / medical" : "Attended full session";

      await prisma.attendanceRecord.create({
        data: {
          studentId: student.id,
          sessionNumber: i + 1,
          date: sessionDate,
          topic: sessionTopics[i] || `OJT Session ${i + 1}`,
          status,
          remarks,
        },
      });
    }

    // Create Assignments
    const assignments = [
      {
        name: "Assignment 1: Responsive Portfolio Website",
        description: "Build and deploy a mobile-first developer portfolio with dark mode and contact form.",
        dueDate: new Date("2026-08-07"),
        submittedDate: new Date("2026-08-06"),
        submissionLink: `https://github.com/${s.fullName.toLowerCase().replace(" ", "")}/portfolio`,
        status: "VERIFIED",
        verificationStatus: "VERIFIED",
        remarks: "Excellent layout and fast loading speed.",
      },
      {
        name: "Assignment 2: Full-Stack Auth & CRUD Application",
        description: "Implement secure user authentication, role-based dashboards, and Prisma CRUD operations.",
        dueDate: new Date("2026-08-14"),
        submittedDate: new Date("2026-08-13"),
        submissionLink: `https://github.com/${s.fullName.toLowerCase().replace(" ", "")}/auth-crud`,
        status: "VERIFIED",
        verificationStatus: "VERIFIED",
        remarks: "Password hashing and session cookies properly implemented.",
      },
      {
        name: "Assignment 3: Client Proposal & Mock Bidding Campaign",
        description: "Draft 5 personalized Freelancer.com proposals matching different client project briefs.",
        dueDate: new Date("2026-08-21"),
        submittedDate: s.bids >= 50 ? new Date("2026-08-20") : null,
        submissionLink: s.bids >= 50 ? `https://docs.google.com/document/d/sample-${student.id}` : null,
        status: s.bids >= 50 ? "VERIFIED" : "PENDING",
        verificationStatus: s.bids >= 50 ? "VERIFIED" : "PENDING",
        remarks: s.bids >= 50 ? "High conversion value propositions and clear pricing breakdown." : "Awaiting submission.",
      },
      {
        name: "Assignment 4: Capstone Project Verification & Deployment",
        description: "Deploy final project on Vercel with custom domain, database pooling, and README documentation.",
        dueDate: new Date("2026-08-28"),
        submittedDate: s.ojtStatus === "COMPLETED" ? new Date("2026-08-27") : null,
        submissionLink: s.project.githubUrl,
        status: s.ojtStatus === "COMPLETED" ? "VERIFIED" : "PENDING",
        verificationStatus: s.ojtStatus === "COMPLETED" ? "VERIFIED" : "PENDING",
        remarks: s.ojtStatus === "COMPLETED" ? "Fully deployed and verified by Admin." : "In progress.",
      },
    ];

    for (const a of assignments) {
      await prisma.assignment.create({
        data: {
          studentId: student.id,
          name: a.name,
          description: a.description,
          dueDate: a.dueDate,
          submittedDate: a.submittedDate,
          submissionLink: a.submissionLink,
          status: a.status,
          verificationStatus: a.verificationStatus,
          remarks: a.remarks,
        },
      });
    }

    // Create Documents
    const docs = [
      {
        type: "OFFER_LETTER",
        title: "K3 Studio 30-Day OJT Offer Letter",
        status: "ISSUED",
        issuedDate: new Date("2026-08-01"),
        documentNumber: `K3-OJT-2026-OL-${s.rollNumber}`,
        remarks: "Signed and issued on induction day.",
      },
      {
        type: "INTERNSHIP_CERTIFICATE",
        title: "Certificate of Internship Completion",
        status: s.ojtStatus === "COMPLETED" ? "ISSUED" : "NOT_ISSUED",
        issuedDate: s.ojtStatus === "COMPLETED" ? new Date("2026-08-30") : null,
        documentNumber: s.ojtStatus === "COMPLETED" ? `K3-CERT-2026-${s.rollNumber}` : null,
        remarks: s.ojtStatus === "COMPLETED" ? "Full requirements met and verified." : "Pending final requirements.",
      },
      {
        type: "COMPLETION_LETTER",
        title: "Official OJT Completion & Recommendation Letter",
        status: s.ojtStatus === "COMPLETED" ? "ISSUED" : "NOT_ISSUED",
        issuedDate: s.ojtStatus === "COMPLETED" ? new Date("2026-08-30") : null,
        documentNumber: s.ojtStatus === "COMPLETED" ? `K3-COMP-2026-${s.rollNumber}` : null,
        remarks: s.ojtStatus === "COMPLETED" ? "Recommended for Junior Fullstack Developer roles." : null,
      },
      {
        type: "OJT_DOCUMENTS",
        title: "OJT Assessment & Performance Report",
        status: s.ojtStatus === "COMPLETED" ? "ISSUED" : "NOT_ISSUED",
        issuedDate: s.ojtStatus === "COMPLETED" ? new Date("2026-08-30") : null,
        documentNumber: `K3-REP-2026-${s.rollNumber}`,
        remarks: "Comprehensive attendance and bid log archive.",
      },
    ];

    for (const doc of docs) {
      await prisma.document.create({
        data: {
          studentId: student.id,
          type: doc.type,
          title: doc.title,
          status: doc.status,
          issuedDate: doc.issuedDate,
          documentNumber: doc.documentNumber,
          remarks: doc.remarks,
        },
      });
    }

    // Activity Logs
    await prisma.activityLog.create({
      data: {
        studentId: student.id,
        action: "ENROLLMENT",
        adminName: "Piyush Gupta",
        description: `Piyush Gupta enrolled ${s.fullName} (${s.rollNumber}) in 30-Day OJT Cohort.`,
        createdAt: new Date("2026-08-01T09:00:00Z"),
      },
    });

    if (s.freelancer.bidsCompleted >= 100) {
      await prisma.activityLog.create({
        data: {
          studentId: student.id,
          action: "MILESTONE_100_BIDS",
          adminName: "Piyush Gupta",
          description: `Piyush Gupta marked Freelancer milestone: ${s.fullName} completed 100/100 Bids target!`,
          createdAt: new Date(Date.now() - 4 * 86400000),
        },
      });
    }

    if (s.project.verificationStatus === "VERIFIED") {
      await prisma.activityLog.create({
        data: {
          studentId: student.id,
          action: "VERIFY_PROJECT",
          adminName: "Piyush Gupta",
          description: `Piyush Gupta verified ${s.fullName}'s capstone project "${s.project.projectName}".`,
          createdAt: s.project.verifiedAt || new Date(),
        },
      });
    }

    if (s.ojtStatus === "COMPLETED") {
      await prisma.activityLog.create({
        data: {
          studentId: student.id,
          action: "ISSUE_CERTIFICATE",
          adminName: "Piyush Gupta",
          description: `Piyush Gupta generated and issued Internship Completion Certificate for ${s.fullName}.`,
          createdAt: new Date(Date.now() - 1 * 86400000),
        },
      });
    }
  }

  console.log("Database seeded successfully with 8 realistic OJT students and rich historical records!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
