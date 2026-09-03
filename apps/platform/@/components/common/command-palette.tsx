"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import type { NavLink } from "@/constants/links";
import {
  ArrowUpRight,
  LayoutDashboard,
  LogIn,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import type { Session } from "~/auth";

const loggedInList = [
  { path: "/dashboard", title: "Dashboard", icon: LayoutDashboard },
  { path: "/dashboard/settings", title: "Settings", icon: Settings },
];

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: Session["user"];
  publicLinks: NavLink[];
};

export function CommandPalette({
  open,
  onOpenChange,
  user,
  publicLinks,
}: CommandPaletteProps) {
  const isLoggedIn = !!user;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type to search ecosystem..." />
      <CommandList className="py-2">
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Suggestions">
          {publicLinks.map((item, index) => (
            <CommandItem key={`cmd-${index}`} asChild>
              <Link
                href={item.href}
                onClick={() => onOpenChange(false)}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center">
                  {item.Icon ? (
                    <item.Icon className="mr-3 size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  ) : (
                    <ArrowUpRight className="mr-3 size-4" />
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium">{item.title}</span>
                    {item.description && (
                      <span className="text-xs text-muted-foreground font-normal line-clamp-1">
                        {item.description}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-50 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </Link>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator className="my-2" />

        {isLoggedIn ? (
          <CommandGroup heading="Account">
            <CommandItem onSelect={() => onOpenChange(false)}>
              <Link href={`/u/${user.username}`} className="flex items-center w-full">
                <User className="mr-2 size-4" /> Profile
              </Link>
            </CommandItem>
            {loggedInList.map((item) => (
              <CommandItem key={item.path} onSelect={() => onOpenChange(false)}>
                <Link href={item.path} className="flex items-center w-full">
                  <item.icon className="mr-2 size-4" /> {item.title}
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : (
          <CommandGroup heading="Authentication">
            <CommandItem onSelect={() => onOpenChange(false)}>
              <Link href="/auth/sign-in" className="flex items-center w-full">
                <LogIn className="mr-2 size-4" /> Sign In
              </Link>
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
