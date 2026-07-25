import hash from "object-hash";

import { PART_SIZE_BYTES } from "@/lib/constants";
import { fetchWithRetry, fetchWithAuth } from "@/lib/utils";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;

export type UserInfo = {
  name: string;
  email: string;
  created_at: string;
  picture: string | null;
  updated_at: string;
  subscription: {
    plan: string;
    currentPeriodEnd: string;
    currentPeriodStart: string;
    cancelAtPeriodEnd: boolean;
  };
};

type Plan = {
  amount: number;
  currency: string;
  productId: string;
  name: string;
  benefits: string[];
  interval: string;
};

export type PlanInfo = {
  currency: string;
  provider: string;
  plans: Plan[];
};

export type PlanIntervals = {
  month: PlanInfo[];
  year: PlanInfo[];
};

type Plans = {
  data: PlanIntervals;
};

type FileStatus = "safe" | "pending" | "unsafe" | "unscanned";

export type FileDetails = {
  id: string;
  description: string;
  expiresAt: string;
  size: number;
  status: FileStatus;
  contentType: string;
  name: string;
  totalLinks: number;
  totalClicks: number;
  createdAt: string;
};

type GetFilesResponse = {
  hasNextPage: boolean;
  cursor: string;
  data: FileDetails[];
};

export type SubscriptionInfo = {
  id: string;
  status: string;
  plan: string;
  amount: number;
  currency: string;
  productId: string;
  provider: string;
  cancelledAt: string | null;
  currentPeriodEnd: string;
  currentPeriodStart: string;
  cancelAtPeriodEnd: boolean;
  providerSubscriptionId: string;
};

async function handleRequestError(response: Response) {
  if ([404, 400, 413].includes(response.status)) {
    const message = (await response.json()) as { message: string };

    return new Error(message.message, { cause: response.status });
  }

  if (response.status === 401) {
    return new Error("Unauthorized", { cause: 401 });
  }

  if (response.status === 403) {
    return new Error("Forbidden", { cause: 403 });
  }

  if (response.status === 429) {
    return new Error("Too many Requests", { cause: 429 });
  }

  return new Error("Internal Server Error", { cause: 500 });
}

//users stuff
export async function getUserInfo() {
  const response = await fetchWithAuth(`${backendUrl}/users/me`);

  if (!response.ok) {
    throw await handleRequestError(response);
  }

  return response.json() as Promise<UserInfo>;
}

export async function deleteAccount() {
  const response = await fetchWithAuth(`${backendUrl}/users/me`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw await handleRequestError(response);
  }

  return response.json() as Promise<{
    name: string;
    email: string;
    created_at: string;
    picture: string | null;
    updated_at: string;
    subscription: {
      plan: string;
      current_period_end: string;
      current_period_start: string;
      cancel_at_period_end: boolean;
    };
  }>;
}

