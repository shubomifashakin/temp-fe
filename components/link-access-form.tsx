"use client";

import { useState } from "react";

import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { getLinkedFile } from "@/data-service/mutations";

export default function LinkAccessForm({
  shareId,
  isPasswordProtected,
}: {
  shareId: string;
  isPasswordProtected: boolean;
}) {
  const [password, setPassword] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: getLinkedFile,
    mutationKey: ["get-linked-file", shareId],
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error) => {
      if (error.cause === 401) {
        return toast.error("Invalid Credentials");
      }

      toast.error(error.message);
    },
  });

  function handleGetFile() {
    mutate({ linkId: shareId, password: password || null });
  }

  return (
    <>
      {isPasswordProtected && (
        <>
          <div className="border-t border-dashed" />

          <div className="space-y-3">
            <h3 className="text-xs text-leading uppercase">
              Password Required
            </h3>

            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && password && !isPending) {
                  handleGetFile();
                }
              }}
              placeholder="Enter password"
              className="w-full bg-gray-900 text-gray-100 placeholder-gray-600 text-sm font-mono"
            />
          </div>
        </>
      )}

      <Button
        onClick={handleGetFile}
        disabled={isPending || (isPasswordProtected && !password.length)}
        className="w-full primary-btn text-white font-mono text-sm"
      >
        {isPending ? (
          <>
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            Accessing...
          </>
        ) : (
          "Access File"
        )}
      </Button>
    </>
  );
}
