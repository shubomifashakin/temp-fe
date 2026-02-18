import { JSX } from "react";

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
    <div className="bg-card border-dashed border border-border/50 rounded-lg p-6 hover:border-accent/50 transition-colors">
      <div className="text-3xl mb-4">{icon}</div>

      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>

      <p className="text-sm font-light text-muted-foreground">{description}</p>
    </div>
  );
}
