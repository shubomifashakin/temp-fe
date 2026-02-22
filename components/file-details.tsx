"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { format, isPast } from "date-fns";
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  Lock,
  Image,
  Video,
  Music,
  FileText,
  Loader2Icon,
  CircleDashed,
  OctagonAlert,
  MousePointerClick,
  ChevronDownIcon,
  Calendar1,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  deleteFile,
  getFileLinks,
  createFileLink,
  type FileDetails,
  revokeFileLink,
} from "@/data-service/mutations";

import { formatFileSize, getTimeRemaining } from "@/lib/utils";

import { InputGroup } from "./input-group";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Card } from "./ui/card";

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
  const [showCreateLinkForm, setShowCreateLinkForm] = useState(false);

  function handleShowDeleteConfirm() {
    setShowCreateLinkForm(false);
    setShowDeleteConfirm(!showDeleteConfirm);
  }

  function handleShowCreateLinkForm() {
    setShowDeleteConfirm(false);
    setShowCreateLinkForm(!showCreateLinkForm);
  }

  return (
    <div className="fixed font-mono inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-xl bg-card border border-border gap-0 p-0 rounded">
        {showDeleteConfirm && (
          <ConfirmFileDelete
            fileId={file.id}
            onDelete={deleteCb}
            cancelShowDeleteConfirm={handleShowDeleteConfirm}
          />
        )}

        {showCreateLinkForm && (
          <CreateLinkForm
            fileId={file.id}
            handleShowCreateLinkForm={handleShowCreateLinkForm}
          />
        )}

        {!showDeleteConfirm && !showCreateLinkForm && (
          <FileDetails
            file={file}
            onClose={onClose}
            handleShowDeleteConfirm={handleShowDeleteConfirm}
            handleShowCreateLinkForm={handleShowCreateLinkForm}
          />
        )}
      </Card>
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
        <h2 className="text-xl font-bold text-foreground tracking-tight">
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

function CreateLinkForm({
  fileId,
  handleShowCreateLinkForm,
}: {
  fileId: string;
  handleShowCreateLinkForm: () => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [description, setDescription] = useState("");
  const [password, setPassword] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: createFileLink,
    mutationKey: ["create-link", fileId],
    onSuccess: () => {
      handleShowCreateLinkForm();

      queryClient.invalidateQueries({ queryKey: ["file-links", fileId] });
      toast.success("Link Created!");
    },
    onError: (error) => {
      toast.error(error.message);

      if (error.cause === 401) {
        router.push("/");
      }
    },
  });

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!description) {
      return toast.warning("Please enter all required fields!");
    }

    if (expiresAt && expiresAt < new Date()) {
      return toast.error("Expiry date cannot be in the past!");
    }

    mutate({ fileId, data: { password, description, expiresAt } });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-x-4 gap-y-5 p-6">
      <div className="space-y-0.5">
        <h2 className="text-xl tracking-tight font-bold text-heading">
          Create Link
        </h2>

        <p className="text-sm text-leading tracking-tight font-light">
          Create a shareable link for this file.
        </p>
      </div>

      <InputGroup label="Description">
        <input
          required
          type="text"
          value={description}
          minLength={5}
          maxLength={100}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a description..."
          className="w-full p-3 rounded border border-border/50 bg-secondary/20 text-foreground placeholder:text-muted-foreground placeholder:text-xs tracking-tight focus:outline-none focus:ring-1 focus:ring-accent text-sm"
        />
      </InputGroup>

      <InputGroup label="Password" showRequired={false}>
        <input
          type="password"
          minLength={6}
          value={password || ""}
          placeholder="Enter a password (optional)..."
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded border border-border/50 bg-secondary/20 text-foreground placeholder:text-muted-foreground placeholder:text-xs tracking-tight focus:outline-none focus:ring-1 focus:ring-accent text-sm"
        />
      </InputGroup>

      <InputGroup label="Expires At" showRequired={false}>
        <Popover>
          <PopoverTrigger asChild>
            <button
              data-empty={!expiresAt}
              className="w-full data-[empty=true]:text-muted-foreground flex justify-between items-center p-3 rounded border border-border/50 bg-secondary/20 text-foreground placeholder:text-muted-foreground tracking-tight focus:outline-none focus:ring-1 focus:ring-accent text-sm"
            >
              {expiresAt ? (
                format(expiresAt, "PPP")
              ) : (
                <span className="text-xs">Pick a date (optional)</span>
              )}
              <ChevronDownIcon data-icon="inline-end" size={16} />
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              required
              mode="single"
              className="font-mono"
              onSelect={setExpiresAt}
              startMonth={new Date()}
              defaultMonth={new Date()}
              selected={expiresAt || new Date()}
            />
          </PopoverContent>
        </Popover>
      </InputGroup>

      <div className="flex justify-between gap-4">
        <Button
          disabled={isPending}
          variant={"secondary"}
          className="flex-1"
          onClick={handleShowCreateLinkForm}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isPending}
          className="primary-btn flex-1"
        >
          Create Link {isPending && <Loader2Icon className="animate-spin" />}
        </Button>
      </div>
    </form>
  );
}

