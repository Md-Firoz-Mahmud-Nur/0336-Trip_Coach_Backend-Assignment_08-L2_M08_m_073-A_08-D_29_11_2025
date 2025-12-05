import z from "zod";
import { Role } from "./user.interface";

export const createZodSchema = z.object({
  name: z
    .string({
      error: (err) => {
        if (err.code === "invalid_type") {
          return "Name must be string";
        }
      },
    })
    .min(3, { message: "Name too short, enter at least 3 character" })
    .max(50, { message: "Name too long, enter at most 50 character" }),

  email: z
    .string()
    .email({ message: "Enter a valid email" })
    .min(5, { message: "Email must be at least 5 characters long." })
    .max(100, { message: "Email cannot exceed 100 characters." }),

  password: z
    .string({
      error: (err) => {
        if (err.code === "invalid_type") {
          return "Password must be string";
        }
      },
    })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    }),

  role: z.enum(Object.values(Role) as [string]).optional(),
});

export const updateUserZodSchema = z
  .object({
    name: z
      .string({
        error: (err) => {
          if (err.code === "invalid_type") {
            return "Name must be string";
          }
        },
      })
      .min(3, { message: "Name must be at least 3 characters long." })
      .max(50, { message: "Name cannot exceed 50 characters." })
      .optional(),

    role: z.enum(Object.values(Role) as [string]).optional(),

    picture: z.string({ message: "Picture must be a string" }).optional(),

    isDeleted: z
      .boolean({
        error: (err) => {
          if (err.code === "invalid_type") {
            return "isDeleted must be true or false";
          }
        },
      })
      .optional(),
    isVerified: z
      .boolean({
        error: (err) => {
          if (err.code === "invalid_type") {
            return "isVerified must be true or false";
          }
        },
      })
      .optional(),
    isBlocked: z
      .boolean({
        error: (err) => {
          if (err.code === "invalid_type") {
            return "isBlocked must be true or false";
          }
        },
      })
      .optional(),
  })
  .strict();
