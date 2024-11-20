"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { verify } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginFormValues } from "./validation";

// Define the UserRole enum based on your schema
enum UserRole {
  USER = "USER",
  SYSTEMADMINISTRATOR = "SYSTEMADMINISTRATOR",
  SECURITYADMINISTRATOR = "SECURITYADMINISTRATOR",
  PERMITADMINISTRATOR = "PERMITADMINISTRATOR",
  PERMITHOLDER = "PERMITHOLDER",
  RIGHTSHOLDER = "RIGHTSHOLDER",
  SKIPPER = "SKIPPER",
  INSPECTOR = "INSPECTOR",
  MONITOR = "MONITOR",
  DRIVER = "DRIVER",
  FACTORYSTOCKCONTROLLER = "FACTORYSTOCKCONTROLLER",
  LOCALOUTLETCONTROLLER = "LOCALOUTLETCONTROLLER",
  EXPORTCONTROLLER = "EXPORTCONTROLLER",
}

// Define route resolvers for each role
const roleRoutes: Record<UserRole, string> = {
  [UserRole.USER]: "/register-pending-message",
  [UserRole.SYSTEMADMINISTRATOR]: "/system_admin",
  [UserRole.SECURITYADMINISTRATOR]: "/admin/security",
  [UserRole.PERMITADMINISTRATOR]: "/admin/permits",
  [UserRole.PERMITHOLDER]: "/dashboard/permits",
  [UserRole.RIGHTSHOLDER]: "/dashboard/rights",
  [UserRole.SKIPPER]: "/dashboard/skipper",
  [UserRole.INSPECTOR]: "/dashboard/inspector",
  [UserRole.MONITOR]: "/dashboard/monitor",
  [UserRole.DRIVER]: "/dashboard/driver",
  [UserRole.FACTORYSTOCKCONTROLLER]: "/dashboard/factory",
  [UserRole.LOCALOUTLETCONTROLLER]: "/dashboard/outlet",
  [UserRole.EXPORTCONTROLLER]: "/dashboard/export",
};

export async function login(
  credentials: LoginFormValues
): Promise<{ error?: string } | void> {
  try {
    const { email, password } = credentials;

    // Find user by email
    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (!existingUser || !existingUser.passwordHash) {
      return {
        error: "Invalid email or password",
      };
    }

    // Verify password
    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return {
        error: "Invalid email or password",
      };
    }

    const userRole = existingUser.role as UserRole;

    // Handle USER role differently - no session creation
    if (userRole === UserRole.USER) {
      return {
        error:
          "Your account is pending approval. Please wait for administrator review.",
      };
    }

    // For all other roles, create session and proceed
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // Handle routing based on user role
    const redirectPath = roleRoutes[userRole];

    if (!redirectPath) {
      console.error("No route defined for role:", userRole);
      return {
        error: "Unable to determine user access. Please contact support.",
      };
    }

    // Redirect to role-specific dashboard
    return redirect(redirectPath);
  } catch (error) {
    if (isRedirectError(error)) throw error;

    console.error("Login error:", error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}

// Helper type for the login response
export type LoginResponse = {
  error?: string;
  success?: boolean;
  redirectTo?: string;
};
