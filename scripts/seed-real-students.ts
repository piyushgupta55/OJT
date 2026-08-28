import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const realStudents = [
  { fullName: "Anushka Gupta", rollNumber: "2406085", division: "Division B" },
  { fullName: "Trrishvin Tethi", rollNumber: "2406135", division: "Division B" },
  { fullName: "Muhammed Bhoraniya", rollNumber: "2406004", division: "Division A" },
  { fullName: "Purshottam Choudhary", rollNumber: "2406081", division: "Division B" },
  { fullName: "Pradeep Choudhary", rollNumber: "2406080", division: "Division B" },
  { fullName: "Devesh Bhul", rollNumber: "2406075", division: "Division B" },
  { fullName: "Khushi Jaria", rollNumber: "2526002", division: "Division B" },
  { fullName: "Aman Choudhary", rollNumber: "2406082", division: "Division B" },
  { fullName: "Ritik Tiwari", rollNumber: "2406138", division: "Division B" },
  { fullName: "Ayushi Babwani", rollNumber: "2526003", division: "Division B" },
  { fullName: "Pradum Chauhan", rollNumber: "2406006", division: "Division A" },
  { fullName: "Kartik Sharma", rollNumber: "2406124", division: "Division B" },
  { fullName: "Neil Kesarkar", rollNumber: "2406093", division: "Division B" },
  { fullName: "Tejaswi Mudras", rollNumber: "2406023", division: "Division A" },
  { fullName: "Himanshu Chaphekar", rollNumber: "2406005", division: "Division A" },
  { fullName: "Shubham Ambre", rollNumber: "2406001", division: "Division A" },
  { fullName: "Ankita Rajbhar", rollNumber: "2406037", division: "Division A" },
  { fullName: "Rohit Rajbhar", rollNumber: "2406036", division: "Division A" },
  { fullName: "Anwar Khan", rollNumber: "2406094", division: "Division B" },
  { fullName: "Aryan Warik", rollNumber: "2406141", division: "Division B" },
  { fullName: "Sairaj Pansare", rollNumber: "2406028", division: "Division A" },
  { fullName: "Swayam Singh", rollNumber: "2406128", division: "Division B" },
  { fullName: "Soham Naik", rollNumber: "2406024", division: "Division A" },
  { fullName: "Rahul Bera", rollNumber: "2406074", division: "Division B" },
  { fullName: "Gautam Sarki", rollNumber: "2406118", division: "Division B" },
  { fullName: "Pratham Desai", rollNumber: "2406083", division: "Division B" },
  { fullName: "Mayank Pal", rollNumber: "2406101", division: "Division B" },
  { fullName: "Gaurav Pillai", rollNumber: "2406110", division: "Division B" },
  { fullName: "Ayaan Shaikh", rollNumber: "2406120", division: "Division B" },
  { fullName: "Manshab Tazak", rollNumber: "2406134", division: "Division B" },
  { fullName: "Parmeshwar Narhare", rollNumber: "2406025", division: "Division A" },
  { fullName: "Purvi Batwar", rollNumber: "2406002", division: "Division A" },
  { fullName: "Ayush Gurav", rollNumber: "2406089", division: "Division B" },
  { fullName: "Abhishek Singh", rollNumber: "2406132", division: "Division B" },
];

async function seedRealStudents() {
  console.log(`Seeding ${realStudents.length} real students...`);

  // Clear previous data
  await prisma.activityLog.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.attendanceRecord.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.freelancerTracking.deleteMany({});
  await prisma.student.deleteMany({});

  const startDate = new Date("2026-08-01");
  const endDate = new Date("2026-08-30");

  for (const s of realStudents) {
    const student = await prisma.student.create({
      data: {
        fullName: s.fullName,
        rollNumber: s.rollNumber,
        division: s.division,
        college: "Engineering College",
        branch: "Computer Engineering",
        email: `${s.rollNumber}@student.k3studio.com`,
        phoneNumber: "+91 98000 00000",
        startDate,
        endDate,
        durationDays: 30,
        ojtStatus: "ONGOING",
        codingVideosCompleted: true,
        clientCommunicationTraining: true,
        freelancingTraining: true,
        projectManagementTraining: true,
      },
    });

    // Freelancer Tracking
    await prisma.freelancerTracking.create({
      data: {
        studentId: student.id,
        bidsCompleted: 0,
        targetBids: 100,
        taskStatus: "IN_PROGRESS",
        planType: "FREE",
        accountCreated: true,
      },
    });

    // Capstone Project
    await prisma.project.create({
      data: {
        studentId: student.id,
        projectName: "Full-Stack Web App",
        technologyUsed: "Next.js, TypeScript, Tailwind CSS",
        status: "IN_PROGRESS",
        verificationStatus: "PENDING",
      },
    });

    // Default 25 sessions attendance
    for (let i = 1; i <= 25; i++) {
      await prisma.attendanceRecord.create({
        data: {
          studentId: student.id,
          sessionNumber: i,
          date: new Date(startDate.getTime() + (i - 1) * 86400000),
          topic: `Session ${i}: OJT Practical Workshop`,
          status: "PRESENT",
        },
      });
    }

    // Default Certificate & Offer Letter records
    await prisma.document.create({
      data: {
        studentId: student.id,
        type: "INTERNSHIP_CERTIFICATE",
        title: "Certificate of Internship Completion",
        status: "NOT_ISSUED",
        documentNumber: `K3-CERT-2026-${s.rollNumber}`,
      },
    });

    await prisma.document.create({
      data: {
        studentId: student.id,
        type: "OFFER_LETTER",
        title: "K3 Studio OJT Offer Letter",
        status: "ISSUED",
        issuedDate: new Date(),
        documentNumber: `K3-OL-2026-${s.rollNumber}`,
      },
    });
  }

  console.log(`Successfully imported all ${realStudents.length} real students!`);
}

seedRealStudents()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
