import { z } from "zod";
import { ROLE3H_VALUES } from "@/lib/types/domain";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((value) => (value?.trim() ? value.trim() : undefined))
  .refine((value) => !value || /^https?:\/\/\S+$/i.test(value), {
    message: "Debe ser una URL válida con http:// o https://",
  });

export const memberSchema = z.object({
  role3H: z.enum(ROLE3H_VALUES),
  firstName: z.string().trim().min(1, "Nombre es obligatorio"),
  lastName: z.string().trim().min(1, "Apellido es obligatorio"),
  preferredName: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
  email: z.string().trim().email("Email inválido"),
  phone: z.string().trim().min(7, "Teléfono requerido"),
  affiliationType: z.string().trim().min(1, "Tipo de afiliación requerido"),
  institution: z.string().trim().min(1, "Institución requerida"),
  degreeOrMajor: z.string().trim().min(1, "Área o carrera requerida"),
  skillLevel: z.string().trim().min(1, "Nivel requerido"),
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
  portfolioUrl: optionalUrl,
  dietaryRestrictions: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
  allergies: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
  emergencyContactName: z
    .string()
    .trim()
    .min(1, "Contacto de emergencia requerido"),
  emergencyContactPhone: z
    .string()
    .trim()
    .min(7, "Teléfono de emergencia requerido"),
});

export const teamConsentsSchema = z.object({
  acceptCodeOfConduct: z.boolean().refine((value) => value, {
    message: "Debes aceptar el código de conducta",
  }),
  acceptPrivacyPolicy: z.boolean().refine((value) => value, {
    message: "Debes aceptar la política de privacidad",
  }),
  mediaConsent: z.boolean().default(false),
  dataSharingConsent: z.boolean().default(false),
  authorizationDeclaration: z.boolean().refine((value) => value, {
    message: "Debes confirmar autorización del equipo",
  }),
});

export const teamRegistrationFormSchema = z
  .object({
    editionId: z.string().trim().min(1),
    teamName: z.string().trim().min(1, "Nombre del equipo obligatorio"),
    institution: z.string().trim().min(1, "Institución obligatoria"),
    teamDescription: z
      .string()
      .trim()
      .optional()
      .or(z.literal(""))
      .transform((value) => (value?.trim() ? value.trim() : undefined)),
    challengePreferences: z
      .array(z.string().trim().min(1))
      .length(3, "Debes seleccionar 3 retos")
      .refine((values) => {
        const nonEmpty = values.filter(Boolean);
        return new Set(nonEmpty).size === nonEmpty.length;
      }, {
        message: "No puedes repetir retos en tus preferencias",
      }),
    responsibleName: z.string().trim().min(1, "Responsable obligatorio"),
    responsibleEmail: z.string().trim().email("Email inválido"),
    responsiblePhone: z.string().trim().min(7, "Teléfono requerido"),
    source: z.string().trim().min(1, "Campo requerido"),
    hacker: memberSchema.extend({ role3H: z.literal("hacker") }),
    hipster: memberSchema.extend({ role3H: z.literal("hipster") }),
    hustler: memberSchema.extend({ role3H: z.literal("hustler") }),
    consents: teamConsentsSchema,
  })
  .superRefine((data, ctx) => {
    const memberEmails = [data.hacker.email, data.hipster.email, data.hustler.email].map(
      (email) => email.toLowerCase(),
    );

    const nonEmptyMemberEmails = memberEmails.filter(Boolean);
    if (new Set(nonEmptyMemberEmails).size !== nonEmptyMemberEmails.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "No puedes repetir emails entre integrantes",
        path: ["hacker", "email"],
      });
    }

    if (
      data.responsibleEmail &&
      !memberEmails.includes(data.responsibleEmail.toLowerCase())
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "El correo del responsable debe coincidir con Hacker, Hipster o Hustler",
        path: ["responsibleEmail"],
      });
    }
  });

export const teamRegistrationPayloadSchema = teamRegistrationFormSchema.transform(
  (data) => ({
    editionId: data.editionId,
    teamName: data.teamName,
    institution: data.institution,
    teamDescription: data.teamDescription,
    challengePreferences: data.challengePreferences as [string, string, string],
    responsibleName: data.responsibleName,
    responsibleEmail: data.responsibleEmail,
    responsiblePhone: data.responsiblePhone,
    source: data.source,
    members: [data.hacker, data.hipster, data.hustler] as const,
    consents: data.consents,
  }),
);

export type TeamRegistrationFormValues = z.input<typeof teamRegistrationFormSchema>;
export type TeamRegistrationPayloadInput = z.output<
  typeof teamRegistrationPayloadSchema
>;
