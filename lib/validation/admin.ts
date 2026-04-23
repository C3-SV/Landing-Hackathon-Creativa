import { z } from "zod";
import { REGISTRATION_STATUS_VALUES } from "@/lib/types/domain";

export const registrationFiltersSchema = z.object({
  query: z.string().trim().optional(),
  status: z.enum(REGISTRATION_STATUS_VALUES).optional(),
  institution: z.string().trim().optional(),
  preferredChallenge: z.string().trim().optional(),
});

export const adminUpdateRegistrationSchema = z
  .object({
    status: z.enum(REGISTRATION_STATUS_VALUES).optional(),
    note: z.string().trim().max(500).optional(),
    assignedChallengeId: z.string().trim().optional(),
  })
  .refine((value) => value.status || value.note || value.assignedChallengeId, {
    message: "Debes enviar al menos un cambio",
  });
