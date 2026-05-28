"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  buildDefaultRegistrationValues,
  createExtraMemberDefault,
  REGISTER_SECTIONS,
  type RegisterSectionId,
} from "@/features/register/constants";
import { MemberFormCard } from "@/features/register/components/member-form-card";
import { RegisterSidebar } from "@/features/register/components/register-sidebar";
import { SummaryPanel } from "@/features/register/components/summary-panel";
import { SOURCE_OPTIONS } from "@/lib/constants/form-options";
import type { Challenge } from "@/lib/types/domain";
import {
  AlertState,
  Button,
  Checkbox,
  FieldError,
  Input,
  Label,
  Select,
  SectionWrapper,
  Textarea,
} from "@/lib/ui";
import {
  teamRegistrationFormSchema,
  ABOUT_MIN_CHARACTERS,
  type TeamRegistrationFormValues,
} from "@/lib/validation/team-registration";

type TeamRegistrationFormProps = {
  editionId: string;
  challenges: Challenge[];
};

type MemberField = "hacker" | "hipster" | "hustler" | "extraMember";

type MemberCompletionShape = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  affiliationType?: string;
  institution?: string;
  degreeOrMajor?: string;
  about?: string;
};

type ServerValidationIssue = {
  path?: Array<string | number>;
  message: string;
};

const CHALLENGE_OPTION_TITLES: Record<string, string> = {
  touristsv: "TOURISTSV",
  "creator-kit": "MARKETPULSE",
  "ar-cultura": "CULTURAXR",
  ecotrack: "ECOTRACK",
  datapulse: "DATATOUR",
  twinmap: "TWINSCAPE",
};

function memberIsComplete(member?: MemberCompletionShape) {
  if (!member) {
    return false;
  }

  return Boolean(
    member.firstName &&
      member.lastName &&
      member.email &&
      member.phone &&
      member.affiliationType &&
      member.institution &&
      member.degreeOrMajor &&
      member.about &&
      member.about.trim().length >= ABOUT_MIN_CHARACTERS,
  );
}

function hasMemberErrors(errors: unknown) {
  if (!errors || typeof errors !== "object") {
    return false;
  }
  return Object.keys(errors as Record<string, unknown>).length > 0;
}

function getMemberKeys(teamSize: 3 | 4) {
  return teamSize === 4
    ? (["hacker", "hipster", "hustler", "extraMember"] as const)
    : (["hacker", "hipster", "hustler"] as const);
}

