import { cookies } from "next/headers";
import { prisma } from "./prisma";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  avatarUrl?: string | null;
}

export async function getAdminSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionEmail = cookieStore.get("admin_session")?.value;

    if (!sessionEmail) {
      return null;
    }

    const admin = await prisma.user.findUnique({
      where: { email: sessionEmail },
    });

    if (admin) {
      return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        organization: admin.organization,
        avatarUrl: admin.avatarUrl,
      };
    }

    // Fallback if session matches default admin email
    if (sessionEmail === "piyush@gmail.com") {
      return {
        id: "admin-piyush-001",
        name: "Piyush Gupta",
        email: "piyush@gmail.com",
        role: "ADMIN",
        organization: "K3 Studio",
        avatarUrl: null,
      };
    }
  } catch (error) {
    console.error("Session lookup error:", error);
  }

  return null;
}
