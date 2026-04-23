import { NextResponse } from "next/server";
import { registrationRepository } from "@/lib/repositories";

export async function GET() {
  try {
    const challenges = await registrationRepository.getChallenges();
    return NextResponse.json({ challenges });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo cargar catálogo de retos" },
      { status: 500 },
    );
  }
}
