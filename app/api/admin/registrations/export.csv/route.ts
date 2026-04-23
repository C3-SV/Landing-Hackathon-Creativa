import { requireAdminUser } from "@/lib/auth/admin";
import { registrationRepository } from "@/lib/repositories";

export async function GET() {
  const auth = await requireAdminUser();
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const csv = await registrationRepository.exportRegistrationsCsv();
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="hackathon-creativa-registrations.csv"',
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "No se pudo exportar CSV" },
      {
        status: 500,
      },
    );
  }
}
