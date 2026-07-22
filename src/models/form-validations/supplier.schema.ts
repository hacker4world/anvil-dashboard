import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  contact: z.string().min(1, "Le contact est requis"),
});

export type CreateSupplierFormData = z.infer<typeof createSupplierSchema>;

export const updateSupplierSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  contact: z.string().min(1, "Le contact est requis"),
});

export type UpdateSupplierFormData = z.infer<typeof updateSupplierSchema>;
