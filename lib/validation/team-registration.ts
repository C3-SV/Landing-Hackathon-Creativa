import { z } from "zod";
import { ROLE3H_VALUES } from "@/lib/types/domain";

const ABOUT_MIN_WORDS = 50;
const ABOUT_MAX_WORDS = 100;

export function countWords(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((value) => (value?.trim() ? value.trim() : undefined))
  .refine((value) => !value || /^https?:\/\/\S+$/i.test(value), {
    message: "Debe ser una URL válida con http:// o https://",
  });

const optionalText = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((value) => (value?.trim() ? value.trim() : undefined));

const representativeFlagSchema = z.preprocess(
  (value) => value === true || value === "true" || value === "on",
  z.boolean(),
);

const aboutSchema = z
  .string()
  .trim()
  .min(1, "Cuéntanos de ti para conocerte mejor")
  .superRefine((value, ctx) => {
    const words = countWords(value);
    if (words < ABOUT_MIN_WORDS || words > ABOUT_MAX_WORDS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Escribe entre ${ABOUT_MIN_WORDS} y ${ABOUT_MAX_WORDS} palabras`,
      });
    }
  });

export const memberSchema = z.object({
  role3H: z.enum(ROLE3H_VALUES),
  isRepresentative: representativeFlagSchema,
  firstName: z.string().trim().min(1, "Nombre es obligatorio"),
  lastName: z.string().trim().min(1, "Apellido es obligatorio"),
  preferredName: optionalText,
  email: z.string().trim().email("Email inválido"),
  phone: z.string().trim().min(7, "Teléfono requerido"),
  affiliationType: z.string().trim().min(1, "Tipo de afiliación requerido"),
  institution: z.string().trim().min(1, "Institución requerida"),
  degreeOrMajor: z.string().trim().min(1, "Área o carrera requerida"),
  about: aboutSchema,
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
  portfolioUrl: optionalUrl,
});

export const teamConsentsSchema = z.object({
  acceptCodeOfConduct: z.boolean().default(false),
  acceptPrivacyPolicy: z.boolean().default(false),
  mediaConsent: z.boolean().default(false),
  dataSharingConsent: z.boolean().default(false),
  authorizationDeclaration: z.boolean().refine((value) => value, {
    message: "Debes confirmar autorización del equipo",
  }),
});

export const teamRegistrationFormSchema = z
  .object({
    editionId: z.string().trim().min(1),
    teamSize: z.coerce
      .number()
      .refine((value): value is 3 | 4 => value === 3 || value === 4, {
        message: "El tamaño del equipo debe ser 3 o 4",
      }),
    teamName: z.string().trim().min(1, "Nombre del equipo obligatorio"),
    institution: z.string().trim().min(1, "Institución obligatoria"),
    teamDescription: optionalText,
    challengePreferences: z
      .array(z.string().trim().min(1))
      .length(3, "Debes seleccionar 3 retos")
      .refine((values) => {
        const nonEmpty = values.filter(Boolean);
        return new Set(nonEmpty).size === nonEmpty.length;
      }, "No puedes repetir retos en tus preferencias"),
    source: z.string().trim().min(1, "Campo requerido"),
    hacker: memberSchema.extend({ role3H: z.literal("hacker") }),
    hipster: memberSchema.extend({ role3H: z.literal("hipster") }),
    hustler: memberSchema.extend({ role3H: z.literal("hustler") }),
    extraMember: memberSchema.optional(),
    consents: teamConsentsSchema,
  })
  .superRefine((data, ctx) => {
    const members =
      data.teamSize === 4
        ? [data.hacker, data.hipster, data.hustler, data.extraMember]
        : [data.hacker, data.hipster, data.hustler];

    if (data.teamSize === 4 && !data.extraMember) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Debes completar el integrante extra cuando el equipo es de 4",
        path: ["extraMember"],
      });
      return;
    }

    const cleanMembers = members.filter(
      (member): member is (typeof members)[number] & NonNullable<typeof member> =>
        Boolean(member),
    );
    const memberEmails = cleanMembers.map((member) => member.email.toLowerCase());

    if (new Set(memberEmails).size !== memberEmails.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "No puedes repetir emails entre integrantes",
        path: ["hacker", "email"],
      });
    }

    const representatives = cleanMembers.filter((member) => member.isRepresentative);
    if (representatives.length !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Debes marcar exactamente un representante del equipo",
        path: ["teamSize"],
      });
    }

    const rolesPresent = new Set(cleanMembers.map((member) => member.role3H));
    for (const role of ROLE3H_VALUES) {
      if (!rolesPresent.has(role)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El equipo debe incluir al menos un Hacker, Hipster y Hustler",
          path: ["teamSize"],
        });
        break;
      }
    }
  });

export const teamRegistrationPayloadSchema = teamRegistrationFormSchema.transform(
  (data) => ({
    editionId: data.editionId,
    teamSize: data.teamSize as 3 | 4,
    teamName: data.teamName,
    institution: data.institution,
    teamDescription: data.teamDescription,
    challengePreferences: data.challengePreferences as [string, string, string],
    source: data.source,
    members:
      data.teamSize === 4 && data.extraMember
        ? [data.hacker, data.hipster, data.hustler, data.extraMember]
        : [data.hacker, data.hipster, data.hustler],
    consents: data.consents,
  }),
);

export type TeamRegistrationFormValues = z.input<typeof teamRegistrationFormSchema>;
export type TeamRegistrationPayloadInput = z.output<
  typeof teamRegistrationPayloadSchema
>;

