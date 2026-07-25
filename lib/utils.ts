import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow, isPast } from "date-fns";
import { twMerge } from "tailwind-merge";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;

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

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  retries = 0,
): Promise<Response> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
    credentials: "include",
  });

  if (response.status === 401 && retries < 1) {
    const refreshRes = await fetch(`${backendUrl}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      return fetchWithAuth(url, options, retries + 1);
    }
  }

  return response;
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries: number = 2,
  delay: number = 1000,
): Promise<Response> {
  let lastError: Error = new Error("Unknown error");

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return response;
      }

      if (response.status >= 400 && response.status < 500) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`, {
          cause: response.status,
        });
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`, {
        cause: response.status,
      });
    } catch (error) {
      const err = error as Error;

      if (options.signal?.aborted || err.name === "AbortError") {
        throw err;
      }

      lastError = err;

      if (attempt < maxRetries) {
        const backoffDelay =
          delay * Math.pow(2, attempt) + Math.random() * 1000;
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      }
    }
  }

  throw lastError;
}

export async function fetchWithAuthAndRetry(
  action: () => Promise<Response>,
  {
    maxRetries = 2,
    delay = 1000,
    signal,
  }: { maxRetries?: number; delay?: number; signal?: AbortSignal } = {},
): Promise<Response> {
  let lastError: Error = new Error("Unknown error");
  let didRefresh = false;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      const response = await action();

      if (response.ok) {
        return response;
      }

      // if it was a 401 and we haven't tried to refresh yet, try to refresh
      if (response.status === 401 && !didRefresh) {
        didRefresh = true;

        const refreshRes = await fetch(`${backendUrl}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        // if refresh was successul, continue witht he request without increasing attempts
        if (refreshRes.ok) continue;
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`, {
        cause: response.status,
      });
    } catch (error) {
      const err = error as Error;

      // if the user aborted, just stop iimmediatly
      if (signal?.aborted || err.name === "AbortError") {
        throw err;
      }

      lastError = err;
      attempt++;

      if (attempt <= maxRetries) {
        const backoffDelay =
          delay * Math.pow(2, attempt - 1) + Math.random() * 1000;

        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      }
    }
  }

  throw lastError;
}

export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions,
) {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  return dateObj.toLocaleDateString("en-US", {
    timeZone: "UTC",
    ...(options || {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
}
