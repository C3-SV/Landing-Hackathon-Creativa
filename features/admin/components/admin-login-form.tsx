"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { BRANDING } from "@/lib/constants/branding";
import { hasFirebaseClientConfig } from "@/lib/constants/public-env";
import { getFirebaseClientAuth } from "@/lib/firebase/client";
import { parseJsonResponse } from "@/lib/http";
import { AlertState, Button, Card, Input, Label } from "@/lib/ui";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forbiddenError = searchParams.get("error") === "forbidden";

  const modeLabel = useMemo(
    () => (hasFirebaseClientConfig() ? "Firebase Auth" : "Modo mock"),
    [],
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      let idToken: string | undefined;
      if (hasFirebaseClientConfig()) {
        const auth = getFirebaseClientAuth();
        if (!auth) {
          throw new Error("Firebase client no configurado.");
        }
        const credential = await signInWithEmailAndPassword(auth, email, password);
        idToken = await credential.user.getIdToken(true);
      }

      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          idToken,
        }),
      });
      await parseJsonResponse<{ ok: true }>(response);
      router.push("/admin");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo iniciar sesión",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="mx-auto max-w-md space-y-5">
      <div className="space-y-2 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-electric">
          {BRANDING.conceptUpper}
        </p>
        <h1 className="font-display text-base uppercase leading-relaxed text-brand-white">
          Admin · {BRANDING.eventName}
        </h1>
        <p className="text-sm text-brand-muted">{BRANDING.eventSubtitle}</p>
        <p className="text-sm text-brand-muted">Modo autenticación: {modeLabel}</p>
      </div>

      {forbiddenError ? (
        <AlertState
          variant="warning"
          title="Sin permisos"
          description="Tu sesión no tiene autorización admin para este panel."
        />
      ) : null}
      {error ? <AlertState variant="error" title="Login" description={error} /> : null}

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="email">Correo admin</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        {!hasFirebaseClientConfig() ? (
          <p className="text-xs text-brand-muted">
            En mock usa la contraseña definida en `MOCK_ADMIN_PASSWORD`.
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Ingresando..." : "Entrar al admin"}
        </Button>
      </form>
    </Card>
  );
}
