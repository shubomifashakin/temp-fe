"use client";

import { useState } from "react";
import Link from "next/link";

import {
  LinkIcon,
  LockIcon,
  ClockIcon,
  GlobeIcon,
  FolderIcon,
  ChartBarIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Feature } from "@/components/ui/features";

export default function Home() {
  const [activeNav, setActiveNav] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setActiveNav(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-background font-mono">
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-playfair font-bold text-foreground">
            Temp
          </h2>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("home")}
              className={`text-sm cursor-pointer font-medium transition-colors ${
                activeNav === "home"
                  ? "text-orange-500 border-dashed border-orange-500 border-b"
                  : "text-muted-foreground hover:text-orange-500 hover:border-orange-500 hover:border-b border-dashed"
              }`}
            >
              Home
            </button>

            <button
              onClick={() => scrollToSection("features")}
              className={`text-sm cursor-pointer font-medium transition-colors ${
                activeNav === "features"
                  ? "text-orange-500 border-dashed border-orange-500 border-b"
                  : "text-muted-foreground hover:text-orange-500 hover:border-orange-500 hover:border-b border-dashed"
              }`}
            >
              Features
            </button>

            <button
              onClick={() => scrollToSection("pricing")}
              className={`text-sm cursor-pointer font-medium transition-colors ${
                activeNav === "pricing"
                  ? "text-orange-500 border-dashed border-orange-500 border-b"
                  : "text-muted-foreground hover:text-orange-500 hover:border-orange-500 hover:border-b border-dashed"
              }`}
            >
              Pricing
            </button>
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
            <button
              onClick={() => scrollToSection("home")}
              className={`text-sm cursor-pointer font-medium transition-colors text-left py-2 ${
                activeNav === "home"
                  ? "text-orange-500"
                  : "text-muted-foreground hover:text-orange-500"
              }`}
            >
              Home
            </button>

            <button
              onClick={() => scrollToSection("features")}
              className={`text-sm cursor-pointer font-medium transition-colors text-left py-2 ${
                activeNav === "features"
                  ? "text-orange-500"
                  : "text-muted-foreground hover:text-orange-500"
              }`}
            >
              Features
            </button>

            <button
              onClick={() => scrollToSection("pricing")}
              className={`text-sm cursor-pointer font-medium transition-colors text-left py-2 ${
                activeNav === "pricing"
                  ? "text-orange-500"
                  : "text-muted-foreground hover:text-orange-500"
              }`}
            >
              Pricing
            </button>

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

      <section
        id="home"
        className="flex flex-col items-center justify-center min-h-screen"
      >
        <div className="w-full max-w-2xl text-center space-y-12 px-4">
          <div className="space-y-3">
            <h1 className="text-7xl md:text-9xl font-playfair font-bold text-foreground text-balance tracking-tight">
              Share With <br />
              <span className="text-shadow-white/20 text-shadow-lg inline-block text-foreground">
                Confidence.
              </span>
            </h1>

            <p className="text-muted-foreground font-mono text-sm md:text-base font-light">
              Upload any{" "}
              <Link
                href="#features"
                onClick={() => scrollToSection("features")}
                className="border-b text-orange-500 border-orange-500 border-dashed transition-colors duration-300"
              >
                supported file type
              </Link>
              , we scan for security, then automatically delete it after your
              chosen period expires.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              asChild
              className="w-fit font-mono font-semibold! bg-foreground text-background h-12 cursor-pointer text-base rounded-full transition-colors"
            >
              <Link href="/sign-in">Get Started for Free</Link>
            </Button>

            <p className="text-xs text-muted-foreground font-mono">
              No credit card required to get started.
            </p>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-24 px-4 bg-secondary/10 border-y border-dashed border-border/50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-6xl tracking-tight font-playfair font-bold text-foreground mb-4">
              Features
            </h2>

            <p className="text-sm font-light text-muted-foreground max-w-2xl mx-auto">
              Everything you need for secure, temporary file sharing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature
              title="Virus Scanning"
              description="Every file is automatically scanned for viruses and malware before sharing."
              icon={<LockIcon className="text-foreground" />}
            />

            <Feature
              title="Auto Delete"
              description="Files automatically expire and delete after 7, 14, or 31 days."
              icon={<ClockIcon className="text-foreground" />}
            />

            <Feature
              title="Multiple links"
              description="Generate unlimited share links for each file with individual passwords."
              icon={<LinkIcon className="text-foreground" />}
            />

            <Feature
              title="Analytics"
              description="Track click count and access times for each shared link."
              icon={<ChartBarIcon className="text-foreground" />}
            />

            <Feature
              title="All File Types"
              description="Support for MP4, PDF, DOCX, PNG, GIF, and all other popular formats."
              icon={<FolderIcon className="text-foreground" />}
            />

            <Feature
              title="Public Links"
              icon={<GlobeIcon className="text-foreground" />}
              description="Share files with anyone using public links, no account required."
            />
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-6xl tracking-tight font-playfair font-bold text-foreground mb-4">
              Pricing
            </h2>

            <p className="text-sm font-light text-muted-foreground max-w-2xl mx-auto">
              Start with our free plan. Upgrade anytime for premium features.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="bg-card border-dashed border min-h-[500px] w-full md:w-[300px] border-border/50 rounded-lg p-8 flex flex-col hover:border-accent/50 transition-colors">
              <div className="mb-6">
                <h3 className="text-2xl font-playfair font-bold text-foreground mb-2">
                  Free
                </h3>

                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl text-foreground font-bold">$0</span>

                  <span className="text-sm text-muted-foreground">/month</span>
                </div>

                <p className="text-sm text-muted-foreground">
                  Perfect for occasional sharing
                </p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                <li className="text-sm text-foreground flex items-center gap-2">
                  <span className="text-orange-500">✓</span> Max file size of
                  25mb
                </li>

                <li className="text-sm text-foreground flex items-center gap-2">
                  <span className="text-orange-500">✓</span> 7 day retention
                </li>

                <li className="text-sm text-foreground flex items-center gap-2">
                  <span className="text-orange-500">✓</span> 1 link per file
                </li>

                <li className="text-sm text-foreground flex items-center gap-2">
                  <span className="text-orange-500">✓</span> Virus scanning
                </li>

                <li className="text-sm text-foreground flex items-center gap-2">
                  <span className="text-orange-500">✓</span> Click tracking
                </li>
              </ul>

              <Button
                asChild
                className="w-full bg-secondary cursor-pointer hover:bg-secondary/80 text-foreground font-medium"
              >
                <Link href="/sign-in">Get Started</Link>
              </Button>
            </div>

            <div className="bg-card border-dashed border border-accent rounded-lg p-8 min-h-[500px] w-full md:w-[300px] flex flex-col relative">
              <div className="absolute -top-4 left-8 bg-accent text-orange-500 px-3 py-1 rounded-full text-xs font-medium">
                Popular
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-playfair font-bold text-foreground mb-2">
                  Pro
                </h3>

                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl text-foreground font-bold">
                    $1.99
                  </span>

                  <span className="text-sm text-muted-foreground">/month</span>
                </div>

                <p className="text-sm text-muted-foreground">
                  Best for regular sharing
                </p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                <li className="text-sm text-foreground flex items-center gap-2">
                  <span className="text-orange-500">✓</span> Everything in free
                  plan
                </li>

                <li className="text-sm text-foreground flex items-center gap-2">
                  <span className="text-orange-500">✓</span> 14 & 31 day
                  retention
                </li>

                <li className="text-sm text-foreground flex items-center gap-2">
                  <span className="text-orange-500">✓</span> Unlimited links per
                  file
                </li>

                <li className="text-sm text-foreground flex items-center gap-2">
                  <span className="text-orange-500">✓</span> Max file size of
                  150mb
                </li>

                <li className="text-sm text-foreground flex items-center gap-2">
                  <span className="text-orange-500">✓</span>All new features
                </li>
              </ul>

              <Button
                asChild
                className="w-full bg-orange-500 hover:bg-orange-500/80 cursor-pointer text-foreground font-medium"
              >
                <Link href="/sign-in">Subscribe Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-t border-border/50 text-center min-h-[60vh] flex items-center justify-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-6xl tracking-tight font-playfair font-bold text-foreground mb-4">
            Start Sharing With Confidence!
          </h3>

          <p className="text-sm font-light text-muted-foreground mb-8">
            Join thousands of users who trust Temp for secure file sharing.
          </p>

          <Button
            size="lg"
            asChild
            className="w-fit font-mono bg-foreground text-background h-12 cursor-pointer text-base rounded-full transition-colors"
          >
            <Link href="/sign-in" className="font-semibold!">
              Get Started for Free
            </Link>
          </Button>
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
