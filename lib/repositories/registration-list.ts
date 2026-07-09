import {
  ASSIGNED_CHALLENGE_FILTER,
  UNASSIGNED_CHALLENGE_FILTER,
  type RegistrationListFilters,
  type TeamRegistrationDoc,
} from "@/lib/types/domain";
import {
  getRepresentativeEmail,
  getRepresentativeName,
} from "@/lib/utils";

function matchesAssignedChallenge(
  record: TeamRegistrationDoc,
  assignedChallenge: string,
) {
  const assignedChallengeId = record.assignedChallengeId ?? "";

  if (assignedChallenge === ASSIGNED_CHALLENGE_FILTER) {
    return Boolean(assignedChallengeId);
  }

  if (assignedChallenge === UNASSIGNED_CHALLENGE_FILTER) {
    return !assignedChallengeId;
  }

  return assignedChallengeId === assignedChallenge;
}

function getSortValue(record: TeamRegistrationDoc, sortBy: RegistrationListFilters["sortBy"]) {
  switch (sortBy) {
    case "teamName":
      return record.teamName;
    case "institution":
      return record.institution;
    case "status":
      return record.status;
    case "teamSize":
      return record.teamSize;
    case "assignedChallenge":
      return record.assignedChallengeId ?? "";
    case "preferredChallenge":
      return record.challengePreferences[0] ?? "";
    case "createdAt":
    default:
      return record.createdAt;
  }
}

function compareValues(
  left: string | number,
  right: string | number,
  sortDirection: RegistrationListFilters["sortDirection"],
) {
  const direction = sortDirection === "asc" ? 1 : -1;

  if (typeof left === "number" && typeof right === "number") {
    return (left - right) * direction;
  }

  return String(left).localeCompare(String(right), "es", {
    numeric: true,
    sensitivity: "base",
  }) * direction;
}

export function applyRegistrationListFilters(
  records: TeamRegistrationDoc[],
  filters: RegistrationListFilters = {},
) {
  const sortBy = filters.sortBy ?? "createdAt";
  const sortDirection = filters.sortDirection ?? "desc";

  return records
    .filter((record) => {
      if (filters.status && record.status !== filters.status) {
        return false;
      }

      if (filters.teamSize && record.teamSize !== filters.teamSize) {
        return false;
      }

      if (
        filters.institution &&
        record.institution.toLowerCase() !== filters.institution.toLowerCase()
      ) {
        return false;
      }

      if (
        filters.preferredChallenge &&
        record.challengePreferences[0] !== filters.preferredChallenge
      ) {
        return false;
      }

      if (
        filters.assignedChallenge &&
        !matchesAssignedChallenge(record, filters.assignedChallenge)
      ) {
        return false;
      }

      if (filters.query) {
        const term = filters.query.toLowerCase();
        const hasTerm =
          record.teamName.toLowerCase().includes(term) ||
          getRepresentativeName(record.members).toLowerCase().includes(term) ||
          getRepresentativeEmail(record.members).toLowerCase().includes(term);

        if (!hasTerm) {
          return false;
        }
      }

      return true;
    })
    .sort((left, right) => {
      const primary = compareValues(
        getSortValue(left, sortBy),
        getSortValue(right, sortBy),
        sortDirection,
      );

      if (primary !== 0) {
        return primary;
      }

      return compareValues(left.createdAt, right.createdAt, "desc");
    });
}
