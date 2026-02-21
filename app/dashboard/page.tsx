"use client";
import { useState, useEffect, Activity } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { FileUp } from "lucide-react";
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { cn } from "@/lib/utils";

import {
  getFiles,
  Lifetimes,
  uploadFile,
  FileDetails,
} from "@/data-service/mutations";

import { Button } from "@/components/ui/button";
import UploadModal from "@/components/upload-file";
import FilesList from "@/components/files-list";

export default function Page() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["dashboard"],
      initialPageParam: undefined,
      refetchOnWindowFocus: true,
      getNextPageParam: (lastPage) => lastPage.cursor,
      queryFn: ({ pageParam }: { pageParam?: string }) =>
        getFiles(pageParam || undefined),
    });

  const files = data?.pages.flatMap((page) => page.data) || [];

  const { mutate, isPending: isUploading } = useMutation({
    mutationFn: uploadFile,
    mutationKey: ["upload-file"],

    onSuccess: async () => {
      setIsModalOpen(false);
      toast.success("File Uploaded!");
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    onError: (error) => {
      toast.error(error.message);

      if (error.cause === 401) {
        return router.push("/");
      }
    },
  });

  function handleUpload({
    file,
    name,
    lifetime,
    description,
  }: {
    file: File;
    name: string;
    lifetime: Lifetimes;
    description: string;
  }) {
    mutate({ file, name, lifetime, description });
  }

  function handleFileSelect(file: FileDetails) {
    console.log(file);
    //FIXME: HANDLE THIS
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.scrollTop + target.clientHeight >= target.scrollHeight - 100) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    const filesList = document.querySelector('[data-scroll-container="files"]');
    if (filesList) {
      filesList.addEventListener("scroll", handleScroll);
      return () => filesList.removeEventListener("scroll", handleScroll);
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <h2 className="text-3xl font-bold text-heading font-playfair tracking-tighter">
            Files
          </h2>

          <p className="text-sm text-leading tracking-tight font-light">
            Manage your uploaded files.
          </p>
        </div>

        <Button
          className={cn("primary-btn font-mono text-sm tracking-tight")}
          onClick={() => setIsModalOpen(true)}
        >
          Upload File
          <FileUp />
        </Button>
      </div>

      <FilesList files={files} onFileSelect={handleFileSelect} />

      <Activity mode={isModalOpen ? "visible" : "hidden"}>
        <UploadModal
          onUpload={handleUpload}
          isUploading={isUploading}
          onClose={() => setIsModalOpen(false)}
        />
      </Activity>
    </div>
  );
}