function FileDetails({
  file,
  onClose,
  handleShowDeleteConfirm,
  handleShowCreateLinkForm,
}: {
  file: FileDetails;
  onClose: () => void;
  handleShowDeleteConfirm: () => void;
  handleShowCreateLinkForm: () => void;
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

            <div className="space-y-1">
              <h2 className="-mt-1 font-bold tracking-tight text-heading break-all text-xl">
                {file.name}
              </h2>

              <p className="text-sm text-leading font-light tracking-tight">
                {file.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 bg-secondary/30 border border-border/30 p-4 rounded">
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

      {file.status === "safe" && (
        <FileSafe
          file={file}
          handleShowCreateLinkForm={handleShowCreateLinkForm}
        />
      )}

      {!isDeleted && !isExpired && file.status === "unsafe" && <FileUnsafe />}

      {!isDeleted && !isExpired && file.status === "pending" && <FilePending />}

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
          disabled={isDeleted || isExpired}
          onClick={handleShowDeleteConfirm}
          className="flex-1 font-medium text-sm"
        >
          {isDeleted ? "Deleted" : "Delete File"}
        </Button>
      </div>
    </div>
  );
}

function FileSafe({
  file,
  handleShowCreateLinkForm,
}: {
  file: FileDetails;
  handleShowCreateLinkForm: () => void;
}) {
  const linkListContainerRef = useRef<HTMLDivElement>(null);

  const cannotCreateNewLink =
    !!file.deletedAt || new Date() > new Date(file.expiresAt);

  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground capitalize">
          Total Links ({file.totalLinks})
        </label>

        <Button
          variant={"secondary"}
          disabled={cannotCreateNewLink}
          onClick={handleShowCreateLinkForm}
          className="px-4 py-1 text-xs font-medium"
        >
          New Link
        </Button>
      </div>

      {status === "success" && links.length ? (
        <div
          ref={linkListContainerRef}
          className="space-y-4 max-h-64 overflow-y-auto no-scrollbar"
        >
          {links.map((link) => (
            <LinkItem
              key={link.id}
              id={link.id}
              fileId={file.id}
              createdAt={link.createdAt}
              revokedAt={link.revokedAt}
              clickCount={link.clickCount}
              lastAccessedAt={link.lastAccessedAt}
              passwordProtected={link.passwordProtected}
            />
          ))}
        </div>
      ) : null}

      {!links.length && (
        <div className="p-3 bg-secondary/20 border border-border/30 rounded text-xs text-muted-foreground text-center">
          No link has been created yet!
        </div>
      )}
    </div>
  );
}

function LinkItem({
  fileId,
  id,
  revokedAt,
  clickCount,
  createdAt,
  lastAccessedAt,
  passwordProtected,
}: {
  fileId: string;
  id: string;
  createdAt: string;
  clickCount: number;
  revokedAt: string | null;
  passwordProtected: boolean;
  lastAccessedAt: string | null;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
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

  const { mutate, isPending } = useMutation({
    mutationFn: revokeFileLink,
    mutationKey: ["revoke-link"],

    onSuccess: async () => {
      toast.success("Link Revoked");

      await queryClient.invalidateQueries({ queryKey: ["file-links"] });
    },

    onError: (error) => {
      toast.error(error.message);
      if (error.cause === 401) {
        return router.push("/");
      }
    },
  });

  function handleRevoke({ id }: { id: string }) {
    mutate({ fileId, linkId: id });
  }

  const isRevoked = !!revokedAt;

  return (
    <div
      key={id}
      className="bg-secondary/30 border border-border/30 rounded p-3 space-y-3"
    >
      <div className="flex gap-2">
        <input
          readOnly
          type="text"
          value={`${domain}/share/${id}`}
          className="flex-1 px-2 py-2.5 rounded text-xs bg-secondary/50 border border-border/30 text-foreground"
        />

        {!isRevoked && (
          <>
            <Button
              variant={"secondary"}
              onClick={() => handleCopy(id)}
              className={`px-3 py-1 text-xs rounded min-w-14 md:min-w-22 transition-all `}
            >
              {copiedLinkId === id ? "✓" : "Copy"}
            </Button>

            <Button
              variant={"destructive"}
              disabled={isPending || isRevoked}
              onClick={() => handleRevoke({ id })}
              className="px-3 py-1 text-xs rounded min-w-14 md:min-w-22 transition-all"
            >
              {isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : isRevoked ? (
                "Revoked"
              ) : (
                "Revoke"
              )}
            </Button>
          </>
        )}
      </div>

      <div className="flex gap-2 justify-between">
        <LinkDetail
          heading="Created"
          icon={<Calendar1 size={16} />}
          leading={formatDate(createdAt).split(",")[0]}
        />

        <LinkDetail
          heading="Clicks"
          icon={<MousePointerClick size={16} />}
          leading={clickCount.toString()}
        />

        <LinkDetail
          heading="Passworded"
          icon={<Lock size={16} />}
          leading={passwordProtected ? "Yes" : "No"}
        />

        <LinkDetail
          heading="Last Accessed"
          icon={<Calendar1 size={16} />}
          leading={
            lastAccessedAt
              ? new Date(lastAccessedAt).toLocaleDateString()
              : "Never"
          }
        />
      </div>
    </div>
  );
}

function LinkDetail({
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
    <div className="p-3 bg-destructive/5 border items-start flex gap-x-2 border-destructive/20 gap-y-4 shadow-none rounded text-xs text-red-400 tracking-tight font-light">
      <OctagonAlert size={24} /> This file was flagged as unsafe and has been
      automatically deleted. Links cannot be generated.
    </div>
  );
}

function FilePending() {
  return (
    <div className="p-3 bg-yellow-500/10 border items-start flex gap-x-2 border-yellow-500/30 rounded text-xs text-yellow-400 tracking-tight font-light">
      <CircleDashed size={24} className="animate-spin -mt-0.5" /> Scanning in
      progress. Share links will be available once scanning completes.
    </div>
  );
}
