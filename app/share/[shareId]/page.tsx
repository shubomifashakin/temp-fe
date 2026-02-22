"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2Icon, FileX, Clock, ArrowLeft } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { formatFileSize, getTimeRemaining } from "@/lib/utils";
import { getLinkDetails, getLinkedFile } from "@/data-service/mutations";
import { Card } from "@/components/ui/card";

export default function LinkDetailsPage() {
  const { shareId } = useParams<{ shareId: string }>();
  const [password, setPassword] = useState("");

  const { data, status, error, refetch } = useQuery({
    refetchOnWindowFocus: true,
    queryKey: ["share-link", shareId],
    queryFn: () => getLinkDetails({ linkId: shareId }),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: getLinkedFile,
    mutationKey: ["get-linked-file", shareId],
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function handleGetFile() {
    mutate({ linkId: shareId, password: password || null });
  }

  if (status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 font-mono">
          <Loader2Icon className="h-8 w-8 animate-spin text-orange-500" />
          <span className="text-leading text-sm">Fetching link details...</span>
        </div>
      </div>
    );
  }

  if (status === "error" && error.cause === 404) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="border p-8 max-w-md w-full gap-y-6 text-center flex flex-col items-center font-mono">
          <div className="space-y-2">
            <h1 className="text-lg font-medium text-heading">Link Not Found</h1>

            <p className="text-sm text-muted-foreground leading-relaxed">
              This share link doesn&apos;t exist or has been deleted by the
              owner.
            </p>
          </div>

          <Link
            href={"/"}
            className="text-xs text-leading text-center font-mono flex items-center gap-1"
          >
            <ArrowLeft className="mr-1 h-3 w-3" /> Back to Temp
          </Link>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="border border-gray-700 rounded-lg p-8 max-w-md w-full space-y-4 text-center font-mono">
          <div className="flex justify-center">
            <FileX size={38} strokeWidth={1.5} />
          </div>

          <h1 className="text-base text-gray-100 tracking-tight">
            Oops! Something went wrong...
          </h1>

          <Button className="rounded" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (data.fileDeleted || data.fileExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="border rounded p-8 max-w-md w-full gap-y-2 text-center font-mono">
          <div className="flex justify-center">
            <Clock size={32} className=" text-yellow-600" />
          </div>

          <h1 className="text-lg text-heading">
            {data.fileDeleted ? "File Deleted" : "Link Expired"}
          </h1>

          <p className="text-sm text-leading">
            {data.fileDeleted
              ? "This file has been deleted by the owner."
              : "This share link has expired and is no longer accessible."}
          </p>
        </Card>
      </div>
    );
  }

  const uploadedAt = new Date(data.fileUploadedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const expiresDate = data.expiresAt
    ? new Date(data.expiresAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const linkHasExpired =
    !!data.expiresAt && new Date() > new Date(data.expiresAt);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <Card className="w-full max-w-lg border rounded p-8 space-y-2 font-mono">
        <Link
          className="text-xs text-leading font-mono flex items-center gap-1"
          href={"/"}
        >
          <ArrowLeft className="mr-1 h-3 w-3" /> Back to Temp
        </Link>

        <div className="space-y-6">
          <div className="space-y-2 border-b border-dashed pb-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                {data.fileCreatorPicture ? (
                  <Image
                    src={data.fileCreatorPicture}
                    alt={data.fileCreator}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs text-leading">
                    {data.fileCreator.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-lg text-heading truncate">
                  {data.fileName}
                </h1>

                <p className="text-xs text-leading">{data.fileCreator}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-leading text-xs uppercase">Size</span>

              <span className="text-heading text-xs">
                {formatFileSize(data.fileSize)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-leading text-xs uppercase">
                Content Type
              </span>

              <span className="text-heading text-xs">
                {data.fileContentType}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-leading text-xs uppercase">Uploaded</span>

              <span className="text-heading text-xs">{uploadedAt}</span>
            </div>

            {expiresDate && (
              <div className="flex justify-between">
                <span className="text-leading text-xs uppercase">Expires</span>

                <span className="text-heading text-xs">{expiresDate}</span>
              </div>
            )}

            {data.expiresAt && (
              <div className="flex justify-between">
                <span className="text-leading text-xs uppercase">
                  Time Left
                </span>

                <span className="text-heading text-xs">
                  {getTimeRemaining(data.expiresAt)}
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-dashed" />

          <div className="space-y-2">
            <h3 className="text-xs text-leading uppercase">Description</h3>
            <p className="text-sm text-heading">{data.fileDescription}</p>
          </div>

          {data.passwordProtected && (
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
                  placeholder="enter password"
                  className="w-full bg-gray-900 text-gray-100 placeholder-gray-600 text-sm font-mono"
                />
              </div>
            </>
          )}

          <Button
            onClick={handleGetFile}
            disabled={
              isPending ||
              (data.passwordProtected && !password.length) ||
              linkHasExpired
            }
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

          <div className="border-t border-dashed pt-4 gap-y-2 text-center flex flex-col items-center">
            <p className="text-xs text-leading font-mono">
              Shared Securely • Link created{" "}
              {new Date(data.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>Having issues with this file?</p>
              <a
                href="mailto:apps@545plea.xyz"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Contact us
              </a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
