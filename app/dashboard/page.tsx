"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { FileUp } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";

import { getFiles, Lifetimes, uploadFile } from "@/data-service/mutations";

import { Button } from "@/components/ui/button";
import UploadModal from "@/components/upload-file";

export default function Page() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, error, refetch } = useQuery({
    queryFn: () => getFiles(),
    queryKey: ["dashboard"],
    refetchOnWindowFocus: true,
  });

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

  function handleCopyLink(link: string) {
    navigator.clipboard.writeText(link);
  }

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

  return (
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

      <UploadModal
        isOpen={isModalOpen}
        onUpload={handleUpload}
        isUploading={isUploading}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
