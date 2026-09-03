"use client";

import ProfileDropdown from "@/components/common/profile-dropdown";
import { ApplicationInfo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { AuthButtonLink, ButtonLink } from "@/components/utils/link";
import {
  NavLink,
  SUPPORT_LINKS,
  getNavLinks,
  socials,
} from "@/constants/links";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowUp,
  ArrowUpRight,
  Search,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo, useState } from "react";
import type { Session } from "~/auth";
import { twUtility } from "../utils/tailwind-classes";
import { NavTabs } from "./nav-tabs";
import { ThemePopover, ThemeSwitcher } from "./theme-switcher";

const LazyCommandPalette = dynamic(
  () => import("./command-palette").then((mod) => mod.CommandPalette),
  { ssr: false }
);

interface NavbarProps {
  user?: Session["user"];
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const navLinks = getNavLinks(user);

  // Memoized categories logic
  const { categories } = useMemo(() => {
    const cats = ["all", ...new Set(navLinks.map((l) => l.category).filter(Boolean))];
    return { categories: cats };
  }, [navLinks]);

  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const availableLinks = useMemo(
    () => navLinks.filter((link) => activeCategory === "all" || link.category === activeCategory),
    [activeCategory, navLinks]
  );

  return (
    <header
      id="navbar"
      className={cn(
        "z-50 w-full transition-all duration-300",
        "bg-background/80 backdrop-blur-xl border-b border-border/40 supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <div className="w-full max-w-(--max-app-width) mx-auto">
        
        {/* --- TOP ROW: GLOBAL CONTEXT --- */}
        <div className="flex items-center justify-between px-4 py-3 h-16">
          
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <ApplicationInfo />
          </Link>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <QuickLinks user={user} publicLinks={navLinks} />
            
            <div className="h-6 w-px bg-border/50 hidden sm:block mx-1" />
            
            <ThemeSwitcher />
            <ThemePopover className="hidden md:inline-flex" />
            
            {user ? (
              <ProfileDropdown user={user} />
            ) : (
              <AuthButtonLink
                size="sm"
                href={pathname}
                variant="rainbow"
                className="font-medium px-5"
              >
                Log In
              </AuthButtonLink>
            )}
          </div>
        </div>

        {/* --- BOTTOM ROW: LOCAL CONTEXT (Tabs) --- */}
        <div className="px-4 pb-0">
          <div className="flex flex-col gap-2">
            
            {/* Category Filter (If more than 1 category exists) */}
            {categories.length > 1 && (
              <div className={cn("flex items-center gap-1 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 mask-fade-sides", twUtility.horizontalScroll)}>
                {categories.map((category) => (
                   <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "relative px-3 py-1.5 text-xs font-medium capitalize transition-colors rounded-md whitespace-nowrap",
                      activeCategory === category 
                        ? "text-primary" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {category}
                    {activeCategory === category && (
                      <motion.div
                        layoutId="navbar-category-pill"
                        className="absolute inset-0 bg-primary/10 rounded-md -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Main Navigation Tabs */}
            <div className="pt-1 pb-1">
                 <NavTabs
                    key={activeCategory}
                    navLinks={availableLinks.map((link) => ({
                        id: link.href,
                        href: link.href,
                        children: (
                        <span className="flex items-center gap-2">
                            {link.Icon && <link.Icon className="size-3.5 opacity-70" />}
                            {link.title}
                        </span>
                        ),
                        isNew: link.isNew,
                        items: link.items,
                    }))}
                />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// --- QUICK LINKS (COMMAND PALETTE) ---

interface QuickLinksProps extends NavbarProps {
  publicLinks: NavLink[];
}

export function QuickLinks({ user, publicLinks }: QuickLinksProps) {
  const [open, setOpen] = useState(false);

  // Handle Ctrl/Cmd + K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      {/* Desktop Trigger (Input Look) */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center w-56 h-9 px-3 rounded-lg border border-border/50 bg-card/50 hover:bg-card/80 dark:bg-muted/20 dark:hover:bg-muted/50 hover:border-border transition-all text-sm text-muted-foreground group"
      >
        <Search className="size-3.5 mr-2 opacity-50 group-hover:opacity-100 transition-opacity" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Mobile Trigger (Icon Only) */}
      <Button
        onClick={() => setOpen(true)}
        size="icon_sm"
        variant="ghost"
        className="md:hidden text-muted-foreground"
      >
        <Search className="size-5" />
      </Button>

      {open && (
        <LazyCommandPalette
          open={open}
          onOpenChange={setOpen}
          user={user}
          publicLinks={publicLinks}
        />
      )}
    </>
  );
}

// --- UTILITY COMPONENTS ---

export function SocialBar({ className }: { className?: string }) {
  if (socials.length === 0) return null;
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {socials.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          target="_blank"
          className={cn(
            "flex items-center justify-center size-8 rounded-full text-muted-foreground transition-all",
            "hover:bg-primary/10 hover:text-primary hover:scale-105"
          )}
        >
          <link.icon className="size-4" />
        </Link>
      ))}
    </div>
  );
}

export function SupportBar() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {SUPPORT_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="group flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          {link.title}
          <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      ))}
    </div>
  );
}

export function GoToTopButton({ className }: { className?: string }) {
  return (
    <ButtonLink
      href="#navbar"
      variant="ghost"
      size="sm"
      className={cn("text-xs text-muted-foreground hover:text-foreground", className)}
    >
      Back to Top <ArrowUp className="ml-2 size-3" />
    </ButtonLink>
  );
}
