import { isAllowedAdminEmail } from "@/lib/auth/admin";
import { APP_ENV } from "@/lib/constants/env";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";

type CredentialsInput = {
  email?: string;
  password?: string;
  idToken?: string;
};

export class AdminCredentialError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function validateAdminCredentials(input: CredentialsInput) {
  const email = input.email?.trim().toLowerCase();
  if (!email || !isAllowedAdminEmail(email)) {
    throw new AdminCredentialError(
      "Este correo no está autorizado como admin",
      403,
    );
  }

  if (input.idToken) {
    try {
      const auth = getFirebaseAdminAuth();
      const decoded = await auth.verifyIdToken(input.idToken, true);
      if ((decoded.email ?? "").toLowerCase() !== email) {
        throw new AdminCredentialError(
          "El token no coincide con el correo ingresado",
          401,
        );
      }
    } catch (error) {
      if (error instanceof AdminCredentialError) {
        throw error;
      }
      throw new AdminCredentialError(
        "No se pudo verificar el token de autenticación",
        401,
      );
    }
  } else if (input.password !== APP_ENV.mockAdminPassword) {
    throw new AdminCredentialError(
      "Credenciales inválidas para entorno mock",
      401,
    );
  }

  return { email, idToken: input.idToken };
}
