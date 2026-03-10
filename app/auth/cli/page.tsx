"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getUserInfo } from "@/data-service/mutations";
import { CliAuthConfirm } from "@/components/cli-auth-confirm";

function CliAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const { status, error, data } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserInfo(),
  });

  useEffect(
    function () {
      if (status === "error" && error?.cause === 401) {
        const next = encodeURIComponent(
          `/auth/cli?code=${code}&state=${state}`,
        );
        router.replace(`/auth/sign-in?next=${next}`);
      }
    },
    [status, error, router, code, state],
  );

  return (
    <main className="min-h-screen font-mono bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {status === "pending" && (
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        )}

        {status === "success" && (!code || !state) && (
          <div className="bg-card border border-border rounded p-8 space-y-8">
            <div className="space-y-2">
              <Link
                href="/"
                className="text-xs text-muted-foreground flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Back to Temp
              </Link>

              <h1 className="text-2xl font-playfair font-bold text-foreground">
                Temp
              </h1>

              <p className="text-sm text-leading">
                Invalid CLI authorization request.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              This page can only be accessed from the Temp CLI application.
            </p>
          </div>
        )}

        {status === "success" && code && state && (
          <div className="bg-card border border-border rounded p-8 space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-playfair font-bold text-foreground">
                Temp
              </h1>

              <p className="text-sm text-leading">
                Authorize the Temp CLI to access your account.
              </p>
            </div>

            <div className="bg-muted rounded p-4 space-y-1">
              <p className="text-xs text-muted-foreground">Authorizing as</p>

              <p className="text-sm font-medium text-foreground">
                {data?.email}
              </p>
            </div>

            <CliAuthConfirm code={code!} state={state!} />

            <p className="text-xs font-light tracking-tight text-center text-leading leading-5">
              Only authorize if you initiated this request from your terminal.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen font-mono bg-background flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          </div>
        </main>
      }
    >
      <CliAuthContent />
    </Suspense>
  );
}
