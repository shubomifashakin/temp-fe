const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;

export async function getUserInfo() {
  const response = await fetch(`${backendUrl}/users/me`, {
    credentials: "include",
  });

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
  const response = await fetch(`${backendUrl}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to logout", {
      cause: response.status,
    });
  }

  return response.json();
}
