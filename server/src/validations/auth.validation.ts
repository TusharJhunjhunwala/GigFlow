import { z } from "zod";
import { userRoles } from "../models/User";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
    email: z.email("Invalid email address").toLowerCase(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(userRoles).default("sales")
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address").toLowerCase(),
    password: z.string().min(1, "Password is required")
  })
});
