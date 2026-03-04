"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import Hamburger from "./ui/hamburger";

type NavLink = { href: string; text: string };

type Props = {
  links?: NavLink[];
};

const navLinkClass =
  "text-sm capitalize font-medium transition-colors hover:text-orange-500";

function NavLinks({
  links,
  onClick,
  className,
}: {
  links: NavLink[];
  onClick?: () => void;
  className?: string;
}) {
  return (
    <>
      {links.map((link) => (
        <Link
          href={link.href}
          key={link.href}
          onClick={onClick}
          className={cn(navLinkClass, className)}
        >
          {link.text}
        </Link>
      ))}
    </>
  );
}

export function Navbar({ links }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen, closeMenu]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen, closeMenu]);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h2 className="text-2xl font-playfair font-bold text-heading">Temp</h2>

        {links && (
          <div className="hidden md:flex items-center gap-8">
            <NavLinks links={links} />
          </div>
        )}

        <div className="hidden md:flex items-center gap-8">
          <Link href="/auth/sign-in" className={navLinkClass}>
            Sign In
          </Link>
        </div>

        <div ref={hamburgerRef} className="md:hidden">
          <Hamburger
            opened={mobileMenuOpen}
            onMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
          />
        </div>
      </div>

      <div
        ref={menuRef}
        aria-label="Mobile navigation"
        aria-hidden={!mobileMenuOpen}
        className={cn(
          "md:hidden absolute w-full top-full border-t border-border/50 bg-background/95 backdrop-blur-sm overflow-hidden transition-[max-height] duration-300",
          mobileMenuOpen ? "max-h-[70vh] visible" : "max-h-0 invisible",
        )}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-2">
          {links && (
            <NavLinks links={links} onClick={closeMenu} className="py-3" />
          )}

          <Link
            href="/auth/sign-in"
            onClick={closeMenu}
            className={cn(navLinkClass, "py-3 text-left")}
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
