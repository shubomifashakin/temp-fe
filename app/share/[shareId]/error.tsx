"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { FileX } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ErrorComponent({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="border p-8 max-w-md w-full gap-y-4 text-center font-mono">
        <div className="flex justify-center">
          <FileX size={38} strokeWidth={1.5} />
        </div>

        <h1 className="text-base text-gray-100 tracking-tight">
          {error?.message || "Oops! Something went wrong..."}
        </h1>

        <Button
          disabled={isPending}
          className="rounded"
          onClick={() =>
            startTransition(() => {
              router.refresh();
              reset();
            })
          }
        >
          Try Again
        </Button>
      </Card>
    </div>
  );
}
