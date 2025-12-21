import { FlickeringGrid } from "@/components/animation/flikering-grid";
import AdUnit from "@/components/common/adsense";
import Navbar from "@/components/common/app-navbar";
import { AppSidebar } from "@/components/common/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { Session } from "~/auth";
import { getSession } from "~/auth/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "User Dashboard",
  description: "Manage your account and settings",
};

interface UserLayoutProps {
  children: React.ReactNode;
}

export default async function UserLayout({ children }: UserLayoutProps) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/user");
  }

  // Use the user's actual role for the sidebar
  const userRole = session.user.role?.toLowerCase() || "builder";

  return (
    <SidebarProvider>
      <AppSidebar user={session.user} moderator={userRole} />
      <SidebarInset className="flex flex-col flex-1 w-full relative z-0">
        <Navbar
          user={session.user}
          impersonatedBy={session.session.impersonatedBy}
        />
        <div className="absolute top-0 left-0 z-0 w-full min-h-80 [mask-image:linear-gradient(to_top,transparent_25%,black_95%)]">
          <FlickeringGrid
            className="absolute top-0 left-0 size-full"
            squareSize={4}
            gridGap={6}
            color="#6B7280"
            maxOpacity={0.2}
            flickerChance={0.05}
          />
        </div>

        <main className="content p-4 px-2 md:p-6 z-2 @container space-y-10 min-h-screen h-full">
          {children}
        </main>
        <AdUnit adSlot="display-horizontal" key="dashboard-bottom" />
        {process.env.NODE_ENV !== "production" && (
          <div className="fixed bottom-0 right-auto left-auto mx-auto p-2 text-xs text-muted-foreground">
            <span className="font-semibold">Environment:</span>{" "}
            {process.env.NODE_ENV}
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
