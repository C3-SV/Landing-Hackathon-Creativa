"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { AFFILIATION_TYPE_OPTIONS, SKILL_LEVEL_OPTIONS } from "@/lib/constants/form-options";
import type { TeamRegistrationFormValues } from "@/lib/validation/team-registration";
import { FieldError, Input, Label, Select } from "@/lib/ui";
import { roleLabel } from "@/lib/utils";

type MemberFormCardProps = {
  role: "hacker" | "hipster" | "hustler";
  register: UseFormRegister<TeamRegistrationFormValues>;
  errors: FieldErrors<TeamRegistrationFormValues>;
};

export function MemberFormCard({ role, register, errors }: MemberFormCardProps) {
  const memberErrors = errors[role];

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor={`${role}.firstName`}>Nombre</Label>
          <Input id={`${role}.firstName`} {...register(`${role}.firstName`)} />
          <FieldError message={memberErrors?.firstName?.message} />
        </div>
        <div>
          <Label htmlFor={`${role}.lastName`}>Apellido</Label>
          <Input id={`${role}.lastName`} {...register(`${role}.lastName`)} />
          <FieldError message={memberErrors?.lastName?.message} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor={`${role}.preferredName`}>Nombre preferido (opcional)</Label>
          <Input id={`${role}.preferredName`} {...register(`${role}.preferredName`)} />
          <FieldError message={memberErrors?.preferredName?.message} />
        </div>
        <div>
          <Label>Rol 3H</Label>
          <Input value={roleLabel(role)} disabled />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor={`${role}.email`}>Correo</Label>
          <Input type="email" id={`${role}.email`} {...register(`${role}.email`)} />
          <FieldError message={memberErrors?.email?.message} />
        </div>
        <div>
          <Label htmlFor={`${role}.phone`}>Teléfono</Label>
          <Input id={`${role}.phone`} {...register(`${role}.phone`)} />
          <FieldError message={memberErrors?.phone?.message} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor={`${role}.affiliationType`}>Afiliación</Label>
          <Select id={`${role}.affiliationType`} {...register(`${role}.affiliationType`)}>
            <option value="">Selecciona opción</option>
            {AFFILIATION_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <FieldError message={memberErrors?.affiliationType?.message} />
        </div>
        <div>
          <Label htmlFor={`${role}.institution`}>Institución</Label>
          <Input id={`${role}.institution`} {...register(`${role}.institution`)} />
          <FieldError message={memberErrors?.institution?.message} />
        </div>
        <div>
          <Label htmlFor={`${role}.degreeOrMajor`}>Carrera / área</Label>
          <Input id={`${role}.degreeOrMajor`} {...register(`${role}.degreeOrMajor`)} />
          <FieldError message={memberErrors?.degreeOrMajor?.message} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor={`${role}.skillLevel`}>Nivel</Label>
          <Select id={`${role}.skillLevel`} {...register(`${role}.skillLevel`)}>
            <option value="">Selecciona nivel</option>
            {SKILL_LEVEL_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <FieldError message={memberErrors?.skillLevel?.message} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor={`${role}.linkedinUrl`}>LinkedIn (opcional)</Label>
          <Input
            id={`${role}.linkedinUrl`}
            placeholder="https://linkedin.com/in/..."
            {...register(`${role}.linkedinUrl`)}
          />
          <FieldError message={memberErrors?.linkedinUrl?.message} />
        </div>
        <div>
          <Label htmlFor={`${role}.githubUrl`}>GitHub (opcional)</Label>
          <Input
            id={`${role}.githubUrl`}
            placeholder="https://github.com/..."
            {...register(`${role}.githubUrl`)}
          />
          <FieldError message={memberErrors?.githubUrl?.message} />
        </div>
        <div>
          <Label htmlFor={`${role}.portfolioUrl`}>Portafolio (opcional)</Label>
          <Input
            id={`${role}.portfolioUrl`}
            placeholder="https://..."
            {...register(`${role}.portfolioUrl`)}
          />
          <FieldError message={memberErrors?.portfolioUrl?.message} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor={`${role}.dietaryRestrictions`}>Restricciones alimentarias</Label>
          <Input
            id={`${role}.dietaryRestrictions`}
            {...register(`${role}.dietaryRestrictions`)}
          />
          <FieldError message={memberErrors?.dietaryRestrictions?.message} />
        </div>
        <div>
          <Label htmlFor={`${role}.allergies`}>Alergias</Label>
          <Input id={`${role}.allergies`} {...register(`${role}.allergies`)} />
          <FieldError message={memberErrors?.allergies?.message} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor={`${role}.emergencyContactName`}>
            Contacto de emergencia (nombre)
          </Label>
          <Input
            id={`${role}.emergencyContactName`}
            {...register(`${role}.emergencyContactName`)}
          />
          <FieldError message={memberErrors?.emergencyContactName?.message} />
        </div>
        <div>
          <Label htmlFor={`${role}.emergencyContactPhone`}>
            Contacto de emergencia (teléfono)
          </Label>
          <Input
            id={`${role}.emergencyContactPhone`}
            {...register(`${role}.emergencyContactPhone`)}
          />
          <FieldError message={memberErrors?.emergencyContactPhone?.message} />
        </div>
      </div>
    </div>
  );
}
