import Footer from "@/components/common/footer";
import GithubBanner from "@/components/common/github-banner";
import Navbar from "@/components/common/navbar";
import { LayoutClient } from "./layout.client";

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-1 flex-col justify-center min-h-svh min-w-full z-0">

      <Navbar />
      <div className="absolute top-0 left-0 z-0 w-full min-h-80 pattern_feed opacity-40 [mask-image:linear-gradient(to_top,transparent_25%,black_95%)]" />
      <div className="relative flex-1 mx-auto max-w-(--max-app-width) w-full h-full min-h-screen @container flex-col items-center justify-start space-y-4 pb-8">
        {children}
        <LayoutClient/>
        <GithubBanner />
      </div>
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-tertiary/20 rounded-full blur-3xl" />
      </div>
      <Footer />
    </div>
  );
}
