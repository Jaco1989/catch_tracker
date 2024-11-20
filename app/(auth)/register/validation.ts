// @/lib/validation.ts
import * as z from "zod";

// Define the UserRole enum type
export const UserRole = {
  USER: "USER",
  SYSTEMADMINISTRATOR: "SYSTEMADMINISTRATOR",
  SECURITYADMINISTRATOR: "SECURITYADMINISTRATOR",
  PERMITADMINISTRATOR: "PERMITADMINISTRATOR",
  PERMITHOLDER: "PERMITHOLDER",
  RIGHTSHOLDER: "RIGHTSHOLDER",
  SKIPPER: "SKIPPER",
  INSPECTOR: "INSPECTOR",
  MONITOR: "MONITOR",
  DRIVER: "DRIVER",
  FACTORYSTOCKCONTROLLER: "FACTORYSTOCKCONTROLLER",
  LOCALOUTLETCONTROLLER: "LOCALOUTLETCONTROLLER",
  EXPORTCONTROLLER: "EXPORTCONTROLLER",
} as const;

// Create the proper type for user roles
export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

// Create the array of user roles
export const userRoles = Object.values(UserRole);

// Create the Zod enum for validation
export const UserRoleEnum = z.enum([
  "USER",
  "SYSTEMADMINISTRATOR",
  "SECURITYADMINISTRATOR",
  "PERMITADMINISTRATOR",
  "PERMITHOLDER",
  "RIGHTSHOLDER",
  "SKIPPER",
  "INSPECTOR",
  "MONITOR",
  "DRIVER",
  "FACTORYSTOCKCONTROLLER",
  "LOCALOUTLETCONTROLLER",
  "EXPORTCONTROLLER",
] as const);

// Registration schema
export const registerSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
    roleApplication: UserRoleEnum,
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
