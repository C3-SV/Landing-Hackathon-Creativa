"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ASSIGNED_CHALLENGE_FILTER,
  REGISTRATION_STATUS_VALUES,
  type Challenge,
  type RegistrationListItem,
  type RegistrationStatus,
  UNASSIGNED_CHALLENGE_FILTER,
} from "@/lib/types/domain";
import { parseJsonResponse, toQueryString } from "@/lib/http";
import { Badge, Button, ButtonLink, Card, EmptyState, Input, Label, Select } from "@/lib/ui";
import { formatDateTime, registrationStatusLabel } from "@/lib/utils";

type RegistrationsTableProps = {
  initialRows: RegistrationListItem[];
  challenges: Challenge[];
};

type RowFilters = {
  query: string;
  status: string;
  institution: string;
  preferredChallenge: string;
  assignedChallenge: string;
  teamSize: string;
  sortBy: string;
  sortDirection: string;
};

const defaultFilters: RowFilters = {
  query: "",
  status: "",
  institution: "",
  preferredChallenge: "",
  assignedChallenge: "",
  teamSize: "",
  sortBy: "createdAt",
  sortDirection: "desc",
};

const sortOptions = [
  { value: "createdAt", label: "Fecha de registro" },
  { value: "teamName", label: "Nombre del equipo" },
  { value: "institution", label: "Institución" },
  { value: "status", label: "Estado" },
  { value: "teamSize", label: "Tamaño" },
  { value: "assignedChallenge", label: "Reto asignado" },
  { value: "preferredChallenge", label: "Reto #1" },
];

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
  const [assignedChallenge, setAssignedChallenge] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [sortBy, setSortBy] = useState(defaultFilters.sortBy);
  const [sortDirection, setSortDirection] = useState(defaultFilters.sortDirection);

  const challengeMap = useMemo(
    () => new Map(challenges.map((challenge) => [challenge.id, challenge.name])),
    [challenges],
  );

  const institutions = useMemo(() => {
    const set = new Set(initialRows.map((item) => item.institution));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [initialRows]);

  const activeFilters = useMemo(() => {
    const filters: string[] = [];

    if (query.trim()) {
      filters.push(`Búsqueda: ${query.trim()}`);
    }
    if (status) {
      filters.push(`Estado: ${registrationStatusLabel(status as RegistrationStatus)}`);
    }
    if (institution) {
      filters.push(`Institución: ${institution}`);
    }
    if (preferredChallenge) {
      filters.push(`Reto #1: ${challengeMap.get(preferredChallenge) ?? preferredChallenge}`);
    }
    if (assignedChallenge) {
      const assignedLabel =
        assignedChallenge === ASSIGNED_CHALLENGE_FILTER
          ? "Con reto asignado"
          : assignedChallenge === UNASSIGNED_CHALLENGE_FILTER
            ? "Sin reto asignado"
            : challengeMap.get(assignedChallenge) ?? assignedChallenge;
      filters.push(`Reto asignado: ${assignedLabel}`);
    }
    if (teamSize) {
      filters.push(`Tamaño: ${teamSize} integrantes`);
    }

    const isDefaultSort =
      sortBy === defaultFilters.sortBy &&
      sortDirection === defaultFilters.sortDirection;
    if (!isDefaultSort) {
      const sortLabel = sortOptions.find((option) => option.value === sortBy)?.label ?? sortBy;
      filters.push(
        `Orden: ${sortLabel} ${sortDirection === "asc" ? "ascendente" : "descendente"}`,
      );
    }

    return filters;
  }, [
    assignedChallenge,
    challengeMap,
    institution,
    preferredChallenge,
    query,
    sortBy,
    sortDirection,
    status,
    teamSize,
  ]);

  async function loadRows(overrides?: RowFilters) {
    const filters = overrides ?? {
      query,
      status,
      institution,
      preferredChallenge,
      assignedChallenge,
      teamSize,
      sortBy,
      sortDirection,
    };

    setLoading(true);
    try {
      const queryString = toQueryString({
        query: filters.query || undefined,
        status: filters.status || undefined,
        institution: filters.institution || undefined,
        preferredChallenge: filters.preferredChallenge || undefined,
        assignedChallenge: filters.assignedChallenge || undefined,
        teamSize: filters.teamSize || undefined,
        sortBy:
          filters.sortBy !== defaultFilters.sortBy ||
          filters.sortDirection !== defaultFilters.sortDirection
            ? filters.sortBy
            : undefined,
        sortDirection:
          filters.sortBy !== defaultFilters.sortBy ||
          filters.sortDirection !== defaultFilters.sortDirection
            ? filters.sortDirection
            : undefined,
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
    await loadRows();
  }

  async function onResetFilters() {
    setQuery(defaultFilters.query);
    setStatus(defaultFilters.status);
    setInstitution(defaultFilters.institution);
    setPreferredChallenge(defaultFilters.preferredChallenge);
    setAssignedChallenge(defaultFilters.assignedChallenge);
    setTeamSize(defaultFilters.teamSize);
    setSortBy(defaultFilters.sortBy);
    setSortDirection(defaultFilters.sortDirection);
    await loadRows(defaultFilters);
  }

  return (
    <div className="space-y-4">
      <Card>
        <form className="grid gap-3 lg:grid-cols-12" onSubmit={onApplyFilters}>
          <div className="lg:col-span-4">
            <Label htmlFor="query">Buscar por equipo/representante/email</Label>
            <Input
              id="query"
              placeholder="Ej. Pixel Atlas"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="lg:col-span-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">Todos</option>
              {REGISTRATION_STATUS_VALUES.map((value) => (
                <option key={value} value={value}>
                  {registrationStatusLabel(value)}
                </option>
              ))}
            </Select>
          </div>
          <div className="lg:col-span-2">
            <Label htmlFor="teamSize">Tamaño</Label>
            <Select
              id="teamSize"
              value={teamSize}
              onChange={(event) => setTeamSize(event.target.value)}
            >
              <option value="">Todos</option>
              <option value="3">3 integrantes</option>
              <option value="4">4 integrantes</option>
            </Select>
          </div>
          <div className="lg:col-span-4">
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
          <div className="lg:col-span-3">
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
          <div className="lg:col-span-3">
            <Label htmlFor="assignedChallenge">Reto asignado</Label>
            <Select
              id="assignedChallenge"
              value={assignedChallenge}
              onChange={(event) => setAssignedChallenge(event.target.value)}
            >
              <option value="">Todos</option>
              <option value={UNASSIGNED_CHALLENGE_FILTER}>Sin asignar</option>
              <option value={ASSIGNED_CHALLENGE_FILTER}>Con reto asignado</option>
              {challenges.map((challenge) => (
                <option key={challenge.id} value={challenge.id}>
                  {challenge.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="lg:col-span-3">
            <Label htmlFor="sortBy">Ordenar por</Label>
            <Select
              id="sortBy"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="lg:col-span-3">
            <Label htmlFor="sortDirection">Dirección</Label>
            <Select
              id="sortDirection"
              value={sortDirection}
              onChange={(event) => setSortDirection(event.target.value)}
            >
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </Select>
          </div>
          <div className="lg:col-span-12 flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex min-h-8 flex-wrap items-center gap-2">
              <span className="font-mono text-xs uppercase text-brand-muted">
                {loading ? "Actualizando..." : `${rows.length} equipos`}
              </span>
              {activeFilters.map((filter) => (
                <Badge key={filter} className="normal-case tracking-normal">
                  {filter}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                onClick={onResetFilters}
                variant="ghost"
                className="px-3 py-2 text-xs"
              >
                Limpiar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="px-3 py-2 text-xs"
              >
                Aplicar filtros
              </Button>
            </div>
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
                <th className="px-4 py-3 text-center">Detalle</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Tamaño</th>
                <th className="px-4 py-3">Equipo</th>
                <th className="px-4 py-3">Institución</th>
                <th className="px-4 py-3">Reto asignado</th>
                <th className="px-4 py-3">Conducta</th>
                <th className="px-4 py-3">Reto #1</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Representante</th>
                <th className="px-4 py-3">Correo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-electric/20">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-brand-bg/45">
                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/admin/registrations/${row.id}`}
                      aria-label={`Ver detalle del equipo ${row.teamName}`}
                      title={`Ver detalle del equipo ${row.teamName}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-brand-electric/45 bg-brand-bg/35 font-mono text-base leading-none text-brand-electric transition hover:border-brand-orange hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-electric"
                    >
                      +
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={row.status as RegistrationStatus}>
                      {registrationStatusLabel(row.status)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-brand-muted">
                    {row.teamSize}
                  </td>
                  <td className="px-4 py-3 text-brand-white">
                    <Link href={`/admin/registrations/${row.id}`} className="hover:underline">
                      {row.teamName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-brand-muted">{row.institution}</td>
                  <td className="px-4 py-3 text-brand-muted">
                    {row.assignedChallengeId
                      ? challengeMap.get(row.assignedChallengeId) ?? row.assignedChallengeId
                      : "Sin asignar"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={row.codeOfConductAccepted ? "approved" : "default"}>
                      {row.codeOfConductAccepted ? "Aceptado" : "Pendiente"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-brand-muted">
                    {challengeMap.get(row.preferredChallenge) ?? row.preferredChallenge}
                  </td>
                  <td className="px-4 py-3 text-brand-muted">{formatDateTime(row.createdAt)}</td>
                  <td className="px-4 py-3 text-brand-muted">{row.representativeName}</td>
                  <td className="px-4 py-3 text-brand-muted">{row.representativeEmail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
