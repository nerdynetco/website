import { redirect } from "next/navigation";
import { getSession } from "~/auth/server";

export default async function UserSettingsPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/user/settings");
  }

  // Redirect to the user's role-based settings page
  const userRole = session.user.role?.toLowerCase() || "builder";
  redirect(`/${userRole}/settings`);
}
