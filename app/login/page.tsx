import { Suspense } from "react";
import { PreviewLoginForm } from "@/features/site-access/components/preview-login-form";

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <Suspense fallback={null}>
        <PreviewLoginForm />
      </Suspense>
    </main>
  );
}
