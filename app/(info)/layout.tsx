"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";
import Hamburger from "@/components/ui/hamburger";

export default function InfoLayout({ children }: { children: ReactNode }) {
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

          <Hamburger
            opened={mobileMenuOpen}
            onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
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

      {children}

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
