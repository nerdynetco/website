import { redirect } from "next/navigation";
import { getSession } from "~/auth/server";

export default async function UserPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/user");
  }

  // Redirect to the user's role-based dashboard
  const userRole = session.user.role?.toLowerCase() || "builder";
  redirect(`/${userRole}`);
}
