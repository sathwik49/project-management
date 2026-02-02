import * as z from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});

export type signUpInputType = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});

export type signInInputType = z.infer<typeof signInSchema>;
