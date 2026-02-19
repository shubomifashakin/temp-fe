"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background font-mono">
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-playfair font-bold text-foreground">
            Temp
          </h2>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href={"/"}
              className={`text-sm cursor-pointer font-medium transition-colors ${"text-muted-foreground hover:text-orange-500 hover:border-orange-500 hover:border-b border-dashed"}`}
            >
              Home
            </Link>

            <Link
              href={"/#features"}
              className={`text-sm cursor-pointer font-medium transition-colors ${"text-muted-foreground hover:text-orange-500 hover:border-orange-500 hover:border-b border-dashed"}`}
            >
              Features
            </Link>

            <Link
              href={"/#pricing"}
              className={`text-sm cursor-pointer font-medium transition-colors ${"text-muted-foreground hover:text-orange-500 hover:border-orange-500 hover:border-b border-dashed"}`}
            >
              Pricing
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Button
              variant={"link"}
              asChild
              className="w-fit font-medium! cursor-pointer text-sm no-underline! border-b rounded-none p-0! h-fit border-dashed border-transparent hover:border-orange-500 hover:text-orange-500 transition-colors"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>

          <button
            aria-label="Toggle menu"
            className="md:hidden cursor-pointer group  flex flex-col gap-1.5 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div
              className={`w-6 h-0.5 bg-foreground group-hover:bg-orange-500 transition-all ${
                mobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-foreground group-hover:bg-orange-500 transition-all ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-foreground group-hover:bg-orange-500 transition-all ${
                mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></div>
          </button>
        </div>

        <div
          className={`pointer-events-none opacity-0 transition-opacity md:hidden md:pointer-events-none! ${mobileMenuOpen ? "opacity-100 pointer-events-auto!" : ""} absolute w-full top-full border-t border-border/50 bg-background/95 backdrop-blur-sm`}
        >
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
            <Link
              href={"/"}
              className={`text-sm cursor-pointer font-medium transition-colors text-left py-2 ${"text-muted-foreground hover:text-orange-500"}`}
            >
              Home
            </Link>

            <Link
              href={"/#features"}
              className={`text-sm cursor-pointer font-medium transition-colors text-left py-2 ${"text-muted-foreground hover:text-orange-500"}`}
            >
              Features
            </Link>

            <Link
              href={"/#pricing"}
              className={`text-sm cursor-pointer font-medium transition-colors text-left py-2 ${"text-muted-foreground hover:text-orange-500"}`}
            >
              Pricing
            </Link>

            <Button
              asChild
              variant={"link"}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left! justify-start font-medium! cursor-pointer text-sm no-underline! rounded-none p-0! hover:text-orange-500 transition-colors"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </nav>

      <section className="min-h-screen pt-20">
        <div className="max-w-4xl space-y-12 px-4 mx-auto w-full">
          <div className="space-y-3">
            <h1 className="text-6xl font-playfair font-bold text-foreground text-balance tracking-tight">
              Privacy Policy
            </h1>

            <p className="text-muted-foreground font-light text-sm">
              Last updated: February 19, 2025
            </p>
          </div>

          <div className="space-y-12 pb-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
                1. Introduction
              </h2>

              <p className="text-foreground font-light text-sm leading-relaxed">
                Temp (&quot;we,&quot; &quot;us,&quot; &quot;our,&quot; or
                &quot;Company&quot;) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you visit our website and use
                our services.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
                2. Information We Collect
              </h2>

              <p className="text-foreground font-light text-sm leading-relaxed">
                We collect information in the following ways:
              </p>

              <ul className="list-disc font-light text-sm list-inside space-y-2 text-foreground">
                <li>
                  <span className="font-semibold">Account Information:</span>{" "}
                  When you create an account, we collect your email address and
                  profile information.
                </li>
                <li>
                  <span className="font-semibold">File Information:</span> We
                  collect metadata about files you upload, including file name,
                  size, type, and upload time.
                </li>
                <li>
                  <span className="font-semibold">Usage Data:</span> We
                  automatically collect information about how you interact with
                  our Service, including downloads, shares, and access times.
                </li>
                <li>
                  <span className="font-semibold">Device Information:</span> We
                  collect information about your device, browser type, IP
                  address, and referral source.
                </li>
                <li>
                  <span className="font-semibold">Cookies:</span> We use cookies
                  to enhance your experience and track usage patterns.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
                3. How We Use Your Information
              </h2>

              <p className="text-foreground font-light text-sm leading-relaxed">
                We use the information we collect to:
              </p>

              <ul className="list-disc font-light text-sm list-inside space-y-2 text-foreground">
                <li>Provide, maintain, and improve our Services</li>
                <li>Process transactions and send related information</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Generate analytics and improve user experience</li>
                <li>Detect and prevent fraud and abuse</li>
                <li>Comply with legal obligations</li>
                <li>Send marketing communications (with your consent)</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
                4. File Security and Scanning
              </h2>

              <p className="text-foreground font-light text-sm leading-relaxed">
                All files uploaded to Temp are automatically scanned for viruses
                and malware. We may analyze file contents to ensure compliance
                with our Terms of Service. Your files are encrypted during
                transmission and storage, but we cannot guarantee absolute
                security.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
                5. Data Retention
              </h2>

              <p className="text-foreground font-light text-sm leading-relaxed">
                Files are automatically deleted from our servers after the
                retention period you selected (7, 14, or 31 days). Account
                information and usage analytics are retained until you delete
                your account. Deleted data cannot be recovered.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
                6. Data Sharing and Disclosure
              </h2>

              <p className="text-foreground font-light text-sm leading-relaxed">
                We do not sell your personal information to third parties. We
                may share information with:
              </p>

              <ul className="list-disc list-inside font-light space-y-2 text-sm text-foreground">
                <li>
                  <span className="font-semibold">Service Providers:</span>{" "}
                  Third-party vendors who help us operate our Service (hosting,
                  analytics, payment processing).
                </li>

                <li>
                  <span className="font-semibold">Legal Authorities:</span> When
                  required by law or to protect our rights and safety.
                </li>

                <li>
                  <span className="font-semibold">Business Transfers:</span> In
                  the event of merger, acquisition, or asset sale.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
                7. Your Privacy Rights
              </h2>

              <p className="text-foreground font-light text-sm leading-relaxed">
                Depending on your location, you may have the following rights:
              </p>

              <ul className="list-disc list-inside font-light space-y-2 text-sm text-foreground">
                <li>Right to access your personal information</li>
                <li>Right to correct inaccurate information</li>
                <li>Right to delete your information</li>
                <li>Right to opt-out of marketing communications</li>
                <li>Right to data portability</li>
              </ul>

              <p className="text-foreground font-light text-sm leading-relaxed">
                To exercise these rights, please contact us at{" "}
                <a
                  href="mailto:apps@545plea.xyz"
                  className="text-sm font-light border-b border-orange-500 transition-colors duration-150 w-fit border-dashed text-orange-500"
                >
                  apps@545plea.xyz.
                </a>
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
                8. Third-Party Links
              </h2>

              <p className="text-foreground font-light text-sm leading-relaxed">
                Our Service may contain links to third-party websites. We are
                not responsible for their privacy practices. We encourage you to
                review their privacy policies before sharing information.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
                9. Children&apos;s Privacy
              </h2>

              <p className="text-foreground font-light text-sm leading-relaxed">
                Our Service is not intended for children under 13. We do not
                knowingly collect information from children under 13. If we
                become aware of such collection, we will delete the information
                immediately.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
                10. Security
              </h2>

              <p className="text-foreground font-light text-sm leading-relaxed">
                We implement industry-standard security measures to protect your
                information from unauthorized access, alteration, and
                disclosure. However, no method of transmission over the internet
                is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
                11. Changes to This Privacy Policy
              </h2>

              <p className="text-foreground font-light text-sm leading-relaxed">
                We may update this Privacy Policy to reflect changes in our
                practices or legal requirements. We will notify you of material
                changes via email or by posting the updated policy on our
                website. Your continued use constitutes acceptance of the
                updated policy.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
                12. Contact Us
              </h2>

              <p className="text-foreground font-light text-sm leading-relaxed">
                If you have questions about this Privacy Policy or our privacy
                practices, please contact us at:
              </p>

              <div className="space-y-2 text-foreground">
                <a
                  href="mailto:apps@545plea.xyz"
                  className="block text-sm font-light border-b border-orange-500 transition-colors duration-150 w-fit border-dashed text-orange-500"
                >
                  <span className="font-medium text-sm">Email:</span>{" "}
                  apps@545plea.xyz
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row  gap-4 items-center justify-between">
          <div className="flex items-center gap-x-3">
            <h3 className="text-lg font-playfair font-bold text-foreground">
              Temp
            </h3>

            <span className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Temp. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/terms-of-service"
              className="text-xs text-muted-foreground hover:text-orange-500 hover:border-orange-500 border-b border-transparent duration-150 border-dashed transition-colors"
            >
              Terms of Service
            </Link>

            <Link
              href="/privacy-policy"
              className="text-xs text-muted-foreground hover:text-orange-500 hover:border-orange-500 border-b border-transparent duration-150 border-dashed transition-colors"
            >
              Privacy Policy
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <p className="text-xs text-muted-foreground">
              Built with ❤️ by{" "}
              <a
                target="_blank"
                href="https://545plea.xyz"
                className="no-underline! border-dashed border-b text-orange-500 border-orange-500 transition-colors duration-150"
              >
                Fashakin Olashubomi
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
