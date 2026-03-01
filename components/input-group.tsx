import { ReactNode } from "react";

export function InputGroup({
  label,
  error,
  children,
  showRequired = true,
}: {
  label: string;
  children: ReactNode;
  showRequired?: boolean;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label
          title={label}
          className="text-sm font-medium text-heading capitalize"
        >
          {label}
        </label>

        {showRequired && (
          <p className="text-xs text-muted-foreground mt-1">Required</p>
        )}
      </div>

      {children}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
