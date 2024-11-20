"use server";

import prisma from "@/lib/prisma";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { RegisterFormValues, registerSchema } from "./validation";

export async function signUp(
  formData: RegisterFormValues
): Promise<{ error?: string } | never> {
  try {
    // Validate the form data
    const validatedData = registerSchema.parse(formData);

    // Generate user ID
    const userId = generateIdFromEntropySize(10);

    // Hash the password
    const passwordHash = await hash(validatedData.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    // Check for existing username
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: validatedData.username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return {
        error: "Username already taken",
      };
    }

    // Check for existing email
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: validatedData.email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return {
        error: "Email already taken",
      };
    }

    // Create the user in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          username: validatedData.username,
          email: validatedData.email,
          passwordHash,
          // Set initial values for required fields
          firstName: "", // These will be collected later
          lastName: "",
          displayName: validatedData.username, // Use username as initial display name
          streetAddress: "",
          townCity: "",
          postcode: "",
          country: "",
          agreeTerms: validatedData.agreeTerms,
          role: "USER", // Default role
          roleApplication: validatedData.roleApplication, // The role they're applying for
          // Optional fields can be left as their defaults
          phoneNumber: "",
          addressLine2: null,
          suburb: null,
          avatarUrl: null,
        },
      });
    });

    // Redirect to success page or pending approval page
    redirect("/register-pending-message");
  } catch (error) {
    if (isRedirectError(error)) throw error;

    console.error("Registration error:", error);

    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
