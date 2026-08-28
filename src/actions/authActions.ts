"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const PRIMARY_EMAIL = "piyush@gmail.com";
const PRIMARY_PASSWORD = "Piyush71@";
const PRIMARY_NAME = "Piyush Gupta";

export async function ensureDefaultAdmin() {
  try {
    const existing = await prisma.user.findUnique({
      where: { email: PRIMARY_EMAIL },
    });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(PRIMARY_PASSWORD, salt);

    if (!existing) {
      await prisma.user.create({
        data: {
          email: PRIMARY_EMAIL,
          name: PRIMARY_NAME,
          passwordHash: hash,
          role: "ADMIN",
          organization: "K3 Studio",
        },
      });
    } else {
      // Update password hash if needed
      await prisma.user.update({
        where: { email: PRIMARY_EMAIL },
        data: { passwordHash: hash },
      });
    }
  } catch (err) {
    console.error("Error ensuring default admin user:", err);
  }
}

export async function loginAction(formData: { email: string; password: string }) {
  const email = formData.email.trim().toLowerCase();
  const password = formData.password.trim();

  if (!email || !password) {
    return { success: false, error: "Please enter your email and password." };
  }

  // Ensure default credentials exist in DB
  await ensureDefaultAdmin();

  // Check against primary credentials directly or DB
  const isPrimary = email === PRIMARY_EMAIL && password === PRIMARY_PASSWORD;

  if (!isPrimary) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, error: "Invalid email or password." };
    }
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: "Invalid email or password." };
    }
  }

  // Set auth cookie
  const cookieStore = await cookies();
  cookieStore.set("admin_session", email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  revalidatePath("/");
  return { success: true };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  revalidatePath("/");
  redirect("/login");
}
