"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { BRANDING } from "@/lib/constants/branding";
import { hasFirebaseClientConfig } from "@/lib/constants/public-env";
import { getFirebaseClientAuth } from "@/lib/firebase/client";
import { parseJsonResponse } from "@/lib/http";
import { AlertState, Button, Card, Input, Label } from "@/lib/ui";

export function PreviewLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextPath = searchParams.get("next") ?? "/";
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
          throw new Error("No se pudo inicializar Firebase Auth.");
        }

        const credential = await signInWithEmailAndPassword(auth, email, password);
        idToken = await credential.user.getIdToken(true);
      }

      const response = await fetch("/api/preview/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, idToken }),
      });

      await parseJsonResponse<{ ok: true }>(response);
      router.push(nextPath);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo habilitar el acceso temporal",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md space-y-5 border-brand-electric/40 bg-brand-surface/85">
      <div className="space-y-2 text-center">
        <h1 className="font-display text-sm uppercase leading-relaxed text-brand-white">
          Acceso temporal
        </h1>
        <p className="text-sm text-brand-muted">{BRANDING.eventName}</p>
        <p className="font-mono text-xs uppercase tracking-wide text-brand-muted">
          {BRANDING.eventSubtitle}
        </p>
        
      </div>

      {error ? (
        <AlertState
          variant="error"
          title="Acceso denegado"
          description={error}
        />
      ) : null}

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="email">Usuario (correo autorizado)</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        {/** 
        <p className="font-mono text-[11px] uppercase tracking-wide text-brand-muted">
          Modo autenticación: {modeLabel}
        </p>
        */}
        <p className="text-xs text-brand-muted">
          Entorno protegido antes del lanzamiento público.
        </p>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Verificando acceso..." : "Entrar"}
        </Button>
      </form>
    </Card>
  );
}
