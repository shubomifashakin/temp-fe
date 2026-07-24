interface UploadProgressProps {
  uploadProgress: number;
}

export function UploadProgress({ uploadProgress }: UploadProgressProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Uploading...</span>
        <span>{uploadProgress}%</span>
      </div>
      <div className="w-full bg-secondary/40 rounded-full h-1.5">
        <div
          className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${uploadProgress}%` }}
        />
      </div>
    </div>
  );
}
