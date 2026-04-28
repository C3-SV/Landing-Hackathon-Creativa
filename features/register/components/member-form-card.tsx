"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { AFFILIATION_TYPE_OPTIONS } from "@/lib/constants/form-options";
import { ROLE3H_VALUES } from "@/lib/types/domain";
import type { TeamRegistrationFormValues } from "@/lib/validation/team-registration";
import { FieldError, Input, Label, Select, Textarea } from "@/lib/ui";
import { roleLabel } from "@/lib/utils";

type MemberFormCardProps = {
  fieldName: "hacker" | "hipster" | "hustler" | "extraMember";
  fixedRole?: "hacker" | "hipster" | "hustler";
  register: UseFormRegister<TeamRegistrationFormValues>;
  errors: FieldErrors<TeamRegistrationFormValues>;
  isRepresentative: boolean;
  onSelectRepresentative: () => void;
};

function resolveError(errors: FieldErrors<TeamRegistrationFormValues>, path: string) {
  const segments = path.split(".");
  let cursor: unknown = errors;
  for (const segment of segments) {
    if (!cursor || typeof cursor !== "object") {
      return undefined;
    }
    cursor = (cursor as Record<string, unknown>)[segment];
  }
  if (!cursor || typeof cursor !== "object") {
    return undefined;
  }
  return (cursor as { message?: string }).message;
}

export function MemberFormCard({
  fieldName,
  fixedRole,
  register,
  errors,
  isRepresentative,
  onSelectRepresentative,
}: MemberFormCardProps) {
  const prefix = fieldName;
  const reg = (name: string) => register(name as never);
  const err = (name: string) => resolveError(errors, name);

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor={`${prefix}.firstName`}>Nombre</Label>
          <Input id={`${prefix}.firstName`} {...reg(`${prefix}.firstName`)} />
          <FieldError message={err(`${prefix}.firstName`)} />
        </div>
        <div>
          <Label htmlFor={`${prefix}.lastName`}>Apellido</Label>
          <Input id={`${prefix}.lastName`} {...reg(`${prefix}.lastName`)} />
          <FieldError message={err(`${prefix}.lastName`)} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor={`${prefix}.preferredName`}>Nombre preferido (opcional)</Label>
          <Input id={`${prefix}.preferredName`} {...reg(`${prefix}.preferredName`)} />
          <FieldError message={err(`${prefix}.preferredName`)} />
        </div>
        <div>
          <Label htmlFor={`${prefix}.role3H`}>Rol 3H</Label>
          {fixedRole ? (
            <Input id={`${prefix}.role3H`} value={roleLabel(fixedRole)} disabled />
          ) : (
            <>
              <Select id={`${prefix}.role3H`} {...reg(`${prefix}.role3H`)}>
                {ROLE3H_VALUES.map((role) => (
                  <option key={role} value={role}>
                    {roleLabel(role)}
                  </option>
                ))}
              </Select>
              <FieldError message={err(`${prefix}.role3H`)} />
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor={`${prefix}.email`}>Correo</Label>
          <Input type="email" id={`${prefix}.email`} {...reg(`${prefix}.email`)} />
          <FieldError message={err(`${prefix}.email`)} />
        </div>
        <div>
          <Label htmlFor={`${prefix}.phone`}>Teléfono</Label>
          <Input id={`${prefix}.phone`} {...reg(`${prefix}.phone`)} />
          <FieldError message={err(`${prefix}.phone`)} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor={`${prefix}.affiliationType`}>Afiliación</Label>
          <Select id={`${prefix}.affiliationType`} {...reg(`${prefix}.affiliationType`)}>
            <option value="">Selecciona opción</option>
            {AFFILIATION_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <FieldError message={err(`${prefix}.affiliationType`)} />
        </div>
        <div>
          <Label htmlFor={`${prefix}.institution`}>Institución</Label>
          <Input id={`${prefix}.institution`} {...reg(`${prefix}.institution`)} />
          <FieldError message={err(`${prefix}.institution`)} />
        </div>
        <div>
          <Label htmlFor={`${prefix}.degreeOrMajor`}>Carrera / área</Label>
          <Input id={`${prefix}.degreeOrMajor`} {...reg(`${prefix}.degreeOrMajor`)} />
          <FieldError message={err(`${prefix}.degreeOrMajor`)} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor={`${prefix}.linkedinUrl`}>LinkedIn (opcional)</Label>
          <Input
            id={`${prefix}.linkedinUrl`}
            placeholder="https://linkedin.com/in/..."
            {...reg(`${prefix}.linkedinUrl`)}
          />
          <FieldError message={err(`${prefix}.linkedinUrl`)} />
        </div>
        <div>
          <Label htmlFor={`${prefix}.githubUrl`}>GitHub (opcional)</Label>
          <Input
            id={`${prefix}.githubUrl`}
            placeholder="https://github.com/..."
            {...reg(`${prefix}.githubUrl`)}
          />
          <FieldError message={err(`${prefix}.githubUrl`)} />
        </div>
        <div>
          <Label htmlFor={`${prefix}.portfolioUrl`}>Portafolio (opcional)</Label>
          <Input
            id={`${prefix}.portfolioUrl`}
            placeholder="https://..."
            {...reg(`${prefix}.portfolioUrl`)}
          />
          <FieldError message={err(`${prefix}.portfolioUrl`)} />
        </div>
      </div>

      <div>
        <Label htmlFor={`${prefix}.about`}>Cuéntanos de ti</Label>
        <p className="mt-1 text-xs text-brand-muted">
          Preséntate brevemente. Escribe entre 50 y 100 palabras sobre quién eres,
          qué te interesa y cómo aportarías a tu equipo.
        </p>
        <Textarea
          id={`${prefix}.about`}
          {...reg(`${prefix}.about`)}
          placeholder="Queremos conocerte mejor: cuéntanos tu perfil, intereses y aporte esperado."
        />
        <FieldError message={err(`${prefix}.about`)} />
      </div>

      <div className="rounded-xl border border-brand-electric/25 bg-brand-bg/45 p-3">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="radio"
            name="team-representative"
            checked={isRepresentative}
            onChange={onSelectRepresentative}
            className="h-4 w-4 border-brand-electric/50 bg-brand-bg text-brand-orange focus-visible:ring-brand-electric"
          />
          <span>
            <span className="block font-mono text-xs uppercase tracking-wide text-brand-orange-soft">
              Contacto principal del equipo
            </span>
            <span className="mt-1 block text-xs text-brand-muted">
              Selecciona exactamente una persona como representante para contacto de administración.
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}
