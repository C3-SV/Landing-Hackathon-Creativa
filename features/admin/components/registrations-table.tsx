"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { REGISTRATION_STATUS_VALUES } from "@/lib/types/domain";
import type { Challenge, RegistrationListItem, RegistrationStatus } from "@/lib/types/domain";
import { parseJsonResponse, toQueryString } from "@/lib/http";
import { Badge, ButtonLink, Card, EmptyState, Input, Label, Select } from "@/lib/ui";
import { formatDateTime } from "@/lib/utils";

type RegistrationsTableProps = {
  initialRows: RegistrationListItem[];
  challenges: Challenge[];
};

export function RegistrationsTable({
  initialRows,
  challenges,
}: RegistrationsTableProps) {
  const [rows, setRows] = useState(initialRows);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [institution, setInstitution] = useState("");
  const [preferredChallenge, setPreferredChallenge] = useState("");

  const challengeMap = useMemo(
    () => new Map(challenges.map((challenge) => [challenge.id, challenge.name])),
    [challenges],
  );

  const institutions = useMemo(() => {
    const set = new Set(initialRows.map((item) => item.institution));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [initialRows]);

  async function loadRows() {
    setLoading(true);
    try {
      const queryString = toQueryString({
        query: query || undefined,
        status: status || undefined,
        institution: institution || undefined,
        preferredChallenge: preferredChallenge || undefined,
      });
      const response = await fetch(`/api/admin/registrations${queryString}`);
      const payload = await parseJsonResponse<{ registrations: RegistrationListItem[] }>(
        response,
      );
      setRows(payload.registrations);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function onApplyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loadRows();
  }

  async function onResetFilters() {
    setQuery("");
    setStatus("");
    setInstitution("");
    setPreferredChallenge("");
    setRows(initialRows);
  }

  return (
    <div className="space-y-4">
      <Card>
        <form className="grid gap-3 lg:grid-cols-5" onSubmit={onApplyFilters}>
          <div className="lg:col-span-2">
            <Label htmlFor="query">Buscar por equipo/responsable/email</Label>
            <Input
              id="query"
              placeholder="Ej. Pixel Atlas"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="status">Estado</Label>
            <Select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">Todos</option>
              {REGISTRATION_STATUS_VALUES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="institution">Institución</Label>
            <Select
              id="institution"
              value={institution}
              onChange={(event) => setInstitution(event.target.value)}
            >
              <option value="">Todas</option>
              {institutions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="challenge">Reto #1</Label>
            <Select
              id="challenge"
              value={preferredChallenge}
              onChange={(event) => setPreferredChallenge(event.target.value)}
            >
              <option value="">Todos</option>
              {challenges.map((challenge) => (
                <option key={challenge.id} value={challenge.id}>
                  {challenge.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="lg:col-span-5 flex flex-wrap justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onResetFilters}
              className="rounded-lg border border-brand-electric/30 px-3 py-2 font-mono text-xs uppercase text-brand-muted transition hover:bg-brand-bg/45"
            >
              Limpiar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-brand-orange px-3 py-2 font-mono text-xs uppercase text-brand-white transition hover:bg-brand-orange-soft"
            >
              Aplicar filtros
            </button>
          </div>
        </form>
      </Card>

      <div className="flex justify-end">
        <ButtonLink href="/api/admin/registrations/export.csv" variant="secondary">
          Exportar CSV
        </ButtonLink>
      </div>

      {rows.length === 0 && !loading ? (
        <EmptyState
          title="Sin equipos para estos filtros"
          description="Ajusta filtros o limpia búsqueda para visualizar más resultados."
        />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="min-w-full divide-y divide-brand-electric/25 text-sm">
            <thead className="bg-brand-bg/60">
              <tr className="text-left font-mono text-xs uppercase tracking-wide text-brand-muted">
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Equipo</th>
                <th className="px-4 py-3">Responsable</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Institución</th>
                <th className="px-4 py-3">Reto #1</th>
                <th className="px-4 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-electric/20">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-brand-bg/45">
                  <td className="px-4 py-3">
                    <Badge variant={row.status as RegistrationStatus}>{row.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-brand-white">
                    <Link href={`/admin/registrations/${row.id}`} className="hover:underline">
                      {row.teamName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-brand-muted">{row.responsibleName}</td>
                  <td className="px-4 py-3 text-brand-muted">{row.responsibleEmail}</td>
                  <td className="px-4 py-3 text-brand-muted">{row.institution}</td>
                  <td className="px-4 py-3 text-brand-muted">
                    {challengeMap.get(row.preferredChallenge) ?? row.preferredChallenge}
                  </td>
                  <td className="px-4 py-3 text-brand-muted">{formatDateTime(row.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
