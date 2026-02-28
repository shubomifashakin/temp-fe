import { JSX } from "react";
import { Card } from "./ui/card";

export function Feature({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: JSX.Element;
}) {
  return (
    <Card className="bg-card border gap-4 border-border/50 rounded p-6! m-0 min-h-0 hover:border-accent/50 transition-colors">
      <div className="text-3xl">{icon}</div>

      <div className="space-y-2">
        <h3 className="text-base font-semibold text-heading">{title}</h3>

        <p className="text-sm text-leading">{description}</p>
      </div>
    </Card>
  );
}
