import { z } from "zod";

export const createManufacturerSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  contact: z.string().min(1, "Le contact est requis"),
});

export type CreateManufacturerFormData = z.infer<
  typeof createManufacturerSchema
>;

export const updateManufacturerSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  contact: z.string().min(1, "Le contact est requis"),
});

export type UpdateManufacturerFormData = z.infer<
  typeof updateManufacturerSchema
>;
