"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { isPast } from "date-fns";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import {
  Image,
  Video,
  Music,
  FileText,
  Loader2Icon,
  X,
  Calendar,
  MousePointerClick,
  Lock,
  CircleDashed,
  OctagonAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  deleteFile,
  getFileLinks,
  type FileDetails,
} from "@/data-service/mutations";
import { formatFileSize, getTimeRemaining } from "@/lib/utils";

interface FileDetailsModalProps {
  file: FileDetails;
  onClose: () => void;
  deleteCb: () => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getFileIcon(mimeType: string, fileName: string): React.ReactNode {
  // eslint-disable-next-line jsx-a11y/alt-text
  if (mimeType.startsWith("image/")) return <Image strokeWidth={1.5} />;
  if (mimeType === "application/pdf") return <FileText strokeWidth={1.5} />;
  if (mimeType.includes("word")) return <FileText strokeWidth={1.5} />;
  if (mimeType.includes("video")) return <Video strokeWidth={1.5} />;
  if (mimeType.includes("audio")) return <Music strokeWidth={1.5} />;
  if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls"))
    return <FileText strokeWidth={1.5} />;
  return <FileText strokeWidth={1.5} />;
}

export default function FileDetailsModal({
  file,
  onClose,
  deleteCb,
}: FileDetailsModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleShowDeleteConfirm() {
    setShowDeleteConfirm(!showDeleteConfirm);
  }

  return (
    <div className="fixed font-mono inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 dark">
      <div className="w-full max-w-md bg-card border border-border rounded-lg">
        {showDeleteConfirm && (
          <ConfirmFileDelete
            fileId={file.id}
            onDelete={deleteCb}
            cancelShowDeleteConfirm={handleShowDeleteConfirm}
          />
        )}

        {!showDeleteConfirm && (
          <FileDetails
            file={file}
            onClose={onClose}
            handleShowDeleteConfirm={handleShowDeleteConfirm}
          />
        )}
      </div>
    </div>
  );
}

function ConfirmFileDelete({
  fileId,
  onDelete,
  cancelShowDeleteConfirm,
}: {
  fileId: string;
  onDelete: () => void;
  cancelShowDeleteConfirm: () => void;
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: deleteFile,
    mutationKey: ["delete-file", fileId],
    onSuccess: () => {
      onDelete();
      toast.success("File deleted successfully");
    },
  });

  function handleDelete() {
    mutate({ id: fileId });
  }

  return (
    <div className="p-6 space-y-4">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold font-playfair text-foreground tracking-tighter">
          Delete File?
        </h2>

        <p className="text-sm text-muted-foreground font-light tracking-tight">
          This action cannot be undone. The file will be permanently deleted.
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          variant={"secondary"}
          onClick={cancelShowDeleteConfirm}
          className="flex-1 font-medium text-sm"
        >
          Cancel
        </Button>

        <Button
          disabled={isPending}
          onClick={handleDelete}
          variant={"destructive"}
          className="flex-1 font-semibold text-sm"
        >
          Delete {isPending && <Loader2Icon className="animate-spin" />}
        </Button>
      </div>
    </div>
  );
}

