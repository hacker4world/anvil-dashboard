import { z } from "zod";

export const createUnitSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
});

export type CreateUnitFormData = z.infer<typeof createUnitSchema>;

export const updateUnitSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
});

export type UpdateUnitFormData = z.infer<typeof updateUnitSchema>;
