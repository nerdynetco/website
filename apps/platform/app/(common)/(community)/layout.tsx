
import { redirect } from "next/navigation";
import { getSession } from "~/auth/server";


interface DashboardLayoutProps {
  children: React.ReactNode;
 
}


export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {


  const session = await getSession();
  if (!session) {
    return redirect("/auth/sign-in");
  }

  return children;
}
