import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import FindrMainClient from "./findr-main-client";
import FindrLandingPage from "./page-client";
import { getMyFindrProfile, getDiscoverProfiles } from "~/actions/findr";
import { auth } from "~/auth";
import { headers } from "next/headers";

export const metadata = {
  title: "Findr | Nerdy Network",
  description: "Swipe-based co-founder matching for builders. Find your perfect technical co-founder.",
};

async function FindrContent() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  // Not logged in - show landing page
  if (!session) {
    return <FindrLandingPage />;
  }

  // Check if user has a Findr profile
  const profile = await getMyFindrProfile();

  // No profile - redirect to setup
  if (!profile) {
    redirect("/findr/profile");
  }

  // Get profiles to discover
  const discoverProfiles = await getDiscoverProfiles({ limit: 20 });

  return (
    <FindrMainClient
      profile={profile}
      discoverProfiles={discoverProfiles}
    />
  );
}

function FindrSkeleton() {
  return (
    <div className="container max-w-lg py-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-24" />
        <div className="flex gap-2">
          <Skeleton className="size-10 rounded-lg" />
          <Skeleton className="size-10 rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-[520px] w-full rounded-2xl" />
      <div className="flex justify-center gap-4 mt-6">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="size-14 rounded-full" />
        <Skeleton className="size-16 rounded-full" />
      </div>
    </div>
  );
}

export default function FindrPage() {
  return (
    <Suspense fallback={<FindrSkeleton />}>
      <FindrContent />
    </Suspense>
  );
}
