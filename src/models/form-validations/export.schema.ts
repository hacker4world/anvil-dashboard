import { z } from "zod";

export const ExportTypeEnum = z.enum([
  "to-warehouse",
  "to-construction-site",
  "external",
]);

export type ExportType = z.infer<typeof ExportTypeEnum>;

export const exportItemSchema = z.object({
  productId: z.coerce
    .number({
      required_error: "Le produit est requis",
      invalid_type_error: "Le produit est requis",
    })
    .min(1, "Le produit est requis"),
  exitedStock: z
    .string()
    .min(1, "Le stock sorti est requis")
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

export const createExportSchema = z
  .object({
    date: z.string().min(1, "La date est requise"),
    observation: z.string().optional(),
    exportType: ExportTypeEnum,
    warehouseId: z.coerce.number().optional(),
    constructionSiteId: z.coerce.number().optional(),
    // ── External export fields ──────────────────────────
    clientName: z.string().optional(),
    entrepriseName: z.string().optional(),
    entrepriseAddress: z.string().optional(),
    matriculeFiscale: z.string().optional(),
    withTransporter: z.boolean().default(false),
    transporterName: z.string().optional(),
    transporterMatricule: z.string().optional(),
    // ── Products ────────────────────────────────────────
    exportItems: z
      .array(exportItemSchema)
      .min(1, "Au moins un produit est requis"),
  })
  .superRefine((data, ctx) => {
    if (data.exportType === "to-warehouse") {
      if (!data.warehouseId || data.warehouseId < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Le dépôt est requis pour une sortie interne vers dépôt",
          path: ["warehouseId"],
        });
      }
    }

    if (data.exportType === "to-construction-site") {
      if (!data.constructionSiteId || data.constructionSiteId < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Le chantier est requis pour une sortie interne vers chantier",
          path: ["constructionSiteId"],
        });
      }
    }

    // ── External type validation ─────────────────────────
    if (data.exportType === "external") {
      if (!data.clientName || data.clientName.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Le nom du client est requis pour une sortie externe",
          path: ["clientName"],
        });
      }
      if (!data.entrepriseName || data.entrepriseName.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Le nom de l'entreprise est requis pour une sortie externe",
          path: ["entrepriseName"],
        });
      }
      if (!data.entrepriseAddress || data.entrepriseAddress.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "L'adresse de l'entreprise est requise pour une sortie externe",
          path: ["entrepriseAddress"],
        });
      }
      if (!data.matriculeFiscale || data.matriculeFiscale.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La matricule fiscale est requise pour une sortie externe",
          path: ["matriculeFiscale"],
        });
      }
      if (data.withTransporter) {
        if (!data.transporterName || data.transporterName.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Le nom du transporteur est requis",
            path: ["transporterName"],
          });
        }
        if (
          !data.transporterMatricule ||
          data.transporterMatricule.trim() === ""
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "La matricule fiscale du transporteur est requise",
            path: ["transporterMatricule"],
          });
        }
      }
    }
  });

export type ExportItemFormData = z.infer<typeof exportItemSchema>;
export type CreateExportFormData = z.infer<typeof createExportSchema>;
