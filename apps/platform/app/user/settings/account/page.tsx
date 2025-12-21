import type { Session } from "~/auth";
import { getSession } from "~/auth/server";
import { redirect } from "next/navigation";
import { AccountForm } from "./account-form";

export const dynamic = "force-dynamic";

export default async function UserAccountSettingsPage() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/user/settings/account");
  }
  
  return <AccountForm currentUser={session.user} />;
}
