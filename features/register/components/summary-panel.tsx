"use client";

import type { Challenge } from "@/lib/types/domain";
import type { TeamRegistrationFormValues } from "@/lib/validation/team-registration";
import { Card, DataLabel } from "@/lib/ui";
import { roleLabel } from "@/lib/utils";

type SummaryPanelProps = {
  values: TeamRegistrationFormValues;
  challenges: Challenge[];
};

export function SummaryPanel({ values, challenges }: SummaryPanelProps) {
  const challengeMap = new Map(challenges.map((challenge) => [challenge.id, challenge.name]));
  const members = [values.hacker, values.hipster, values.hustler];

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <h4 className="font-mono text-xs uppercase tracking-wide text-brand-electric">
          Equipo
        </h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <DataLabel label="Nombre" value={values.teamName || "-"} />
          <DataLabel label="Institución" value={values.institution || "-"} />
          <DataLabel
            label="Reto #1"
            value={challengeMap.get(values.challengePreferences[0]) ?? "-"}
          />
          <DataLabel label="Responsable" value={values.responsibleName || "-"} />
          <DataLabel label="Email responsable" value={values.responsibleEmail || "-"} />
          <DataLabel label="Teléfono" value={values.responsiblePhone || "-"} />
        </div>
      </Card>

      <Card className="space-y-3">
        <h4 className="font-mono text-xs uppercase tracking-wide text-brand-electric">
          Integrantes
        </h4>
        <div className="grid gap-3 md:grid-cols-3">
          {members.map((member) => (
            <div
              key={member.role3H}
              className="rounded-xl border border-brand-electric/20 bg-brand-bg/40 p-3 text-sm"
            >
              <p className="font-mono text-xs uppercase tracking-wide text-brand-orange-soft">
                {roleLabel(member.role3H)}
              </p>
              <p className="mt-1 text-brand-white">
                {member.firstName} {member.lastName}
              </p>
              <p className="text-brand-muted">{member.email || "-"}</p>
              <p className="text-brand-muted">{member.skillLevel || "-"}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
