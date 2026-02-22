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
    <div className="bg-card border border-border/50 rounded-lg p-6 hover:border-accent/50 transition-colors">
      <div className="text-3xl mb-4">{icon}</div>

      <h3 className="text-xl tracking-tight font-semibold text-heading mb-2 font-playfair">
        {title}
      </h3>

      <p className="text-sm font-light text-leading">{description}</p>
    </div>
  );
}
