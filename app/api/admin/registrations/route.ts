import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/auth/admin";
import { registrationRepository } from "@/lib/repositories";
import { registrationFiltersSchema } from "@/lib/validation/admin";

export async function GET(request: Request) {
  const auth = await requireAdminUser();
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const url = new URL(request.url);
    const parsed = registrationFiltersSchema.safeParse({
      query: url.searchParams.get("query") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      institution: url.searchParams.get("institution") ?? undefined,
      preferredChallenge: url.searchParams.get("preferredChallenge") ?? undefined,
      assignedChallenge: url.searchParams.get("assignedChallenge") ?? undefined,
      teamSize: url.searchParams.get("teamSize") ?? undefined,
      sortBy: url.searchParams.get("sortBy") ?? undefined,
      sortDirection: url.searchParams.get("sortDirection") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Filtros inválidos", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const registrations = await registrationRepository.listRegistrations(parsed.data);
    return NextResponse.json({ registrations });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo listar inscripciones" },
      { status: 500 },
    );
  }
}
