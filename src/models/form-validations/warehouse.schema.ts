import { z } from "zod";

export const createWarehouseSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
});

export type CreateWarehouseFormData = z.infer<typeof createWarehouseSchema>;

export const updateWarehouseSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
});

export type UpdateWarehouseFormData = z.infer<typeof updateWarehouseSchema>;
