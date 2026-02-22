import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow, isPast } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateProfileImage(name: string, size: number = 128) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=random&color=fff`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

export function getTimeRemaining(expiresAt: string): string {
  const expires = new Date(expiresAt);

  if (isPast(expires)) return "Expired";

  const timeLeft = formatDistanceToNow(expires, { addSuffix: false });
  return `${timeLeft} left`;
}
