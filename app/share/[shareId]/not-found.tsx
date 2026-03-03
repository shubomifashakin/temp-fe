import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="border p-8 max-w-md w-full gap-y-6 text-center flex flex-col items-center font-mono">
        <div className="space-y-2">
          <h1 className="text-lg font-medium text-heading">Link Not Found</h1>

          <p className="text-sm text-muted-foreground leading-relaxed">
            This link either doesn&apos;t exist or has been revoked by the
            owner.
          </p>
        </div>

        <Link
          href={"/"}
          className="text-xs text-leading text-center font-mono flex items-center gap-1"
        >
          <ArrowLeft className="mr-1 h-3 w-3" /> Back to Temp
        </Link>
      </Card>
    </div>
  );
}
