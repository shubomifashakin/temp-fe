import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Clock, ArrowLeft } from "lucide-react";

import { Card } from "@/components/ui/card";
import LinkAccessForm from "@/components/link-access-form";

import { getLinkDetails } from "@/data-service/mutations";
import { formatDate, formatFileSize, getTimeRemaining } from "@/lib/utils";

type Props = {
  params: Promise<{ shareId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { shareId } = await params;

    const linkDetails = await getLinkDetails({ linkId: shareId });

    return {
      category: "File",
      applicationName: "Temp",
      title: linkDetails.fileName,
      keywords: ["Temp", "File", "Link"],
      description: linkDetails.description,
      authors: [{ name: linkDetails.fileCreator }],
      openGraph: {
        type: "website",
        title: linkDetails.fileName,
        description: linkDetails.description,
        images: ["https://temp.545plea.xyz/opengraph-image.png"],
      },
      twitter: {
        card: "summary",
        title: linkDetails.fileName,
        creator: linkDetails.fileCreator,
        description: linkDetails.description,
        images: ["https://temp.545plea.xyz/twitter-image.png"],
      },
    };
  } catch {
    return {
      title: "Temp - File Sharing Made Easy",
      description: "Secure ephemeral file sharing made easy!",
    };
  }
}

export default async function LinkDetailsPage({ params }: Props) {
  const { shareId } = await params;

  const data = await getLinkDetails({ linkId: shareId }).catch((error) => {
    if (error instanceof Error) {
      if (error.cause === 404) {
        notFound();
      }
    }

    throw error;
  });

  const linkHasExpired =
    !!data.expiresAt && new Date() > new Date(data.expiresAt);

  const uploadedAt = formatDate(data.fileUploadedAt);

  const expiresDate = data.expiresAt ? formatDate(data.expiresAt) : null;

  if (data.fileExpired || linkHasExpired) {
    const heading = data.fileExpired ? "File Expired" : "Link Expired";

    const leading = data.fileExpired
      ? "This file has expired and is no longer accessible."
      : "This link has expired and is no longer accessible.";

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="border rounded p-8 max-w-md w-full gap-y-2 text-center font-mono">
          <div className="flex justify-center">
            <Clock size={32} className=" text-yellow-600" />
          </div>

          <h1 className="text-lg text-heading">{heading}</h1>

          <p className="text-sm text-leading">{leading}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <Card className="w-full max-w-lg border rounded p-8 space-y-2 font-mono">
        <Link
          className="text-xs text-leading font-mono flex items-center gap-1"
          href={"/"}
        >
          <ArrowLeft className="mr-1 h-3 w-3" /> Back to Temp
        </Link>

        <div className="space-y-6">
          <div className="space-y-2 border-b border-dashed pb-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                {data.fileCreatorPicture ? (
                  <Image
                    src={data.fileCreatorPicture}
                    alt={data.fileCreator}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs text-leading">
                    {data.fileCreator.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-lg text-heading truncate">
                  {data.fileName}
                </h1>

                <p className="text-xs text-leading">{data.fileCreator}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-leading text-xs uppercase">Size</span>

              <span className="text-heading text-xs">
                {formatFileSize(data.fileSize)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-leading text-xs uppercase">
                Content Type
              </span>

              <span className="text-heading text-xs">
                {data.fileContentType}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-leading text-xs uppercase">Uploaded</span>

              <span className="text-heading text-xs">{uploadedAt}</span>
            </div>

            {expiresDate && (
              <div className="flex justify-between">
                <span className="text-leading text-xs uppercase">Expires</span>

                <span className="text-heading text-xs">{expiresDate}</span>
              </div>
            )}

            {data.expiresAt && (
              <div className="flex justify-between">
                <span className="text-leading text-xs uppercase">
                  Time Left
                </span>

                <span className="text-heading text-xs">
                  {getTimeRemaining(data.expiresAt)}
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-dashed" />

          <div className="space-y-2">
            <h3 className="text-xs text-leading uppercase">Description</h3>
            <p className="text-sm text-heading">{data.fileDescription}</p>
          </div>

          <LinkAccessForm
            shareId={shareId}
            isPasswordProtected={data.passwordProtected}
          />

          <div className="border-t border-dashed pt-4 gap-y-2 text-center flex flex-col items-center">
            <p className="text-xs text-leading font-mono">
              Shared Securely • Link created{" "}
              {new Date(data.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>

            <div className="text-xs text-muted-foreground space-y-2">
              <p>Having issues with this file?</p>
              <a
                href="mailto:apps@545plea.xyz"
                className="text-orange-500 border-b border-dashed border-orange-500 transition-colors font-medium"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
