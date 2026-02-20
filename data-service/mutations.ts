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

export async function getUserInfo() {
  const response = await fetchWithAuth(`${backendUrl}/users/me`);

  if (!response.ok) {
    throw await handleRequestError(response);
  }

  return response.json() as Promise<UserInfo>;
}

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

export async function logout() {
  const response = await fetchWithAuth(`${backendUrl}/auth/logout`, {
    method: "POST",
  });

  if (!response.ok) {
    throw await handleRequestError(response);
  }

  return response.json();
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
