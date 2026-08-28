import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearData() {
  console.log("Clearing all mock data...");

  await prisma.activityLog.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.attendanceRecord.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.freelancerTracking.deleteMany({});
  await prisma.student.deleteMany({});

  console.log("All mock data deleted successfully. Fresh clean sheet ready!");
}

clearData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
