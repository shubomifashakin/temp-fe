import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import {
  PlanInfo,
  PlanIntervals,
  initiateCheckout,
} from "@/data-service/mutations";

interface AvailablePlansProps {
  plans: PlanIntervals;
  currentPlanId?: string;
}

function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency.toUpperCase()} ${amount.toLocaleString()}`;
  }
}

export function AvailablePlans({ plans, currentPlanId }: AvailablePlansProps) {
  const router = useRouter();
  const [interval, setInterval] = useState<"month" | "year">("month");

  const { mutate: checkoutPlan, isPending: isCheckingOut } = useMutation({
    mutationFn: initiateCheckout,

    onSuccess: async (data) => {
      window.location.href = data.url;
    },

    onError: (error) => {
      toast.error(error.message);

      if (error.cause === 401) {
        return router.push("/");
      }
    },
  });

  function handleGenerateCheckoutUrl({
    productId,
    provider,
  }: {
    productId: string;
    provider: string;
  }) {
    checkoutPlan({ productId, provider });
  }

  const hasMonthly =
    plans.month.length > 0 && plans.month.some((p) => p.plans.length > 0);
  const hasYearly =
    plans.year.length > 0 && plans.year.some((p) => p.plans.length > 0);
  const showToggle = hasMonthly && hasYearly;

  const activePlanInfos: PlanInfo[] =
    interval === "month" ? plans.month : plans.year;

  const allPlans = activePlanInfos.flatMap((providerInfo) =>
    providerInfo.plans.map((plan) => ({
      ...plan,
      provider: providerInfo.provider,
    })),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-2">
          <h2 className="text-3xl tracking-tight text-heading font-playfair font-semibold">
            Available Plans
          </h2>

          <p className="text-sm text-leading tracking-tight">
            Available plans across all payment providers.
          </p>
        </div>

        {showToggle && (
          <div className="flex items-center gap-1 bg-secondary rounded-full p-1">
            <button
              onClick={() => setInterval("month")}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm cursor-pointer font-medium transition-all duration-200 tracking-tight",
                interval === "month"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Monthly
            </button>

            <button
              onClick={() => setInterval("year")}
              className={cn(
                "px-4 py-1.5 rounded-full cursor-pointer text-sm font-medium transition-all duration-200 tracking-tight",
                interval === "year"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Yearly
            </button>
          </div>
        )}
      </div>

      {!allPlans.length ? (
        <p className="text-leading text-sm tracking-tight">
          No plans available for this interval.
        </p>
      ) : (
        <div
          className={cn(
            "grid gap-4",
            allPlans.length === 1 && "grid-cols-1 max-w-sm",
            allPlans.length === 2 && "grid-cols-1 sm:grid-cols-2",
            allPlans.length >= 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {allPlans.map((plan, index) => {
            const isCurrentPlan = currentPlanId === plan.productId;
            const isRecommended = index === Math.floor(allPlans.length / 2);

            return (
              <div
                className="relative"
                key={`${plan.productId}-${plan.interval}`}
              >
                {isRecommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                      Recommended
                    </span>
                  </div>
                )}

                <Card
                  className={cn(
                    "flex flex-col h-full transition-all duration-200 border hover:bg-card/80",
                  )}
                >
                  <CardHeader className="pb-2">
                    <h3 className="text-2xl font-playfair font-bold text-heading capitalize">
                      {plan.name}
                    </h3>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl text-heading tracking-tight font-bold">
                        {formatAmount(plan.amount, plan.currency)}
                      </span>

                      <span className="text-sm text-leading">
                        {" "}
                        /{interval === "month" ? "month" : "year"}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 pb-2">
                    <ul className="space-y-2.5">
                      {plan.benefits.map((benefit, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2.5 text-sm text-foreground"
                        >
                          <Check className="h-4 w-4 shrink-0 text-orange-500" />

                          <span className="text-sm font-light tracking-tight">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-0">
                    {isCurrentPlan ? (
                      <Button
                        variant="outline"
                        disabled
                        className="w-full text-muted-foreground border-border cursor-default"
                      >
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          handleGenerateCheckoutUrl({
                            provider: plan.provider,
                            productId: plan.productId,
                          })
                        }
                        disabled={isCheckingOut}
                        className={cn("w-full font-semibold primary-btn")}
                      >
                        {isCheckingOut ? "Processing..." : "Upgrade"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
