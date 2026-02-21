"use client";

import React, { useState, useRef, ReactNode } from "react";
import { toast } from "sonner";

import { FileUp, Loader2Icon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Lifetimes } from "@/data-service/mutations";

interface UploadModalProps {
  isUploading: boolean;
  onClose: () => void;
  onUpload: (data: {
    file: File;
    name: string;
    description: string;
    lifetime: Lifetimes;
  }) => void;
}

const ALLOWED_EXTENSIONS = [
  "mp4",
  "pdf",
  "docx",
  "doc",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "txt",
  "xlsx",
  "xls",
  "zip",
  "rar",
];

const lifetimes: { value: Lifetimes; label: string }[] = [
  { value: "short", label: "7 days" },
  { value: "medium", label: "14 days" },
  { value: "long", label: "31 days" },
];

export default function UploadModal({
  onClose,
  onUpload,
  isUploading,
}: UploadModalProps) {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [lifetime, setLifetime] = useState<Lifetimes>("short");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(selectedFile: File) {
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(ext || "")) {
      return toast.error("File type not supported");
    }

    if (selectedFile.size > 500 * 1024 * 1024) {
      return toast.error("File size exceeds 150MB limit");
    }

    setFile(selectedFile);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }

  function handleSubmit() {
    if (!file || !name || !description) {
      return toast.error("Please fill in all required fields");
    }

    onUpload({ file, description, lifetime, name });
  }

  function handleClose() {
    setName("");
    setFile(null);
    setDescription("");
    setLifetime("short");
    onClose();
  }

  const canUpload =
    name.length >= 5 && description.length >= 5 && file && lifetime;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 dark font-mono">
      <div className="w-full max-w-md bg-card border border-border/50 rounded-lg shadow-2xl">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl tracking-tighter font-playfair font-bold text-heading">
              Upload File
            </h2>

            <button
              onClick={handleClose}
              className="text-lg text-muted-foreground cursor-pointer hover:text-orange-500 transition-colors"
            >
              <X />
            </button>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-accent bg-accent/10"
                : "border-border/50 hover:border-accent hover:bg-accent/5"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
              className="hidden"
              accept={ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(",")}
            />

            <div className="space-y-2 flex flex-col justify-center items-center">
              <div className="text-4xl opacity-80">
                <FileUp strokeWidth={1.5} />
              </div>

              <div>
                <p className="font-medium text-foreground text-sm tracking-tight">
                  {file ? file.name : "Drag & drop your file here"}
                </p>

                <p className="text-xs font-light text-muted-foreground mt-1">
                  {file ? "Click to change" : "or click to browse"}
                </p>
              </div>
            </div>
          </div>

          {file && (
            <div className="bg-secondary/30 border border-border/30 p-3 rounded-lg text-sm text-foreground">
              <div className="flex justify-between text-sm tracking-tight">
                <span className="text-leading">Size:</span>

                <span className="font-medium tracking-tight">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          )}

          <InputGroup label="Name">
            <input
              required
              type="text"
              value={name}
              minLength={5}
              maxLength={50}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for this file..."
              className="w-full p-3 rounded-lg border border-border/50 bg-secondary/20 text-foreground placeholder:text-muted-foreground placeholder:text-xs tracking-tight focus:outline-none focus:ring-1 focus:ring-accent text-sm"
            />
          </InputGroup>

          <InputGroup label="Description">
            <textarea
              rows={3}
              required
              value={description}
              placeholder="Why did you upload this file?"
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg  border border-border/50 placeholder:text-xs tracking-tight max-h-24 min-h-20 bg-secondary/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent text-sm"
            />
          </InputGroup>

          <InputGroup label="Retention" showRequired={false}>
            <div className="grid grid-cols-3 gap-2">
              {lifetimes.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setLifetime(option.value as Lifetimes)}
                  className={`p-3 rounded-lg cursor-pointer border transition-colors duration-150 text-center ${
                    lifetime === option.value
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-border/50 hover:border-orange-500 hover:bg-orange-500/10"
                  }`}
                >
                  <div className="font-medium text-foreground text-sm tracking-tight">
                    {option.label}
                  </div>
                </button>
              ))}
            </div>
          </InputGroup>

          <div className="flex gap-3 pt-4 items-center">
            <Button
              variant={"secondary"}
              onClick={handleClose}
              disabled={isUploading}
              className="flex-1 hover:bg-secondary/80 text-foreground font-medium text-sm tracking-tight"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={!canUpload || isUploading}
              className="flex-1 primary-btn text-accent-foreground font-semibold text-sm tracking-tight disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload{" "}
              {isUploading ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <FileUp />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputGroup({
  label,
  children,
  showRequired = true,
}: {
  label: string;
  children: ReactNode;
  showRequired?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label
          title={label}
          className="text-sm  font-medium text-heading capitalize tracking-tight"
        >
          {label}
        </label>

        {showRequired && (
          <p className="text-xs text-muted-foreground mt-1">Required</p>
        )}
      </div>

      {children}
    </div>
  );
}
