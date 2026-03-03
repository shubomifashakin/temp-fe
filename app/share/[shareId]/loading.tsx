import { Loader2Icon } from "lucide-react";

export default function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 font-mono">
        <Loader2Icon className="h-8 w-8 animate-spin text-orange-500" />
        <span className="text-leading text-sm">Fetching link details...</span>
      </div>
    </div>
  );
}