export function TeamRegistrationForm({ editionId, challenges }: TeamRegistrationFormProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<RegisterSectionId>("team");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<TeamRegistrationFormValues>({
    resolver: zodResolver(teamRegistrationFormSchema),
    defaultValues: buildDefaultRegistrationValues(editionId),
    mode: "onChange",
  });

  const values = useWatch({ control }) as TeamRegistrationFormValues;
  const teamSize = Number(values.teamSize || 3) as 3 | 4;

  const setRepresentative = useCallback(
    (target: MemberField) => {
      const keys = getMemberKeys(teamSize);
      for (const key of keys) {
        setValue(`${key}.isRepresentative`, key === target, { shouldValidate: true });
      }
    },
    [setValue, teamSize],
  );

  useEffect(() => {
    if (teamSize === 4 && !values.extraMember) {
      setValue("extraMember", createExtraMemberDefault(), { shouldValidate: true });
    }

    if (teamSize === 3 && values.extraMember) {
      const extraWasRepresentative = Boolean(values.extraMember.isRepresentative);
      setValue("extraMember", undefined, { shouldValidate: true });
      if (extraWasRepresentative) {
        setRepresentative("hacker");
      }
    }
  }, [setRepresentative, setValue, teamSize, values.extraMember]);

  useEffect(() => {
    const keys = getMemberKeys(teamSize);
    const representatives = keys.filter((key) => Boolean(values[key]?.isRepresentative));

    if (representatives.length === 0) {
      setRepresentative("hacker");
      return;
    }

    if (representatives.length > 1) {
      const keep = representatives[0];
      for (const key of keys) {
        if (key !== keep && values[key]?.isRepresentative) {
          setValue(`${key}.isRepresentative`, false, { shouldValidate: true });
        }
      }
    }
  }, [setRepresentative, setValue, teamSize, values]);

  const completeMap = useMemo(() => {
    return {
      team: Boolean(
        values.teamName &&
          values.institution &&
          values.source &&
          values.challengePreferences?.[0] &&
          values.challengePreferences?.[1] &&
          values.challengePreferences?.[2] &&
          (teamSize === 3 || teamSize === 4),
      ),
      hacker: memberIsComplete(values.hacker),
      hipster: memberIsComplete(values.hipster),
      hustler: memberIsComplete(values.hustler),
      extra: teamSize === 3 ? true : memberIsComplete(values.extraMember ?? undefined),
      confirm: Boolean(values.consents.authorizationDeclaration),
    } satisfies Record<RegisterSectionId, boolean>;
  }, [teamSize, values]);

  const errorMap = {
    team: Boolean(
      errors.teamName ||
        errors.teamSize ||
        errors.institution ||
        errors.source ||
        errors.challengePreferences ||
        errors.teamDescription,
    ),
    hacker: hasMemberErrors(errors.hacker),
    hipster: hasMemberErrors(errors.hipster),
    hustler: hasMemberErrors(errors.hustler),
    extra: teamSize === 4 ? hasMemberErrors(errors.extraMember) : false,
    confirm: Boolean(errors.consents),
  } satisfies Record<RegisterSectionId, boolean>;

  function mapServerIssuePath(path: Array<string | number> | undefined) {
    if (!path || path.length === 0) {
      return "";
    }

    if (path[0] === "challengePreferences") {
      return "challengePreferences";
    }

    return path.map(String).join(".");
  }

  function applyServerValidationIssues(issues: ServerValidationIssue[]) {
    for (const issue of issues) {
      const fieldPath = mapServerIssuePath(issue.path);
      if (fieldPath) {
        setError(fieldPath as never, {
          type: "server",
          message: issue.message,
        });
      }
    }
  }

  async function onSubmit(formValues: TeamRegistrationFormValues) {
    setSubmitError(null);
    clearErrors();

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            error?: string;
            issues?: ServerValidationIssue[];
            registration?: { teamName: string };
          }
        | null;

      if (!response.ok) {
        if (response.status === 400 && Array.isArray(payload?.issues)) {
          applyServerValidationIssues(payload.issues);
        }

        throw new Error(
          payload?.error ?? "No se pudo enviar la inscripción. Intenta de nuevo.",
        );
      }

      if (!payload?.registration?.teamName) {
        throw new Error("No se pudo enviar la inscripción. Intenta de nuevo.");
      }

      router.push(
        `/register/success?teamName=${encodeURIComponent(payload.registration.teamName)}`,
      );
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No se pudo enviar la inscripción. Intenta de nuevo.",
      );
    }
  }

  function moveSection(direction: "prev" | "next") {
    const index = REGISTER_SECTIONS.findIndex((item) => item.id === activeSection);
    const nextIndex = direction === "next" ? index + 1 : index - 1;
    const next = REGISTER_SECTIONS[nextIndex];
    if (next) {
      setActiveSection(next.id);
    }
  }

  function challengeOptions(position: 0 | 1 | 2) {
    const selected = (values.challengePreferences ?? []).filter(Boolean);
    return challenges.map((challenge) => {
      const current = values.challengePreferences?.[position];
      const disabled = selected.includes(challenge.id) && current !== challenge.id;
      return (
        <option key={challenge.id} value={challenge.id} disabled={disabled}>
          {CHALLENGE_OPTION_TITLES[challenge.id] ?? challenge.name}
        </option>
      );
    });
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-5 lg:grid-cols-[300px_1fr] lg:gap-6">
        <RegisterSidebar
          activeSection={activeSection}
          completeMap={completeMap}
          errorMap={errorMap}
          onSelect={setActiveSection}
        />

        <div className="space-y-4">
          {submitError ? (
            <AlertState variant="error" title="Error de envío" description={submitError} />
          ) : null}

          {activeSection === "team" ? (
            <SectionWrapper
              title="Equipo"
              subtitle="Define tamaño, canal de origen y tus 3 retos preferidos."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="teamName">Nombre del equipo</Label>
                  <Input id="teamName" {...register("teamName")} />
                  <FieldError message={errors.teamName?.message} />
                </div>
                <div>
                  <Label htmlFor="institution">Institución principal</Label>
                  <Input id="institution" {...register("institution")} />
                  <FieldError message={errors.institution?.message} />
                </div>
                <div>
                  <Label htmlFor="teamSize">Tamaño del equipo</Label>
                  <Select id="teamSize" {...register("teamSize", { valueAsNumber: true })}>
                    <option value={3}>3 integrantes</option>
                    <option value={4}>4 integrantes</option>
                  </Select>
                  <FieldError message={errors.teamSize?.message} />
                </div>
                <div>
                  <Label htmlFor="source">Cómo se enteraron</Label>
                  <Select id="source" {...register("source")}>
                    <option value="">Selecciona una opción</option>
                    {SOURCE_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </Select>
                  <FieldError message={errors.source?.message} />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="teamDescription">Descripción del equipo (opcional)</Label>
                <Textarea id="teamDescription" {...register("teamDescription")} />
                <FieldError message={errors.teamDescription?.message} />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-brand-electric/45 bg-brand-bg/55 p-3.5">
                  <p className="mb-2 inline-flex items-center rounded-full border border-brand-orange px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-brand-orange-soft">
                    PREFERENCIA 1
                  </p>
                  <Label htmlFor="challengePreferences.0">Reto preferido #1</Label>
                  <Select id="challengePreferences.0" {...register("challengePreferences.0")}>
                    <option value="">Selecciona reto</option>
                    {challengeOptions(0)}
                  </Select>
                </div>
                <div className="rounded-2xl border border-brand-electric/45 bg-brand-bg/55 p-3.5">
                  <p className="mb-2 inline-flex items-center rounded-full border border-brand-orange px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-brand-orange-soft">
                    PREFERENCIA 2
                  </p>
                  <Label htmlFor="challengePreferences.1">Reto preferido #2</Label>
                  <Select id="challengePreferences.1" {...register("challengePreferences.1")}>
                    <option value="">Selecciona reto</option>
                    {challengeOptions(1)}
                  </Select>
                </div>
                <div className="rounded-2xl border border-brand-electric/45 bg-brand-bg/55 p-3.5">
                  <p className="mb-2 inline-flex items-center rounded-full border border-brand-orange px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-brand-orange-soft">
                    PREFERENCIA 3
                  </p>
                  <Label htmlFor="challengePreferences.2">Reto preferido #3</Label>
                  <Select id="challengePreferences.2" {...register("challengePreferences.2")}>
                    <option value="">Selecciona reto</option>
                    {challengeOptions(2)}
                  </Select>
                </div>
              </div>
              <FieldError message={errors.challengePreferences?.message} />
            </SectionWrapper>
          ) : null}

          {activeSection === "hacker" ? (
            <SectionWrapper
              title="Integrante Hacker"
              subtitle="Queremos conocerte mejor. Este perfil es obligatorio."
            >
              <MemberFormCard
                fieldName="hacker"
                fixedRole="hacker"
                register={register}
                errors={errors}
                isRepresentative={Boolean(values.hacker?.isRepresentative)}
                onSelectRepresentative={() => setRepresentative("hacker")}
              />
            </SectionWrapper>
          ) : null}

          {activeSection === "hipster" ? (
            <SectionWrapper
              title="Integrante Hipster"
              subtitle="Comparte tu perfil y cómo aportarás al equipo."
            >
              <MemberFormCard
                fieldName="hipster"
                fixedRole="hipster"
                register={register}
                errors={errors}
                isRepresentative={Boolean(values.hipster?.isRepresentative)}
                onSelectRepresentative={() => setRepresentative("hipster")}
              />
            </SectionWrapper>
          ) : null}

          {activeSection === "hustler" ? (
            <SectionWrapper
              title="Integrante Hustler"
              subtitle="Queremos entender tu enfoque de negocio y ejecución."
            >
              <MemberFormCard
                fieldName="hustler"
                fixedRole="hustler"
                register={register}
                errors={errors}
                isRepresentative={Boolean(values.hustler?.isRepresentative)}
                onSelectRepresentative={() => setRepresentative("hustler")}
              />
            </SectionWrapper>
          ) : null}

          {activeSection === "extra" ? (
            <SectionWrapper
              title="Integrante extra"
              subtitle="Se habilita solo para equipos de 4. Puede ser Hacker, Hipster o Hustler."
            >
              {teamSize === 3 ? (
                <AlertState
                  title="Equipo de 3 integrantes"
                  description="Si quieres agregar un cuarto integrante, cambia el tamaño del equipo a 4 en la sección Equipo."
                />
              ) : (
                <>
                  <MemberFormCard
                    fieldName="extraMember"
                    register={register}
                    errors={errors}
                    isRepresentative={Boolean(values.extraMember?.isRepresentative)}
                    onSelectRepresentative={() => setRepresentative("extraMember")}
                  />
                  <FieldError
                    message={
                      typeof errors.extraMember?.message === "string"
                        ? errors.extraMember.message
                        : undefined
                    }
                  />
                </>
              )}
            </SectionWrapper>
          ) : null}

          {activeSection === "confirm" ? (
            <SectionWrapper
              title="Confirmación final"
              subtitle="Revisa el resumen del equipo y valida consentimientos."
            >
              <SummaryPanel values={values} challenges={challenges} />
              <div className="mt-4 grid gap-3">
                <Checkbox
                  label="Consiento uso de imagen y media"
                  {...register("consents.mediaConsent")}
                />
                <Checkbox
                  label="Permito compartir información con aliados/sponsors"
                  {...register("consents.dataSharingConsent")}
                />
                <Checkbox
                  label="Declaro que tengo autorización del equipo para registrar sus datos (obligatorio)"
                  {...register("consents.authorizationDeclaration")}
                />
                <FieldError
                  message={errors.consents?.authorizationDeclaration?.message?.toString()}
                />
              </div>
            </SectionWrapper>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-brand-electric/35 bg-brand-surface/50 p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => moveSection("prev")}
            disabled={activeSection === "team" || isSubmitting}
            className="w-full sm:w-auto"
          >
            Anterior
          </Button>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            {activeSection !== "confirm" ? (
              <Button
                type="button"
                variant="primary"
                onClick={() => moveSection("next")}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Siguiente
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? "Enviando..." : "Enviar inscripción"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
