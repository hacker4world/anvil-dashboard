import { z } from "zod";

export const createSiteSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  managerId: z.number({ required_error: "Le responsable est requis" }),
});

export type CreateSiteFormData = z.infer<typeof createSiteSchema>;

export const updateSiteSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  managerId: z.number({ required_error: "Le responsable est requis" }),
});

export type UpdateSiteFormData = z.infer<typeof updateSiteSchema>;