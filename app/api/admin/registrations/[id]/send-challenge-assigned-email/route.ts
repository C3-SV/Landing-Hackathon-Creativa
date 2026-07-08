import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/auth/admin";
import { sendChallengeAssignedEmailForRegistration } from "@/lib/email/challenge-assigned-email";
import { registrationRepository } from "@/lib/repositories";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: Context) {
  const auth = await requireAdminUser();
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { id } = await context.params;
    const body = (await request.json().catch(() => ({}))) as {
      confirmResend?: boolean;
    };
    const registration = await registrationRepository.getRegistrationById(id);

    if (!registration) {
      return NextResponse.json({ error: "Equipo no encontrado" }, { status: 404 });
    }

    const result = await sendChallengeAssignedEmailForRegistration({
      registration,
      sentBy: auth.user.email,
      confirmResend: Boolean(body.confirmResend),
    });
    const emailLogs = await registrationRepository.listEmailLogsForRegistration(id);

    return NextResponse.json({
      registration: result.registration,
      emailLogs,
      status: result.status,
      logId: result.logId,
      messageId: result.messageId,
      errorMessage: result.errorMessage,
    });
  } catch (error) {
    const { id } = await context.params;
    console.error("Error enviando correo de reto asignado", {
      registrationId: id,
      error: error instanceof Error ? error.message : error,
    });

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo enviar el correo de reto asignado",
      },
      { status: 400 },
    );
  }
}
