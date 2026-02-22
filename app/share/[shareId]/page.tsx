"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2Icon, FileX, Clock } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { formatFileSize, getTimeRemaining } from "@/lib/utils";
import { getLinkDetails, getLinkedFile } from "@/data-service/mutations";

export default function LinkDetailsPage() {
  const { shareId } = useParams<{ shareId: string }>();
  const [password, setPassword] = useState("");

  const { data, status, error } = useQuery({
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

  //FIXME: CORRECT THIS
  if (status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 font-mono">
          <Loader2Icon className="h-8 w-8 animate-spin text-orange-500" />
          <span className="text-gray-400 text-sm">loading...</span>
        </div>
      </div>
    );
  }

  //   FIXME: CREATE ERROR COMPONENT
  if (status === "error" || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="border border-gray-700 rounded-lg p-8 max-w-md w-full space-y-4 text-center font-mono">
          <div className="flex justify-center">
            <FileX className="h-12 w-12 text-red-600" />
          </div>

          <h1 className="text-xl text-gray-100">link not found</h1>

          <p className="text-sm text-gray-400">
            this share link does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  if (data.fileDeleted || data.fileExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="border border-gray-700 rounded-lg p-8 max-w-md w-full space-y-4 text-center font-mono">
          <div className="flex justify-center">
            <Clock size={26} className=" text-yellow-600" />
          </div>

          <h1 className="text-xl text-gray-100">
            {data.fileDeleted ? "File Deleted" : "Link Expired"}
          </h1>
          <p className="text-sm text-gray-400">
            {data.fileDeleted
              ? "This file has been deleted by the owner."
              : "This share link has expired and is no longer accessible."}
          </p>
        </div>
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg border border-gray-800 rounded-lg p-8 bg-neutral-950 space-y-6 font-mono">
        <div className="space-y-2 border-b border-gray-800 pb-6">
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
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xs text-gray-400">
                  {data.fileCreator.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-lg text-gray-100 truncate">
                {data.fileName}
              </h1>
              <p className="text-xs text-gray-500">{data.fileCreator}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Size</span>
            <span className="text-gray-100 text-sm">
              {formatFileSize(data.fileSize)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Content Type</span>
            <span className="text-gray-100 text-sm">
              {data.fileContentType}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Uploaded</span>
            <span className="text-gray-100 text-sm">{uploadedAt}</span>
          </div>

          {expiresDate && (
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Expires</span>
              <span className="text-gray-100 text-sm">{expiresDate}</span>
            </div>
          )}

          {data.expiresAt && !data.fileExpired && (
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Time Left</span>
              <span className="text-gray-100 text-sm">
                {getTimeRemaining(data.expiresAt)}
              </span>
            </div>
          )}
        </div>

        {data.fileDescription && (
          <>
            <div className="border-t border-gray-800" />
            <div className="space-y-2">
              <h3 className="text-xs text-gray-500 uppercase">Description</h3>
              <p className="text-sm text-gray-300">{data.fileDescription}</p>
            </div>
          </>
        )}

        {data.passwordProtected && (
          <>
            <div className="border-t border-gray-800" />
            <div className="space-y-3">
              <h3 className="text-xs text-gray-500 uppercase">
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
                className="w-full bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-600 text-sm font-mono"
              />
            </div>
          </>
        )}

        <Button
          onClick={handleGetFile}
          disabled={isPending || (data.passwordProtected && !password)}
          className="w-full primary-btn text-white font-mono text-sm  rounded"
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

        <div className="border-t border-gray-800 pt-4 space-y-2 text-center">
          <p className="text-xs text-gray-600 font-mono">
            Shared securely • Link created{" "}
            {new Date(data.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>

          <Link className="text-xs text-gray-600 font-mono" href={"/"}>
            Back to Temp
          </Link>
        </div>
      </div>
    </div>
  );
}
