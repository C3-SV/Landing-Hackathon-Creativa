import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/auth/admin";
import { registrationRepository } from "@/lib/repositories";

export async function GET() {
  const auth = await requireAdminUser();
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const stats = await registrationRepository.getDashboardStats();
    return NextResponse.json({ stats });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudieron cargar métricas admin" },
      { status: 500 },
    );
  }
}
