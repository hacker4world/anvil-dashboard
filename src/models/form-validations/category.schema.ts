import { z } from "zod";

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  subfamilyId: z.union([
    z.string().min(1, "La sous-famille est requise"),
    z.number(),
  ]),
});

export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
