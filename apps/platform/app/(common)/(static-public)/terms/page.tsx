import AdUnit from "@/components/common/adsense";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Scale, Terminal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { appConfig } from "~/project.config";

export const metadata: Metadata = {
  title: "Terms of Service | Nerdy Network",
  description:
    "The rules of the game. Read the Terms of Service for Nerdy Network regarding usage, liability, house points, and code of conduct.",
  robots: { index: true, follow: true },
};

// --- Sticky Navigation ---
const TableOfContents = () => {
  const sections = [
    { id: "acceptance", title: "1. Init Sequence (Acceptance)" },
    { id: "unofficial", title: "2. Not Official" },
    { id: "usage", title: "3. Rules of Engagement" },
    { id: "gamification", title: "4. House Points & Logic" },
    { id: "warranty", title: "5. No Warranty (As Is)" },
    { id: "ads", title: "6. Ads & Monetization" },
    { id: "liability", title: "7. Limitation of Liability" },
    { id: "indemnification", title: "8. Indemnification" },
    { id: "ip", title: "9. Intellectual Property" },
    { id: "termination", title: "10. Ban Hammer" },
    { id: "law", title: "11. Governing Law" },
    { id: "changes", title: "12. Patch Notes (Changes)" },
    { id: "contact", title: "13. Ping Us" },
  ];

  return (
    <nav className="hidden lg:block sticky top-24 h-fit w-64 pr-8">
      <h4 className="mb-4 text-sm font-semibold tracking-tight text-primary">
        System Protocols
      </h4>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <ul className="space-y-2 border-l border-border/40 ml-1">
          {sections.map((item) => (
            <li key={item.id}>
              <Link
                href={`#${item.id}`}
                className="block border-l-2 border-transparent pl-4 text-xs font-medium text-muted-foreground hover:border-primary hover:text-foreground transition-all line-clamp-1"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </nav>
  );
};

const LastUpdated = () => {
  const d = new Date();
  const dateString = d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return <span className="font-mono text-xs">{dateString}</span>;
};

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(#80808012_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />

      <main className="container relative z-10 mx-auto max-w-7xl px-4 py-12 md:py-20">
        
        {/* --- Header --- */}
        <div className="mb-16 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="rounded-full py-1 border-primary/20 bg-primary/5 text-primary">
              <Scale className="mr-1.5 size-3" />
              Legal Documentation
            </Badge>
            <span className="text-xs text-muted-foreground">
              Last Commit: <LastUpdated />
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            By accessing <strong>Nerdy Network</strong>, you agree to the following terms. 
            Basically: play nice, {`don't `}hack us maliciously, and remember that code sometimes breaks.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <div className="shrink-0">
             <TableOfContents />
          </div>

          {/* Content */}
          <article className="flex-1 prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            
            {/* Critical Disclaimer Block */}
            <div className="not-prose bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 mb-12">
               <div className="flex items-start gap-4">
                  <div className="p-2 bg-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400">
                     <AlertTriangle className="size-5" />
                  </div>
                  <div>
                     <h3 className="text-base font-semibold text-foreground mb-1">Unofficial Platform Disclaimer</h3>
                     <p className="text-sm text-muted-foreground leading-relaxed">
                        This is a <strong>student-run community project</strong>. We are NOT an official university portal. We are not responsible if you miss a deadline because you were too busy grinding House Points.
                     </p>
                  </div>
               </div>
            </div>

            <section id="acceptance">
              <h2>1. Init Sequence (Acceptance of Terms)</h2>
              <p>
                By creating an account or using the Nerdy Network, you agree to be bound by these
                Terms. If you do not agree, please press `Alt + F4` or close the tab immediately.
              </p>
            </section>

            <Separator className="my-8 opacity-50" />

            <section id="unofficial">
              <h2>2. Not Official</h2>
              <p>
                We expressly disclaim any official representation of the University Administration. 
                Any academic data displayed here is for convenience only. 
                Always check official notice boards for the real source of truth.
              </p>
            </section>

            <section id="usage">
              <h2>3. Rules of Engagement</h2>
              <p>You agree to use our services lawfully. You must not:</p>
              <ul>
                <li><strong>DDOS or Stress Test</strong> our servers without permission.</li>
                <li>Post hate speech, harassment, or spam in community channels.</li>
                <li>Create bots to artificially inflate your {`"Build Streak."`}</li>
                <li>Attempt to reverse engineer proprietary features.</li>
              </ul>
              <p>Violating these rules will result in a permanent ban and public shaming in the logs.</p>
            </section>

            <section id="gamification">
               <h2>4. House Points & Gaming Logic</h2>
               <p>
                 {`"House Points," "Streaks," and "Badges" `}have no real-world monetary value. 
                 We reserve the right to reset leaderboards, rebalance point logic, or 
                 nerf your House if it becomes too OP (Overpowered).
               </p>
            </section>

            <Separator className="my-8 opacity-50" />

            <section id="warranty">
               <h2>5. No Guarantee (It Works On My Machine)</h2>
               <p>
                 The service is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; 
                 We disclaim all warranties regarding uptime, bug-free performance, or accuracy. 
                 Software is hard. Sometimes it crashes.
               </p>
            </section>

            <section id="ads">
               <h2>6. Advertising & Affiliate Links</h2>
               <p>
                 To pay for servers (and coffee), we may display third-party ads (e.g., Google AdSense) 
                 or affiliate links. We aren{"`"}t responsible for the content of external sites.
               </p>
               <div className="not-prose my-6">
                 <AdUnit adSlot="multiplex" />
               </div>
            </section>

            <section id="liability">
               <h2>7. Limitation of Liability</h2>
               <p>
                 To the fullest extent permitted by law, the creators of Nerdy Network shall not be 
                 liable for any damages (including lost data or lost sleep) arising 
                 from your use of the platform.
               </p>
            </section>

            <section id="indemnification">
               <h2>8. Indemnification</h2>
               <p>
                 You agree to indemnify and hold harmless the developers from any claims 
                 arising out of your violation of these Terms or your misuse of the platform.
               </p>
            </section>

            <Separator className="my-8 opacity-50" />

            <section id="ip">
               <h2>9. Intellectual Property</h2>
               <p>
                 <strong>Your Code:</strong> You retain ownership of any projects you link or upload.
                 <br />
                 <strong>Our Code:</strong> The platform design, branding, and core logic are owned by Nerdy Network.
               </p>
            </section>

            <section id="termination">
               <h2>10. The Ban Hammer</h2>
               <p>
                 We reserve the right to suspend or terminate your account at any time, 
                 for any reason, including but not limited to being a jerk to other builders.
               </p>
            </section>

            <section id="law">
               <h2>11. Governing Law</h2>
               <p>
                 These Terms are governed by the laws of India. Any disputes are subject to the 
                 jurisdiction of courts located in <strong>Himachal Pradesh, India</strong> (or wherever our server rack is located).
               </p>
            </section>

            <section id="changes">
               <h2>12. Patch Notes (Changes to Terms)</h2>
               <p>
                 We may push updates to these Terms. Continued use of the Site after a {`"patch"`} 
                 constitutes acceptance of the new version.
               </p>
            </section>

            <section id="contact">
               <h2>13. Ping Us</h2>
               <p>
                 For legal inquiries or bug reports: <a href={`mailto:${appConfig.contact || "admin@nerdynetwork.com"}`}>{appConfig.contact || "admin@nerdynetwork.com"}</a>
               </p>
            </section>

            <div className="mt-12 not-prose border-t border-border pt-8">
               <p className="text-sm text-muted-foreground italic">
                 <strong>Final Disclaimer:</strong> Use at your own risk. 
                 May cause increased productivity and sudden urges to refactor code.
               </p>
            </div>

          </article>
        </div>
      </main>
    </div>
  );
}