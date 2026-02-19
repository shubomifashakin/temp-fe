const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;

export async function getUserInfo() {
  const response = await fetchWithAuth(`${backendUrl}/users/me`);

  if (!response.ok) {
    throw new Error("Failed to fetch user info", {
      cause: response.status,
    });
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

export async function logout() {
  const response = await fetchWithAuth(`${backendUrl}/auth/logout`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to logout", {
      cause: response.status,
    });
  }

  return response.json();
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  retries = 0,
): Promise<Response> {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if ((response.status === 403 || response.status === 401) && retries < 1) {
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