export async function updateAccountInfo({ name }: { name: string }) {
  const response = await fetchWithAuth(`${backendUrl}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw await handleRequestError(response);
  }

  return response.json() as Promise<{
    name: string;
    email: string;
    created_at: string;
    picture: string | null;
    updated_at: string;
    subscription: {
      plan: string;
      current_period_end: string;
      current_period_start: string;
      cancel_at_period_end: boolean;
    };
  }>;
}

//subscription stuff
export async function getSubscriptionInfo(): Promise<SubscriptionInfo | null> {
  const response = await fetchWithAuth(`${backendUrl}/subscriptions/current`);

  if (!response.ok) {
    throw await handleRequestError(response);
  }

  const data = (await response.json()) as { data: SubscriptionInfo | null };

  return data.data;
}

export async function cancelSubscription() {
  const response = await fetchWithAuth(`${backendUrl}/subscriptions/current`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw await handleRequestError(response);
  }

  return response.json() as Promise<{ message: string }>;
}

export async function getSubscriptionPlans(): Promise<PlanIntervals> {
  const response = await fetchWithAuth(`${backendUrl}/subscriptions/plans`);

  if (!response.ok) {
    throw await handleRequestError(response);
  }

  const data = (await response.json()) as Plans;

  return data.data;
}

export async function initiateCheckout({
  productId,
  provider,
}: {
  productId: string;
  provider: string;
}) {
  const response = await fetchWithAuth(`${backendUrl}/subscriptions/checkout`, {
    method: "POST",
    body: JSON.stringify({ productId, provider }),
  });

  if (!response.ok) {
    throw await handleRequestError(response);
  }

  const data = (await response.json()) as { url: string };
  console.log("redirect");
  return data;
}

//auth
export async function logout() {
  const response = await fetchWithAuth(`${backendUrl}/auth/logout`, {
    method: "POST",
  });

  if (!response.ok) {
    throw await handleRequestError(response);
  }

  return response.json();
}

//files
export async function getFiles(pageParam?: string) {
  const url = new URL(`${backendUrl}/files`);

  if (pageParam) {
    url.searchParams.append("cursor", pageParam);
  }

  const response = await fetchWithAuth(url.toString());

  if (!response.ok) {
    throw await handleRequestError(response);
  }

  return response.json() as Promise<GetFilesResponse>;
}

export type Lifetimes = "short" | "medium" | "long";

type PresignedPostUploadResponse = {
  type: "presigned-post";
  url: string;
  fields: Record<string, string>;
};

type MultipartUploadResponse = {
  type: "multipart";
  fileId: string;
  key: string;
  uploadId: string;
};

type InitiateUploadResponse =
  | PresignedPostUploadResponse
  | MultipartUploadResponse;

async function uploadFilePresignedPost(
  file: File,
  data: PresignedPostUploadResponse,
): Promise<void> {
  const formData = new FormData();
  Object.entries(data.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append("file", file);

  const uploadResponse = await fetchWithRetry(
    data.url,
    { method: "POST", body: formData },
    2,
    1000,
  );

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload file", { cause: 500 });
  }
}

interface MultipartUploadState {
  fileId: string;
  uploadId: string;
  key: string;
  savedAt: number;
  completedParts: { partNumber: number; etag: string }[];
}

function multipartStateKey(
  name: string,
  description: string,
  file: File,
): string {
  return `multipart:${hash({ name, description, fileName: file.name, fileSize: file.size, lastModified: file.lastModified })}`;
}

function saveMultipartState(
  name: string,
  description: string,
  file: File,
  state: MultipartUploadState,
): void {
  try {
    localStorage.setItem(
      multipartStateKey(name, description, file),
      JSON.stringify(state),
    );
  } catch {}
}

function loadMultipartState(
  name: string,
  description: string,
  file: File,
): MultipartUploadState | null {
  try {
    const raw = localStorage.getItem(
      multipartStateKey(name, description, file),
    );

    if (!raw) return null;

    const state = JSON.parse(raw) as MultipartUploadState;

    const HOURS_24 = 24 * 60 * 60 * 1000;
    if (Date.now() - state.savedAt > HOURS_24) {
      clearMultipartState(name, description, file);

      return null;
    }

    return state;
  } catch {
    return null;
  }
}

function clearMultipartState(
  name: string,
  description: string,
  file: File,
): void {
  try {
    localStorage.removeItem(multipartStateKey(name, description, file));
  } catch {}
}

async function uploadFileMultipart(
  name: string,
  description: string,
  file: File,
  state: MultipartUploadState,
  onProgress?: (pct: number) => void,
  signal?: AbortSignal,
) {
  const { fileId, completedParts: resumedParts } = state;
  const totalParts = Math.ceil(file.size / PART_SIZE_BYTES);
  const parts: { partNumber: number; etag: string }[] = [...resumedParts];
  const completedPartNumbers = new Set(resumedParts.map((p) => p.partNumber));

  if (resumedParts.length > 0) {
    onProgress?.(Math.round((resumedParts.length / totalParts) * 100));
  }

  for (let i = 0; i < totalParts; i++) {
    const partNumber = i + 1;
    if (completedPartNumbers.has(partNumber)) continue;

    const start = i * PART_SIZE_BYTES;
    const end = Math.min(start + PART_SIZE_BYTES, file.size);
    const chunk = file.slice(start, end);

    const signRes = await fetchWithAuth(`${backendUrl}/files/${fileId}/parts`, {
      method: "POST",
      body: JSON.stringify({ partNumber }),
      signal,
    });

    if (!signRes.ok) throw await handleRequestError(signRes);
    const { url } = (await signRes.json()) as { url: string };

    const uploadRes = await fetch(url, {
      method: "PUT",
      body: chunk,
      signal,
    });

    if (!uploadRes.ok) {
      throw new Error("Failed to upload part", { cause: 500 });
    }

    const etag = uploadRes.headers.get("ETag");
    if (!etag) {
      throw new Error("Internal Server Error", { cause: 500 });
    }

    parts.push({ partNumber, etag });
    saveMultipartState(name, description, file, {
      ...state,
      completedParts: parts,
      savedAt: Date.now(),
    });
    onProgress?.(Math.round((partNumber / totalParts) * 100));
  }

  const completeRes = await fetchWithAuth(
    `${backendUrl}/files/${fileId}/complete`,
    {
      method: "POST",
      body: JSON.stringify({ parts }),
    },
  );

  if (!completeRes.ok) throw await handleRequestError(completeRes);

  clearMultipartState(name, description, file);
}

export async function uploadFile({
  file,
  name,
  lifetime,
  description,
  onProgress,
  signal,
}: {
  file: File;
  name: string;
  lifetime: Lifetimes;
  description: string;
  onProgress?: (pct: number) => void;
  signal?: AbortSignal;
}) {
  const savedState = loadMultipartState(name, description, file);

  if (savedState) {
    await uploadFileMultipart(
      name,
      description,
      file,
      savedState,
      onProgress,
      signal,
    );

    return { message: "Success" };
  }

  const response = await fetchWithAuth(`${backendUrl}/files`, {
    method: "POST",
    signal,
    body: JSON.stringify({
      name,
      lifetime,
      description,
      contentType: file.type,
      fileSizeBytes: file.size,
    }),
  });

  if (!response.ok) {
    throw await handleRequestError(response);
  }

  const data = (await response.json()) as InitiateUploadResponse;

  if (data.type === "presigned-post") {
    await uploadFilePresignedPost(file, data);
  } else {
    // store tHE initiallstate
    const state: MultipartUploadState = {
      fileId: data.fileId,
      uploadId: data.uploadId,
      key: data.key,
      savedAt: Date.now(),
      completedParts: [],
    };

    saveMultipartState(name, description, file, state);

    await uploadFileMultipart(
      name,
      description,
      file,
      state,
      onProgress,
      signal,
    );
  }

  return { message: "Success" };
}

export async function deleteFile({ id }: { id: string }) {
  const response = await fetchWithAuth(`${backendUrl}/files/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw await handleRequestError(response);
  }

  return response.json();
}

