import { z } from "zod";

export const createFamilySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
});

export type CreateFamilyFormData = z.infer<typeof createFamilySchema>;

export const updateFamilySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
});

export type UpdateFamilyFormData = z.infer<typeof updateFamilySchema>;
