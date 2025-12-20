"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "~/auth/client";

export function LayoutClient() {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isPending) return;
    if (!data?.user?.id) return;

    const isSorted =
      Boolean(data.user.house) && Boolean(data.user.hasCompletedSorting);

    // User not sorted → always go to /sorting
    if (!isSorted && pathname !== "/sorting") {
      router.replace("/sorting");
      return;
    }

    // User already sorted → block /sorting
    if (isSorted && pathname === "/sorting") {
      router.replace("/");
      return;
    }
  }, [isPending, data, pathname, router]);

  return null;
}