type LinkDetails = {
  id: string;
  shareId: string;
  revokedAt: string | null;
  createdAt: string;
  clickCount: number;
  expiresAt: string | null;
  description: string;
  lastAccessedAt: string | null;
  passwordProtected: boolean;
};

export type FileLinksResponse = {
  data: LinkDetails[];
  hasNextPage: boolean;
  cursor: string | null;
};

export type LinkDetailsResponse = {
  createdAt: string;
  expiresAt: string | null;
  description: string;
  passwordProtected: boolean;
  fileCreator: string;
  fileStatus: FileStatus;
  fileDescription: string;
  fileName: string;
  fileContentType: string;
  fileSize: number;
  fileExpired: boolean;
  fileUploadedAt: string;
  fileCreatorPicture: string | null;
};

//file links
export async function getFileLinks({
  fileId,
  cursor,
}: {
  fileId: string;
  cursor?: string;
}) {
  const url = new URL(`${backendUrl}/files/${fileId}/links`);

  if (cursor) {
    url.searchParams.append("cursor", cursor);
  }

  const response = await fetchWithAuth(url.toString());

  if (!response.ok) {
    throw await handleRequestError(response);
  }

  return response.json() as Promise<FileLinksResponse>;
}

export async function createFileLink({
  fileId,
  data,
}: {
  fileId: string;
  data: {
    expiresAt: Date | null;
    password: string | null;
    description: string;
  };
}) {
  const response = await fetchWithAuth(`${backendUrl}/files/${fileId}/links`, {
    method: "POST",
    body: JSON.stringify({
      description: data.description.trim(),
      password: data.password,
      expiresAt: data.expiresAt,
    }),
  });

  if (!response.ok) {
    throw await handleRequestError(response);
  }

  return response.json();
}

export async function revokeFileLink({
  fileId,
  linkId,
}: {
  fileId: string;
  linkId: string;
}) {
  const response = await fetchWithAuth(
    `${backendUrl}/files/${fileId}/links/${linkId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw await handleRequestError(response);
  }

  return response.json();
}

//links
export async function getLinkDetails({ linkId }: { linkId: string }) {
  const url = new URL(`${backendUrl}/links/${linkId}`);

  const response = await fetchWithAuth(url.toString());

  if (!response.ok) {
    throw await handleRequestError(response);
  }

  return response.json() as Promise<LinkDetailsResponse>;
}

export async function getLinkedFile({
  linkId,
  password,
}: {
  linkId: string;
  password: string | null;
}) {
  const url = new URL(`${backendUrl}/links/${linkId}`);

  const response = await fetchWithAuth(url.toString(), {
    method: "POST",
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    throw await handleRequestError(response);
  }

  return response.json() as Promise<{ url: string }>;
}

//cli
export async function confirmCli({
  code,
  state,
}: {
  code: string;
  state: string;
}) {
  const response = await fetchWithAuth(
    `${backendUrl}/auth/cli/confirm?code=${code}&state=${state}`,
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    throw await handleRequestError(response);
  }

  return response.json();
}
