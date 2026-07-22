import { z } from "zod";

export const updateSubfamilySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  familyId: z.union([z.string().min(1, "La famille est requise"), z.number()]),
});

export type UpdateSubfamilyFormData = z.infer<typeof updateSubfamilySchema>;
