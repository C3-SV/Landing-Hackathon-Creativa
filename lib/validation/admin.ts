import { z } from "zod";
import { REGISTRATION_STATUS_VALUES } from "@/lib/types/domain";

const REGISTRATION_SORT_VALUES = [
  "createdAt",
  "teamName",
  "institution",
  "status",
  "teamSize",
  "assignedChallenge",
  "preferredChallenge",
] as const;

export const registrationFiltersSchema = z.object({
  query: z.string().trim().optional(),
  status: z.enum(REGISTRATION_STATUS_VALUES).optional(),
  institution: z.string().trim().optional(),
  preferredChallenge: z.string().trim().optional(),
  assignedChallenge: z.string().trim().optional(),
  teamSize: z.coerce.number().pipe(z.union([z.literal(3), z.literal(4)])).optional(),
  sortBy: z.enum(REGISTRATION_SORT_VALUES).optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
});

export const adminUpdateRegistrationSchema = z
  .object({
    status: z.enum(REGISTRATION_STATUS_VALUES).optional(),
    note: z.string().trim().min(1).max(500).optional(),
    assignedChallengeId: z.string().trim().nullable().optional(),
  })
  .refine((value) => (
    value.status !== undefined ||
    value.note !== undefined ||
    Object.prototype.hasOwnProperty.call(value, "assignedChallengeId")
  ), {
    message: "Debes enviar al menos un cambio",
  });
