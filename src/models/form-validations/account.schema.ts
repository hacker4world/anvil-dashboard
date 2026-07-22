import { z } from "zod";
import { AccountRole } from "../Account.model";

export const createAccountSchema = z.object({
  firstname: z.string().min(1, "Le prénom est requis"),
  lastname: z.string().min(1, "Le nom est requis"),
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export type CreateAccountFormData = z.infer<typeof createAccountSchema>;

// ... keep existing updateVerifiedAccountSchema below
export const updateVerifiedAccountSchema = z.object({
  firstname: z.string().min(1, "Le prénom est requis"),
  lastname: z.string().min(1, "Le nom est requis"),
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  role: z.nativeEnum(AccountRole, {
    errorMap: () => ({ message: "Le rôle est requis" }),
  }),
});

export type UpdateVerifiedAccountFormData = z.infer<
  typeof updateVerifiedAccountSchema
>;
