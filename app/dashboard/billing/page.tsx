"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AlertTriangle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvailablePlans } from "@/components/available-plans";
import {
  cancelSubscription,
  getSubscriptionInfo,
  getSubscriptionPlans,
  type SubscriptionInfo,
} from "@/data-service/mutations";

export default function SettingsPage() {
  const {
    data: subscriptionData,
    status: subscriptionStatus,
    refetch: subscriptionRefetch,
  } = useQuery({
    queryFn: getSubscriptionInfo,
    queryKey: ["subscription-info"],
  });

  const {
    data: plans,
    status: plansStatus,
    refetch: plansRefetch,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: getSubscriptionPlans,
  });

  return (
    <div className="w-full space-y-10 font-mono">
      {subscriptionStatus === "pending" && <LoadingState />}

      {subscriptionStatus === "success" && (
        <SubscriptionInfo data={subscriptionData} />
      )}

      {subscriptionStatus === "error" && (
        <ErrorState
          onRetry={() => subscriptionRefetch()}
          message="We couldn't get your subscription details. Please try again."
        />
      )}

      {plansStatus === "pending" && <LoadingState />}

      {plansStatus === "success" && (
        <AvailablePlans
          plans={plans}
          currentPlanId={subscriptionData?.productId}
        />
      )}

      {plansStatus === "error" && (
        <ErrorState
          message="We couldn't load the available plans. Please try again."
          onRetry={() => plansRefetch()}
        />
      )}
    </div>
  );
}

function SubscriptionInfo({ data }: { data: SubscriptionInfo | null }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isCanceling, setIsCanceling] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: cancelSubscription,

    onSuccess: async () => {
      setIsCanceling(false);
      toast.success("Subscription Canceled!");

      await queryClient.invalidateQueries({ queryKey: ["subscription-info"] });
    },

    onError: (error) => {
      toast.error(error.message);

      if (error.cause === 401) {
        return router.push("/");
      }
    },
  });

  return (
    <Card className="p-6 border border-border shadow-none gap-y-4">
      <div className="space-y-0.5">
        <h2 className="text-3xl font-bold text-heading font-playfair tracking-tight">
          Billing Information
        </h2>

        <p className="text-sm text-leading tracking-tight font-light">
          Manage your billing and subscription information.
        </p>
      </div>

      <div className="space-y-4">
        {!data && (
          <p className="text-sm tracking-tight font-light text-orange-500">
            You have no active subscription at the moment.
          </p>
        )}

        {data && (
          <div className="font-light text-sm tracking-tight flex flex-wrap justify-between md:justify-normal gap-4">
            <p>
              Current Plan: <span className="text-orange-500">{data.plan}</span>
            </p>

            <p>
              Started:{" "}
              <span className="text-orange-500">
                {new Date(data.currentPeriodStart).toLocaleDateString()}
              </span>
            </p>

            <p>
              Ends:{" "}
              <span className="text-orange-500">
                {new Date(data.currentPeriodEnd).toLocaleDateString()}
              </span>
            </p>

            <p>
              Renews:{" "}
              <span
                className={
                  data.cancelAtPeriodEnd ? "text-red-500" : "text-green-500"
                }
              >
                {data.cancelAtPeriodEnd ? "No" : "Yes"}
              </span>
            </p>
          </div>
        )}

        {!isCanceling && data && !data.cancelAtPeriodEnd && (
          <Button
            variant="destructive"
            className="cursor-pointer tracking-tight font-medium"
            onClick={() => setIsCanceling(true)}
          >
            Cancel Subscription
          </Button>
        )}

        {isCanceling && (
          <div className="space-y-4 p-4 bg-background border border-destructive/20 rounded-lg">
            <p className="text-sm font-light text-heading">
              Are you sure you want to cancel your subscription?
            </p>

            <p className="text-xs text-leading font-light tracking-tight">
              This will cancel your subscription at the end of the current
              billing period.
            </p>

            <div className="flex gap-2">
              <Button
                disabled={isPending}
                variant={"secondary"}
                onClick={() => setIsCanceling(false)}
                className="cursor-pointer hover:bg-secondary/80 text-foreground font-medium"
              >
                Cancel
              </Button>

              <Button
                disabled={isPending}
                variant="destructive"
                className="cursor-pointer font-medium"
                onClick={() => mutate()}
              >
                {isPending ? "Canceling..." : "Cancel"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function LoadingState() {
  return (
    <Card className="p-6 bg-card border border-border">
      <div className="animate-pulse space-y-4">
        <div className="space-y-6">
          <div>
            <div className="h-4 bg-muted rounded w-1/4 mb-3"></div>
          </div>
          <div>
            <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
          <div>
            <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-muted/50 rounded"></div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <Card className="p-6 bg-card border border-border shadow-none font-mono">
      <div className="text-center space-y-1">
        <AlertTriangle className="size-10 mx-auto" />

        <h3 className="text-lg font-medium text-heading">
          Oops! Something went wrong...
        </h3>

        <p className="text-leading text-sm">{message}</p>

        <Button variant="secondary" onClick={onRetry} className="mt-4">
          Try Again
        </Button>
      </div>
    </Card>
  );
}
