"use client";

import type { Challenge } from "@/lib/types/domain";
import type { TeamRegistrationFormValues } from "@/lib/validation/team-registration";
import { Badge, Card, DataLabel } from "@/lib/ui";
import { roleLabel } from "@/lib/utils";

type SummaryPanelProps = {
  values: TeamRegistrationFormValues;
  challenges: Challenge[];
};

export function SummaryPanel({ values, challenges }: SummaryPanelProps) {
  const challengeMap = new Map(challenges.map((challenge) => [challenge.id, challenge.name]));
  const baseMembers = [values.hacker, values.hipster, values.hustler];
  const members =
    values.teamSize === 4 && values.extraMember
      ? [...baseMembers, values.extraMember]
      : baseMembers;

  const representative = members.find((member) => member.isRepresentative);

  return (
    <div className="space-y-4">
      <Card className="space-y-3 border-brand-electric/45 bg-brand-bg/55 p-4 sm:p-5">
        <h4 className="font-mono text-xs uppercase tracking-wide text-brand-electric">
          Equipo
        </h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <DataLabel label="Nombre" value={values.teamName || "-"} />
          <DataLabel label="Institución" value={values.institution || "-"} />
          <DataLabel label="Tamaño del equipo" value={`${values.teamSize || "-"} integrantes`} />
          <DataLabel label="Cómo se enteraron" value={values.source || "-"} />
          <DataLabel
            label="Reto #1"
            value={challengeMap.get(values.challengePreferences?.[0]) ?? "-"}
          />
          <DataLabel
            label="Representante"
            value={
              representative
                ? `${representative.firstName} ${representative.lastName} · ${representative.email}`
                : "-"
            }
          />
        </div>
      </Card>

      <Card className="space-y-3 border-brand-electric/45 bg-brand-bg/55 p-4 sm:p-5">
        <h4 className="font-mono text-xs uppercase tracking-wide text-brand-electric">
          Integrantes
        </h4>
        <div className="grid gap-3 md:grid-cols-2">
          {members.map((member, index) => (
            <div
              key={`${member.role3H}-${index}-${member.email}`}
              className="rounded-2xl border border-brand-electric/35 bg-brand-bg/75 p-3 text-sm"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="font-mono text-xs uppercase tracking-wide text-brand-orange-soft">
                  {roleLabel(member.role3H)}
                </p>
                <div className="flex items-center gap-2">
                  {member.isRepresentative ? <Badge variant="approved">Representante</Badge> : null}
                  {index === 3 ? <Badge variant="proposed">Integrante extra</Badge> : null}
                </div>
              </div>
              <p className="mt-1 text-brand-white">
                {member.firstName} {member.lastName}
              </p>
              <p className="text-brand-muted">{member.email || "-"}</p>
              <p className="mt-2 text-xs text-brand-muted">Cuéntanos de ti</p>
              <p className="mt-1 text-sm text-brand-white/90">{member.about || "-"}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

