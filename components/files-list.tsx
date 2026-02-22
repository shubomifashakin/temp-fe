import { formatFileSize, getTimeRemaining } from "@/lib/utils";
import { FileDetails } from "@/data-service/mutations";
import {
  File,
  Image,
  Link2,
  Music,
  Video,
  FileText,
  CircleDashed,
  OctagonAlert,
  MousePointerClick,
} from "lucide-react";
import { Card } from "./ui/card";

interface FilesListProps {
  files: FileDetails[];
  onFileSelect: (file: FileDetails) => void;
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

export default function FilesList({ files, onFileSelect }: FilesListProps) {
  if (!files.length) {
    return (
      <div className="flex font-mono flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4 opacity-30">
          <File size={64} strokeWidth={1} />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-heading">No files yet</h2>

          <p className="text-sm text-leading">
            Upload your first file to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 font-mono md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[calc(100vh-200px)] overflow-y-auto  no-scrollbar"
      data-scroll-container="files"
    >
      {files.map((file) => (
        <Card
          key={file.id}
          onClick={() => onFileSelect(file)}
          className="border border-border p-4 cursor-pointer transition-all duration-200 hover:bg-card/80"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="text-3xl">
                {getFileIcon(file.contentType, file.name)}
              </div>

              {file.status !== "safe" && (
                <span
                  className={`px-2 py-1 rounded-sm text-xs font-medium tracking-tight ${
                    file.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-destructive/20 text-destructive"
                  }`}
                >
                  {file.status === "pending" ? (
                    <CircleDashed className="animate-spin" size={16} />
                  ) : (
                    <OctagonAlert size={16} />
                  )}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-heading truncate text-sm">{file.name}</h3>

              <p className="text-xs text-leading mt-1 truncate">
                {file.description}
              </p>
            </div>

            <div className="text-xs text-muted-foreground space-y-2 py-2">
              <div className="flex justify-between">
                <span>Size:</span>

                <span className="text-leading">
                  {formatFileSize(file.size)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Time Left:</span>

                <span
                  className={`${getTimeRemaining(file.expiresAt).includes("Expired") ? "text-destructive" : "text-leading"}`}
                >
                  {getTimeRemaining(file.expiresAt)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-dashed flex justify-between">
              <p className="text-xs text-leading flex gap-x-2">
                <Link2 className="text-orange-500" size={14} />{" "}
                {file.totalLinks} {file.totalLinks === 1 ? "link" : "links"}
              </p>

              <p className="text-xs text-leading flex gap-x-2">
                <MousePointerClick className="text-orange-500" size={14} />{" "}
                {file.totalClicks} {file.totalClicks === 1 ? "click" : "clicks"}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
