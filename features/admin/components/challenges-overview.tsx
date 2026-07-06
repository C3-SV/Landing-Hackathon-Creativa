import Link from "next/link";
import type {
  Challenge,
  ChallengeOverviewRegistration,
} from "@/lib/types/domain";
import { Badge, Card, EmptyState } from "@/lib/ui";
import { formatDateTime, registrationStatusLabel } from "@/lib/utils";

type ChallengesOverviewProps = {
  challenges: Challenge[];
  registrations: ChallengeOverviewRegistration[];
};

type PreferenceIndex = 0 | 1 | 2;

const PREFERENCE_INDEXES: PreferenceIndex[] = [0, 1, 2];

function sortTeams(
  items: ChallengeOverviewRegistration[],
) {
  return [...items].sort((a, b) => {
    const createdAtDelta =
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (createdAtDelta !== 0) {
      return createdAtDelta;
    }

    return a.teamName.localeCompare(b.teamName);
  });
}

function TeamCard({
  item,
  assignedToOther,
  assignedChallengeName,
}: {
  item: ChallengeOverviewRegistration;
  assignedToOther?: boolean;
  assignedChallengeName?: string;
}) {
  return (
    <li className="rounded-lg border border-brand-electric/20 bg-brand-bg/45 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <Link
            href={`/admin/registrations/${item.id}`}
            className="text-sm font-semibold text-brand-white hover:text-brand-electric"
          >
            {item.teamName}
          </Link>
          <p className="mt-1 text-xs text-brand-muted">
            {item.institution} · {item.teamSize} integrantes
          </p>
        </div>
        <Badge variant={item.status}>{registrationStatusLabel(item.status)}</Badge>
      </div>

      <div className="mt-3 grid gap-1 text-xs text-brand-muted">
        <p>
          <span className="font-mono uppercase tracking-wide text-brand-electric">
            Representante:
          </span>{" "}
          {item.representativeName || "Sin definir"}
        </p>
        <p>
          <span className="font-mono uppercase tracking-wide text-brand-electric">
            Correo:
          </span>{" "}
          {item.representativeEmail || "-"}
        </p>
        <p>
          <span className="font-mono uppercase tracking-wide text-brand-electric">
            Inscripcion:
          </span>{" "}
          {formatDateTime(item.createdAt)}
        </p>
      </div>

      {assignedToOther ? (
        <p className="mt-3 rounded-md border border-brand-orange-soft/35 bg-brand-orange-soft/10 px-2 py-1 font-mono text-[11px] uppercase tracking-wide text-brand-orange-soft">
          Asignado a otro reto{assignedChallengeName ? `: ${assignedChallengeName}` : ""}
        </p>
      ) : null}
    </li>
  );
}

function TeamList({
  items,
  emptyLabel,
  challengeMap,
  currentChallengeId,
}: {
  items: ChallengeOverviewRegistration[];
  emptyLabel: string;
  challengeMap: Map<string, string>;
  currentChallengeId: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-brand-muted">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-2">
      {sortTeams(items).map((item) => {
        const assignedToOther = Boolean(
          item.assignedChallengeId && item.assignedChallengeId !== currentChallengeId,
        );

        return (
          <TeamCard
            key={item.id}
            item={item}
            assignedToOther={assignedToOther}
            assignedChallengeName={
              item.assignedChallengeId
                ? challengeMap.get(item.assignedChallengeId)
                : undefined
            }
          />
        );
      })}
    </ul>
  );
}

export function ChallengesOverview({
  challenges,
  registrations,
}: ChallengesOverviewProps) {
  const challengeMap = new Map(challenges.map((challenge) => [challenge.id, challenge.name]));

  if (challenges.length === 0) {
    return (
      <EmptyState
        title="Sin retos configurados"
        description="Cuando exista catalogo de retos, esta vista mostrara equipos asignados y preferencias."
      />
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {challenges.map((challenge) => {
        const assigned = registrations.filter(
          (item) => item.assignedChallengeId === challenge.id,
        );
        const preferenceGroups = PREFERENCE_INDEXES.map((index) => ({
          index,
          teams: registrations.filter(
            (item) =>
              item.challengePreferences[index] === challenge.id &&
              item.assignedChallengeId !== challenge.id,
          ),
          totalSelections: registrations.filter(
            (item) => item.challengePreferences[index] === challenge.id,
          ).length,
        }));
        const interestedCount = preferenceGroups.reduce(
          (total, group) => total + group.teams.length,
          0,
        );

        return (
          <Card key={challenge.id} className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-base uppercase text-brand-white">
                    {challenge.name}
                  </h2>
                  <Badge variant={challenge.status}>{challenge.status}</Badge>
                </div>
                <p className="mt-1 font-mono text-xs uppercase tracking-wide text-brand-electric">
                  {challenge.hub}
                </p>
                <p className="mt-2 text-sm text-brand-muted">{challenge.description}</p>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-4">
              <div className="rounded-lg border border-brand-electric/20 bg-brand-bg/35 p-3">
                <p className="font-mono text-[11px] uppercase tracking-wide text-brand-muted">
                  Asignados
                </p>
                <p className="mt-1 text-xl font-bold text-brand-white">{assigned.length}</p>
              </div>
              {preferenceGroups.map((group) => (
                <div
                  key={group.index}
                  className="rounded-lg border border-brand-electric/20 bg-brand-bg/35 p-3"
                >
                  <p className="font-mono text-[11px] uppercase tracking-wide text-brand-muted">
                    Preferencia #{group.index + 1}
                  </p>
                  <p className="mt-1 text-xl font-bold text-brand-white">
                    {group.totalSelections}
                  </p>
                </div>
              ))}
            </div>

            <section className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-mono text-xs uppercase tracking-wide text-brand-electric">
                  Asignados
                </h3>
                <span className="font-mono text-xs text-brand-muted">
                  {assigned.length} equipos
                </span>
              </div>
              <TeamList
                items={assigned}
                emptyLabel="Sin equipos asignados"
                challengeMap={challengeMap}
                currentChallengeId={challenge.id}
              />
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-mono text-xs uppercase tracking-wide text-brand-electric">
                  Lo seleccionaron
                </h3>
                <span className="font-mono text-xs text-brand-muted">
                  {interestedCount} equipos visibles
                </span>
              </div>

              {preferenceGroups.every((group) => group.teams.length === 0) ? (
                <p className="text-sm text-brand-muted">
                  Sin equipos que lo hayan seleccionado
                </p>
              ) : (
                <div className="grid gap-3">
                  {preferenceGroups.map((group) => (
                    <div
                      key={group.index}
                      className="rounded-xl border border-brand-electric/15 bg-brand-bg/25 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="font-mono text-xs uppercase tracking-wide text-brand-orange-soft">
                          Preferencia #{group.index + 1}
                        </p>
                        <span className="font-mono text-xs text-brand-muted">
                          {group.teams.length} equipos
                        </span>
                      </div>
                      <TeamList
                        items={group.teams}
                        emptyLabel="Sin equipos en esta preferencia"
                        challengeMap={challengeMap}
                        currentChallengeId={challenge.id}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </Card>
        );
      })}
    </div>
  );
}
