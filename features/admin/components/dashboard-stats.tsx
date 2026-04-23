import { StatCard, Card } from "@/lib/ui";
import type { Challenge, DashboardStats } from "@/lib/types/domain";

type DashboardStatsProps = {
  stats: DashboardStats;
  challenges: Challenge[];
};

export function DashboardStatsGrid({ stats, challenges }: DashboardStatsProps) {
  const challengeMap = new Map(challenges.map((challenge) => [challenge.id, challenge.name]));
  const topChallenge = stats.topChallenges[0];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total equipos" value={stats.totalTeams} />
        <StatCard label="Submitted" value={stats.totalByStatus.submitted} />
        <StatCard label="Approved" value={stats.totalByStatus.approved} />
        <StatCard label="Needs fix" value={stats.totalByStatus.needs_fix} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <p className="font-mono text-xs uppercase tracking-wide text-brand-electric">
            Estados
          </p>
          <ul className="mt-3 space-y-2 text-sm text-brand-muted">
            {Object.entries(stats.totalByStatus).map(([status, count]) => (
              <li key={status} className="flex justify-between gap-4">
                <span className="uppercase">{status}</span>
                <strong className="text-brand-white">{count}</strong>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <p className="font-mono text-xs uppercase tracking-wide text-brand-electric">
            Instituciones
          </p>
          <ul className="mt-3 space-y-2 text-sm text-brand-muted">
            {stats.totalByInstitution.slice(0, 5).map((item) => (
              <li key={item.institution} className="flex justify-between gap-4">
                <span>{item.institution}</span>
                <strong className="text-brand-white">{item.count}</strong>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <p className="font-mono text-xs uppercase tracking-wide text-brand-electric">
            Reto top
          </p>
          <p className="mt-3 text-sm text-brand-white">
            {topChallenge ? challengeMap.get(topChallenge.challengeId) : "Sin datos"}
          </p>
          <p className="mt-1 text-sm text-brand-muted">
            {topChallenge ? `${topChallenge.count} equipos` : "No hay preferencias aún"}
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-wide text-brand-electric">
            Registros por día
          </p>
          <ul className="mt-2 space-y-1 text-xs text-brand-muted">
            {stats.registrationsPerDay.slice(-5).map((entry) => (
              <li key={entry.date} className="flex justify-between gap-4">
                <span>{entry.date}</span>
                <span className="text-brand-white">{entry.count}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
