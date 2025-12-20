// app/contact/page.tsx
import AdUnit from "@/components/common/adsense";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    AlertTriangle,
    Code2,
    Github,
    Globe,
    HeartHandshake,
    Mail,
    MessageSquare,
    Users
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { appConfig } from "~/project.config";

export const metadata: Metadata = {
  title: "Contact & Support | Nerdy Network",
  description:
    "Get in touch with the Nerdy Network team. Report bugs, suggest features, or join the chaos.",
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(#80808012_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />

      <main className="container relative z-10 mx-auto max-w-5xl px-4 py-16 md:py-24">
        
        {/* --- HERO SECTION --- */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <Badge variant="outline" className="rounded-full py-1.5 px-4 border-primary/20 bg-primary/5 text-primary">
            <Globe className="mr-2 size-3" />
            The {`Internet's`} Messiest Corner
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Built for Builders, <br/>
            <span className="bg-gradient-to-l from-teal-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% bg-clip-text text-transparent">By Builders.</span>
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            <strong>Nerdy Network</strong> is the operating system for student developers. 
            We bridge the gap between solo coding and community chaos through 
            gamification and collaboration.
          </p>
        </div>

        {/* --- DISCLAIMER BLOCK --- */}
        <div className="mx-auto max-w-3xl bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 mb-16">
           <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400 shrink-0">
                 <AlertTriangle className="size-5" />
              </div>
              <div>
                 <h3 className="text-base font-semibold text-foreground mb-1">Community Driven</h3>
                 <p className="text-sm text-muted-foreground leading-relaxed">
                    This platform is a <strong>student-run initiative</strong>. We are here to help you build cool stuff, find teammates, and ship projects. If you find a bug, {`don't panic—it's `}a feature.
                 </p>
              </div>
           </div>
        </div>

        {/* --- CONTACT GRID --- */}
        <div className="mb-20">
            <h2 className="text-2xl font-semibold mb-8 text-center">Get in Touch</h2>
            <div className="grid md:grid-cols-3 gap-4">
                <ContactCard 
                    icon={Mail}
                    title="Email Support"
                    desc="For partnerships & help"
                    action="Send Email"
                    href={`mailto:${appConfig.contact || "hello@nerdynet.co"}`}
                />
                <ContactCard 
                    icon={Github}
                    title="GitHub"
                    desc="Report bugs or contribute"
                    action="View Repo"
                    href={appConfig.githubRepo || "https://github.com/nerdynetco/website"}
                />
                <ContactCard 
                    icon={MessageSquare}
                    title="Feedback"
                    desc="Suggest new features"
                    action="Open Form"
                    href={appConfig.contact || "#"}
                />
            </div>
        </div>

        {/* --- MISSION SECTION --- */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Why we exist</h2>
                <p className="text-muted-foreground leading-relaxed">
                    We believe that building alone is boring. Our goal is to create a digital playground where you can find your co-founder, earn points for shipping code, and actually enjoy the grind.
                </p>
                
                <div className="space-y-4">
                    <FeatureRow Icon={Users} title="Find Your Tribe">
                        Swipe to match with teammates who share your tech stack and vision.
                    </FeatureRow>
                    <FeatureRow Icon={Code2} title="Open Source Core">
                        Complete transparency. Our code is open for anyone to audit, fork, or improve.
                    </FeatureRow>
                    <FeatureRow Icon={HeartHandshake} title="No Gatekeeping">
                        Whether you{"'"}re a senior dev or writing your first Hello World, you belong here.
                    </FeatureRow>
                </div>
            </div>

            {/* Ad Slot (Integrated visually) */}
            <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px]">
                <span className="text-xs font-mono text-muted-foreground/50 mb-4 uppercase tracking-widest">Sponsored</span>
                <AdUnit adSlot="multiplex" key="about-page-ad" />
            </div>
        </div>

        <Separator className="my-12 opacity-50" />

        {/* --- FOOTER DISCLAIMER --- */}
        <div className="text-center max-w-2xl mx-auto space-y-6">
            <p className="text-sm text-muted-foreground italic">
                {'"'}Code is poetry, but deployment is actual labor.{'"'}
            </p>
            <div className="pt-4">
                 <AdUnit adSlot="multiplex" key="contact-page-ad-footer" />
            </div>
        </div>

      </main>
    </div>
  );
}


function ContactCard({ icon: Icon, title, desc, action, href }: { icon: React.FC<React.SVGProps<SVGSVGElement>>, title: string, desc: string, action: string, href: string }) {
    return (
        <Link 
            href={href} 
            target={href.startsWith("http") ? "_blank" : undefined}
            className="group flex flex-col items-center text-center p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all"
        >
            <div className="p-3 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                <Icon className="size-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{desc}</p>
            <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:underline">
                {action}
            </span>
        </Link>
    )
}

function FeatureRow({  Icon, title, children }: { Icon: React.FC<React.SVGProps<SVGSVGElement>>, title: string, children: React.ReactNode }) {
    return (
        <div className="flex gap-4">
            <div className="shrink-0 mt-1">
                <div className="p-2 rounded-lg bg-muted text-foreground/70">
                    <Icon className="size-4" />
                </div>
            </div>
            <div>
                <h4 className="font-medium text-foreground text-sm">{title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                    {children}
                </p>
            </div>
        </div>
    )
}