function FileDetails({
  file,
  onClose,
  handleShowDeleteConfirm,
}: {
  file: FileDetails;
  onClose: () => void;
  handleShowDeleteConfirm: () => void;
}) {
  const isExpired = isPast(file.expiresAt);
  const isDeleted = file.deletedAt ? true : false;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <div className="flex items-start gap-3">
            <span className="text-3xl shrink-0">
              {getFileIcon(file.contentType, file.name)}
            </span>

            <div>
              <h2 className="font-bold -mt-1 font-playfair tracking-tighter text-heading break-all text-xl">
                {file.name}
              </h2>

              <p className="text-xs text-leading font-light tracking-tight">
                {file.description}
              </p>
            </div>
          </div>
        </div>

        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="text-lg text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <X />
        </Button>
      </div>

      <div className="space-y-4 bg-secondary/30 border border-border/30 p-4 rounded-lg">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Size</span>

          <span className="text-foreground font-medium">
            {formatFileSize(file.size)}
          </span>
        </div>

        <div className="flex justify-between text-xs border-t border-border/20 pt-2">
          <span className="text-muted-foreground">Uploaded</span>

          <span className="text-foreground font-medium">
            {formatDate(file.createdAt)}
          </span>
        </div>

        <div className="flex justify-between text-xs border-t border-border/20 pt-2">
          <span className="text-muted-foreground">Expires</span>

          <span
            className={`font-medium ${isExpired ? "text-destructive" : "text-foreground"}`}
          >
            {isExpired ? "Expired" : formatDate(file.expiresAt)}
          </span>
        </div>

        {!isExpired && (
          <div className="flex justify-between text-xs border-t border-border/20 pt-2">
            <span className="text-leading">Time Left</span>

            <span className="text-foreground font-medium">
              {getTimeRemaining(file.expiresAt)}
            </span>
          </div>
        )}

        {isDeleted && (
          <div className="flex justify-between text-xs border-t border-border/20 pt-2">
            <span className="text-leading">Deleted At</span>

            <span className="text-foreground font-medium">
              {formatDate(file.deletedAt!)}
            </span>
          </div>
        )}
      </div>

      {!isDeleted && file.status === "safe" && <FileSafe file={file} />}

      {!isDeleted && file.status === "unsafe" && <FileUnsafe />}

      {!isDeleted && file.status === "pending" && <FilePending />}

      {!isDeleted ? (
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant={"secondary"}
            className="flex-1 font-medium text-sm"
          >
            Close
          </Button>

          <Button
            variant={"destructive"}
            onClick={handleShowDeleteConfirm}
            className="flex-1 font-medium text-sm"
          >
            Delete
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function FileSafe({ file }: { file: FileDetails }) {
  const linkListContainerRef = useRef<HTMLDivElement>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  const domain =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://temp.545plea.xyz";

  function handleCopy(linkId: string) {
    const shareUrl = `${domain}/share/${linkId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLinkId(linkId);
    setTimeout(() => setCopiedLinkId(null), 2000);
  }

  const {
    data,
    error,
    status,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["file-links", file.id],
    initialPageParam: undefined,
    refetchOnWindowFocus: true,
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getFileLinks({ fileId: file.id, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.cursor,
  });

  const links = data?.pages.flatMap((page) => page.data) || [];

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.scrollTop + target.clientHeight >= target.scrollHeight - 100) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    const listContainer = linkListContainerRef.current;
    if (listContainer) {
      listContainer.addEventListener("scroll", handleScroll);
      return () => listContainer.removeEventListener("scroll", handleScroll);
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground capitalize tracking-tight">
          Total Links ({file.totalLinks})
        </label>

        <Button
          onClick={() => {}}
          variant={"secondary"}
          className="px-4 py-1 text-xs font-medium"
        >
          New Link
        </Button>
      </div>

      {status === "success" && links.length ? (
        <div
          ref={linkListContainerRef}
          className="space-y-2 max-h-64 overflow-y-auto no-scrollbar"
        >
          {links.map((link) => (
            <div
              key={link.id}
              className="bg-secondary/30 border border-border/30 rounded-lg p-3 space-y-3"
            >
              <div className="flex gap-2">
                <input
                  readOnly
                  type="text"
                  value={`${domain}/share/${link.id}`}
                  className="flex-1 px-2 py-1 rounded text-xs bg-secondary/50 border border-border/30 text-foreground"
                />

                <Button
                  variant={"secondary"}
                  onClick={() => handleCopy(link.id)}
                  className={`px-3 py-1 text-xs rounded min-w-14 transition-all `}
                >
                  {copiedLinkId === link.id ? "✓" : "Copy"}
                </Button>
              </div>

              <div className="flex gap-2 justify-between">
                <LinkDetails
                  heading="Created"
                  icon={<Calendar size={16} />}
                  leading={formatDate(link.createdAt).split(",")[0]}
                />

                <LinkDetails
                  heading="Clicks"
                  icon={<MousePointerClick size={16} />}
                  leading={link.clickCount.toString()}
                />

                <LinkDetails
                  heading="Passworded"
                  icon={<Lock size={16} />}
                  leading={link.passwordProtected ? "Yes" : "No"}
                />

                <LinkDetails
                  heading="Last Accessed"
                  icon={<Calendar size={16} />}
                  leading={
                    link.lastAccessedAt
                      ? new Date(link.lastAccessedAt).toLocaleDateString()
                      : "Never"
                  }
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {!links.length && (
        <div className="p-3 bg-secondary/20 border border-border/30 rounded-lg text-xs text-muted-foreground text-center">
          No links created yet. Create one to start sharing.
        </div>
      )}
    </div>
  );
}

function LinkDetails({
  icon,
  leading,
  heading,
}: {
  icon: ReactNode;
  leading: string;
  heading: string;
}) {
  return (
    <div className="text-xs text-center flex md:flex-col items-center gap-x-2 gap-y-2">
      <span className="text-leading block md:hidden">{icon}</span>
      <span className="text-leading hidden md:block">{heading}</span>

      <p className="text-heading font-medium">{leading}</p>
    </div>
  );
}

function FileUnsafe() {
  return (
    <div className="p-3 bg-destructive/5 border items-start flex gap-x-2 border-destructive/20 gap-y-4 shadow-none rounded-lg text-xs text-red-400 tracking-tight font-light">
      <OctagonAlert size={24} /> This file was flagged as unsafe. Links cannot
      be generated.
    </div>
  );
}

function FilePending() {
  return (
    <div className="p-3 bg-yellow-500/10 border items-start flex gap-x-2 border-yellow-500/30 rounded-lg text-xs text-yellow-400 tracking-tight font-light">
      <CircleDashed size={24} className="animate-spin -mt-0.5" /> Scanning in
      progress. Share links will be available once scanning completes.
    </div>
  );
}
