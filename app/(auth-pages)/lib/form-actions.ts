"use server";


import { signUpFormSchema, LoginSchema } from "./form-schema";
import z from "zod";
import { signIn, signOut } from "../auth";
import { AuthError } from "next-auth";
import { CreateNewUser, getUserByEmail } from "@/app/lib/users";
import { FormState } from "@/app/components/auth/auth-form";

export async function handleLoginUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const userData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    await LoginSchema.parseAsync(userData);

    await signIn("credentials", {
      ...userData,
      redirect: false,
      redirectTo: "/",
    });

    return { success: true };
  } catch (err) {
    console.log(err);
    if (err instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      Object.entries(err.flatten().fieldErrors).forEach(([field, messages]) => {
        if (messages && messages.length > 0) {
          fieldErrors[field] = messages[0];
        }
      });
      return {
        success: false,
        errors: fieldErrors,
      };
    } else if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return {
            success: false,
            errors: {
              general: "Invalid credentials, please try again",
            },
          };
      }
    }
  }
  return {
    success: false,
    errors: {
      general: "Something went wrong",
    },
  };
}

export async function handleSignUpUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const userData = {
      fullname: formData.get("fullname"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmpassword: formData.get("confirmpassword"),
    };

    await signUpFormSchema.parseAsync(userData);
    const userExists = await getUserByEmail(userData.email as string);

    if (userExists)
      return {
        success: false,
        errors: {
          general: "Email already registered. Please log in.",
        },
      };

    await CreateNewUser(userData);

    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};

      Object.entries(err.flatten().fieldErrors).forEach(([field, messages]) => {
        if (messages && messages.length > 0) {
          fieldErrors[field] = messages[0];
        }
      });

      return {
        success: false,
        errors: fieldErrors,
      };
    }

    return {
      success: false,
      errors: {
        general: "Something went wrong",
      },
    };
  }
}
