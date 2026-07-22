import { z } from "zod";

export const importItemSchema = z.object({
  productId: z.coerce
    .number({
      required_error: "Le produit est requis",
      invalid_type_error: "Le produit est requis",
    })
    .min(1, "Le produit est requis"),
  enteredStock: z
    .string()
    .min(1, "Le stock entré est requis")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Le stock doit être un nombre positif",
    }),
  unitPrice: z
    .string()
    .min(1, "Le prix unitaire est requis")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Le prix unitaire doit être un nombre positif",
    }),
});

export const createImportSchema = z.object({
  date: z.string().min(1, "La date est requise"),
  observation: z.string().optional(),
  supplierId: z.coerce
    .number({
      required_error: "Le fournisseur est requis",
      invalid_type_error: "Le fournisseur est requis",
    })
    .min(1, "Le fournisseur est requis"),
  manufacturerId: z.coerce
    .number({
      required_error: "Le fabricant est requis",
      invalid_type_error: "Le fabricant est requis",
    })
    .min(1, "Le fabricant est requis"),
  importItems: z
    .array(importItemSchema)
    .min(1, "Au moins un produit est requis"),
});

export type ImportItemFormData = z.infer<typeof importItemSchema>;
export type CreateImportFormData = z.infer<typeof createImportSchema>;
