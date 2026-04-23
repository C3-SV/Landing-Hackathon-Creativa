import { NextResponse } from "next/server";
import { registrationRepository } from "@/lib/repositories";

export async function GET() {
  try {
    const edition = await registrationRepository.getCurrentEdition();
    return NextResponse.json({ edition });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo cargar edición actual" },
      { status: 500 },
    );
  }
}
