"use client";

import { useEffect, useMemo, useState } from "react";
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
import { parseJsonResponse } from "@/lib/http";
import type { Challenge, TeamMember } from "@/lib/types/domain";
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
  countWords,
  teamRegistrationFormSchema,
  type TeamRegistrationFormValues,
} from "@/lib/validation/team-registration";

type TeamRegistrationFormProps = {
  editionId: string;
  challenges: Challenge[];
};

function memberIsComplete(member?: Partial<TeamMember>) {
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
      countWords(member.about) >= 50 &&
      countWords(member.about) <= 100,
  );
}

function hasMemberErrors(errors: unknown) {
  if (!errors || typeof errors !== "object") {
    return false;
  }
  return Object.keys(errors as Record<string, unknown>).length > 0;
}

export function TeamRegistrationForm({ editionId, challenges }: TeamRegistrationFormProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<RegisterSectionId>("general");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TeamRegistrationFormValues>({
    resolver: zodResolver(teamRegistrationFormSchema),
    defaultValues: buildDefaultRegistrationValues(editionId),
    mode: "onChange",
  });

  const values = useWatch({ control }) as TeamRegistrationFormValues;
  const teamSize = Number(values.teamSize || 3) as 3 | 4;

  useEffect(() => {
    if (teamSize === 4 && !values.extraMember) {
      setValue("extraMember", createExtraMemberDefault(), { shouldValidate: true });
    }
    if (teamSize === 3 && values.extraMember) {
      setValue("extraMember", undefined, { shouldValidate: true });
    }
  }, [setValue, teamSize, values.extraMember]);

  const completeMap = useMemo(() => {
    return {
      general: Boolean(
        values.responsibleName &&
          values.responsibleEmail &&
          values.responsiblePhone &&
          values.source,
      ),
      team: Boolean(
        values.teamName &&
          values.institution &&
          values.challengePreferences?.[0] &&
          values.challengePreferences?.[1] &&
          values.challengePreferences?.[2] &&
          (teamSize === 3 || teamSize === 4),
      ),
      hacker: memberIsComplete(values.hacker),
      hipster: memberIsComplete(values.hipster),
      hustler: memberIsComplete(values.hustler),
      extra: teamSize === 3 ? true : memberIsComplete(values.extraMember ?? undefined),
      confirm: Boolean(
        values.consents.acceptCodeOfConduct &&
          values.consents.acceptPrivacyPolicy &&
          values.consents.authorizationDeclaration,
      ),
    } satisfies Record<RegisterSectionId, boolean>;
  }, [teamSize, values]);

  const errorMap = {
    general: Boolean(
      errors.responsibleName ||
        errors.responsibleEmail ||
        errors.responsiblePhone ||
        errors.source,
    ),
    team: Boolean(
      errors.teamName ||
        errors.teamSize ||
        errors.institution ||
        errors.challengePreferences ||
        errors.teamDescription,
    ),
    hacker: hasMemberErrors(errors.hacker),
    hipster: hasMemberErrors(errors.hipster),
    hustler: hasMemberErrors(errors.hustler),
    extra: teamSize === 4 ? hasMemberErrors(errors.extraMember) : false,
    confirm: Boolean(errors.consents),
  } satisfies Record<RegisterSectionId, boolean>;

  async function onSubmit(formValues: TeamRegistrationFormValues) {
    setSubmitError(null);
    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });
      const payload = await parseJsonResponse<{ registration: { teamName: string } }>(
        response,
      );
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
          {challenge.name} {challenge.status === "proposed" ? "(propuesto)" : ""}
        </option>
      );
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
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

          {activeSection === "general" ? (
            <SectionWrapper
              title="Datos generales"
              subtitle="La persona responsable debe ser parte del equipo."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="responsibleName">Nombre responsable</Label>
                  <Input id="responsibleName" {...register("responsibleName")} />
                  <FieldError message={errors.responsibleName?.message} />
                </div>
                <div>
                  <Label htmlFor="responsibleEmail">Correo responsable</Label>
                  <Input id="responsibleEmail" type="email" {...register("responsibleEmail")} />
                  <FieldError message={errors.responsibleEmail?.message} />
                </div>
                <div>
                  <Label htmlFor="responsiblePhone">Teléfono responsable</Label>
                  <Input id="responsiblePhone" {...register("responsiblePhone")} />
                  <FieldError message={errors.responsiblePhone?.message} />
                </div>
                <div>
                  <Label htmlFor="source">¿Cómo se enteraron?</Label>
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
            </SectionWrapper>
          ) : null}

          {activeSection === "team" ? (
            <SectionWrapper
              title="Equipo"
              subtitle="Define el tamaño del equipo y selecciona tus 3 retos preferidos."
            >
              <div className="grid gap-4 md:grid-cols-3">
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
                  <Select
                    id="teamSize"
                    {...register("teamSize", { valueAsNumber: true })}
                  >
                    <option value={3}>3 integrantes</option>
                    <option value={4}>4 integrantes</option>
                  </Select>
                  <FieldError message={errors.teamSize?.message} />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="teamDescription">Descripción del equipo (opcional)</Label>
                <Textarea id="teamDescription" {...register("teamDescription")} />
                <FieldError message={errors.teamDescription?.message} />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="challengePreferences.0">Reto preferido #1</Label>
                  <Select id="challengePreferences.0" {...register("challengePreferences.0")}>
                    <option value="">Selecciona reto</option>
                    {challengeOptions(0)}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="challengePreferences.1">Reto preferido #2</Label>
                  <Select id="challengePreferences.1" {...register("challengePreferences.1")}>
                    <option value="">Selecciona reto</option>
                    {challengeOptions(1)}
                  </Select>
                </div>
                <div>
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
                  <MemberFormCard fieldName="extraMember" register={register} errors={errors} />
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
                  label="Acepto el código de conducta (obligatorio)"
                  {...register("consents.acceptCodeOfConduct")}
                />
                <FieldError
                  message={errors.consents?.acceptCodeOfConduct?.message?.toString()}
                />
                <Checkbox
                  label="Acepto la política de privacidad (obligatorio)"
                  {...register("consents.acceptPrivacyPolicy")}
                />
                <FieldError
                  message={errors.consents?.acceptPrivacyPolicy?.message?.toString()}
                />
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

      <div className="flex flex-wrap justify-between gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => moveSection("prev")}
          disabled={activeSection === "general" || isSubmitting}
        >
          Anterior
        </Button>
        <div className="flex gap-3">
          {activeSection !== "confirm" ? (
            <Button
              type="button"
              variant="primary"
              onClick={() => moveSection("next")}
              disabled={isSubmitting}
            >
              Siguiente
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar inscripción"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
