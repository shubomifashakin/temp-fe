"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { confirmCli } from "@/data-service/mutations";

export function CliAuthConfirm({
  code,
  state,
}: {
  code: string;
  state: string;
}) {
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: confirmCli,
    mutationKey: ["cli-auth-confirm"],

    onSuccess: () => {
      setConfirmed(true);
    },

    onError: (error) => {
      if (error.cause === 401) {
        return router.push("/auth/sign-in");
      }

      toast.error(error.message || "Failed to authorize CLI");
    },
  });

  function handleConfirm() {
    mutate({ code, state });
  }

  if (confirmed) {
    return (
      <div className="bg-muted rounded p-4">
        <p className="text-sm text-foreground">
          ✓ Authorization successful. You can close this tab and return to your
          terminal.
        </p>
      </div>
    );
  }

  return (
    <Button
      disabled={isPending}
      onClick={handleConfirm}
      className="w-full cursor-pointer primary-btn"
    >
      {isPending && <Loader2 className="animate-spin" />}
      {isPending ? "Authorizing..." : "Authorize Temp CLI"}
    </Button>
  );
}
