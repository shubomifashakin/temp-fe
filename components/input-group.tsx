import { ReactNode } from "react";

export function InputGroup({
  label,
  children,
  showRequired = true,
}: {
  label: string;
  children: ReactNode;
  showRequired?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label
          title={label}
          className="text-sm font-medium text-heading capitalize tracking-tight"
        >
          {label}
        </label>

        {showRequired && (
          <p className="text-xs text-muted-foreground mt-1">Required</p>
        )}
      </div>

      {children}
    </div>
  );
}
