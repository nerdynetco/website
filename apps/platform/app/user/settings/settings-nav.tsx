"use client";

import { Palette, User } from "lucide-react";
import { SidebarNav } from "./sidenav";

const navItems = [
  {
    title: "Account",
    href: "account",
    icon: User,
  },
  {
    title: "Appearance",
    href: "appearance",
    icon: Palette,
  },
];

interface SettingsNavProps {
  basePath: string;
}

export function SettingsNav({ basePath }: SettingsNavProps) {
  const items = navItems.map((item) => ({
    ...item,
    href: `${basePath}/${item.href}`,
  }));

  return <SidebarNav items={items} />;
}
