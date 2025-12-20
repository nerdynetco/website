"use client";

import { AnimatedGradientText } from "@/components/animation/animated-shiny-text";
import { FloatingElements } from "@/components/animation/floating-elements";
import { StaggerChildrenContainer, StaggerChildrenItem } from "@/components/animation/motion";
import { NumberTicker } from "@/components/animation/number-ticker";
import FeatureCard from "@/components/common/feature-card";
import { Icon } from "@/components/icons";
import { ApplicationSvgLogo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/utils/link";
import { featuresSectionContent } from "@/constants/landing";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  BarChart2,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  FileText,
  Globe,
  GraduationCap,
  Users,
  Trophy, 
  Flame, 
  Zap, 
  GitMerge, 
  Code2, 
  Rocket
} from "lucide-react";
import type { Session } from "~/auth";
import { PublicStatsType } from "~/lib/third-party/github";
import { appConfig, orgConfig } from "~/project.config";
import { getGreeting } from "~/utils/misc";

// --- VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

// --- DATA ---
const popular_features = [
  { name: "Results", icon: FileText, href: "/results" },
  { name: "Resources", icon: BookOpen, href: "/resources" },
  { name: "Community", icon: Users, href: "/community" },
];

// --- COMPONENTS ---

export function IntroSection({
  user,
  stats,
  house,
}: {
  user: Session["user"] | null | undefined;
  stats: PublicStatsType;
  house: string | null;
}) {
  // Flatten stats logic for display
  const displayStats = [
    // COMMENTED OUT - Visitor tracking disabled
    // { label: "Impressions", value: stats.visitors, icon: BarChart2 },
    { label: "Active Users", value: stats.userCount, icon: Users },
    // COMMENTED OUT - GitHub features disabled
    // { label: "GitHub Stars", value: stats.githubStats?.stars || 0, icon: Globe },
    { label: "Live Sessions", value: stats.sessionCount, icon: BarChart3 },
  ];

  return (
    <section className="relative w-full max-w-(--max-app-width) mx-auto pt-12 pb-20 lg:pt-24 lg:pb-32 px-4 md:px-6">
      <StaggerChildrenContainer
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        variants={containerVariants}
      >
        {/* LEFT COLUMN: Copy & CTAs */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
          
          {/* Greeting / Badge */}
          <StaggerChildrenItem>
	             {user ? (
	                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
	                  <span className="relative flex h-2 w-2">
	                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
	                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
	                  </span>
	                  {getGreeting()}, {user.name}
	                  {house && (
	                    <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-primary/20">
	                      House {house}
	                    </Badge>
	                  )}
	                </div>
	             ) : (
               <Badge variant="outline" className="rounded-full py-1.5 px-4 gap-2 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                  <span className="font-bold">New</span> {appConfig.name} 2.0 is live
               </Badge>
             )}
          </StaggerChildrenItem>

          {/* Headlines */}
          <StaggerChildrenItem>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground text-balance">
              the <span className="bg-linear-to-l from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% bg-clip-text text-transparent">internet{"'"}s messiest,</span> <br className="hidden lg:block"/>
              <span className="bg-linear-to-l from-emerald-500 from-10% via-sky-500 via-30% to-indigo-500 to-90% bg-clip-text text-transparent">nerdiest corner.</span> <br className="hidden lg:block"/>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 text-balance leading-relaxed">
              {appConfig.description || "A community for student builders to showcase projects, track progress, and connect with fellow builders. Build in public, compete in houses, and level up together."}
            </p>
          </StaggerChildrenItem>

          {/* Buttons */}
          <StaggerChildrenItem className="flex flex-wrap items-center justify-center lg:justify-start gap-4 w-full">
            <ButtonLink
              size="lg"
              href={user ? `/${user.role[0]}` : "/auth/sign-in"}
              variant="default"
              className="h-12 px-8 text-base shadow-lg shadow-primary/20"
            >
              {user ? "Go to Dashboard" : "Get Started"} <Icon name="arrow-right" className="ml-2 size-4" />
            </ButtonLink>
            
            <ButtonLink
              size="lg"
              href="#quick-links"
              variant="outline"
              className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm"
            >
              Explore Features
            </ButtonLink>
          </StaggerChildrenItem>

          {/* Stats / Social Proof */}
          <StaggerChildrenItem className="pt-4 w-full">
             <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 border-t border-border/50 pt-6">
                {displayStats.map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="flex items-center gap-2 text-2xl font-bold text-foreground">
                       <NumberTicker value={stat.value} suffix="+"/>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
             </div>
          </StaggerChildrenItem>
        </div>

        {/* RIGHT COLUMN: Visuals */}
        <div className="relative w-full perspective-1000">
          <HeroBentoMockup />
          
          {/* Decorative gradients behind mockup */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[100px] -z-10 rounded-full pointer-events-none mix-blend-screen" />
        </div>
      </StaggerChildrenContainer>
    </section>
  );
}


export function HeroBentoMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, rotateX: 10, rotateY: -10, scale: 0.9 }}
      animate={{ opacity: 1, rotateX: 0, rotateY: 0, scale: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
      className="relative w-full max-w-2xl mx-auto lg:mr-0 select-none"
    >
        {/* Main Dashboard Card (The "Base") */}
        <div className="relative rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Fake Browser Header */}
            <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5">
                <div className="flex gap-1.5">
                    <div className="size-3 rounded-full bg-red-500/80" />
                    <div className="size-3 rounded-full bg-yellow-500/80" />
                    <div className="size-3 rounded-full bg-green-500/80" />
                </div>
                <div className="mx-auto w-1/3 h-2 rounded-full bg-white/10" />
            </div>

            {/* Dashboard Content */}
            <div className="p-6 grid grid-cols-3 gap-4">
                
                {/* Widget 1: House Points (The Gamification) */}
                <div className="col-span-2 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 shadow-sm space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-20">
                        <Trophy className="size-12 text-purple-500" />
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2">
                             <div className="p-1.5 bg-purple-500/20 rounded-md">
                                <Trophy className="size-4 text-purple-400" />
                            </div>
                            <span className="text-sm font-semibold text-purple-100">House Turing</span>
                        </div>
                        <Badge variant="secondary" className="text-[10px] bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border-0">Rank #1</Badge>
                    </div>
                    <div className="flex items-end gap-2 relative z-10">
                        <span className="text-3xl font-bold tracking-tighter text-white">1,240</span>
                        <span className="text-xs text-muted-foreground mb-1">pts earned</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden relative z-10">
                        <div className="h-full w-[75%] bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
                    </div>
                </div>

                {/* Widget 2: Build Streak (Accountability) */}
                <div className="col-span-1 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 shadow-sm flex flex-col justify-between items-center text-center">
                     <Flame className="size-6 opacity-80" />
                     <div>
                         <span className="text-3xl font-bold block text-white">12</span>
                         <span className="text-[10px] opacity-80 uppercase font-bold tracking-wider">Day Streak</span>
                     </div>
                </div>

                {/* Widget 3: Recent Activity / Matches (Networking) */}
                <div className="col-span-3 p-4 rounded-xl bg-card/50 border border-white/10 shadow-sm space-y-3">
                     <div className="flex justify-between items-center">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Live Activity</div>
                        <div className="flex -space-x-2">
                            {[1,2,3].map(i => (
                                <div key={i} className="size-5 rounded-full border border-black bg-zinc-800" />
                            ))}
                        </div>
                     </div>
                     
                     {/* List Item 1 */}
                     <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5">
                         <div className="size-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400">
                             <GitMerge className="size-4" />
                         </div>
                         <div className="flex-1 min-w-0">
                             <div className="text-xs font-medium text-gray-200 truncate">Merged PR: {`"Landing Page v1"`}</div>
                             <div className="text-[10px] text-gray-500">Just now • +50 pts</div>
                         </div>
                     </div>

                     {/* List Item 2 */}
                     <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-default">
                         <div className="size-8 rounded bg-pink-500/20 flex items-center justify-center text-pink-400">
                             <Users className="size-4" />
                         </div>
                         <div className="flex-1 min-w-0">
                             <div className="text-xs font-medium text-gray-200 truncate">Matched with @sarah_ux</div>
                             <div className="text-[10px] text-gray-500">2 mins ago • Collaboration</div>
                         </div>
                     </div>
                </div>
            </div>
        </div>

        {/* Floating "Match" Card - Top Right */}
        <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-8 -top-8 w-48 p-3 rounded-xl border border-white/10 bg-zinc-900/90 backdrop-blur-md shadow-xl z-20 hidden sm:block"
        >
            <div className="flex gap-3 items-start">
                <div className="size-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                    <CheckCircle2 className="size-4" />
                </div>
                <div>
                    <p className="text-xs font-bold text-white">Project Approved</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                        Your project {`"Campus Connect" `}is live!
                    </p>
                </div>
            </div>
        </motion.div>

        {/* Floating "Event" Card - Bottom Left */}
        <motion.div 
             animate={{ y: [0, 8, 0] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute -left-8 -bottom-8 w-52 p-3 rounded-xl border border-white/10 bg-zinc-900/90 backdrop-blur-md shadow-xl z-20 hidden sm:block"
        >
             <div className="flex gap-3 items-center">
                 <div className="size-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                     <Rocket className="size-4" />
                 </div>
                 <div>
                     <p className="text-xs font-bold text-white">Demo Day</p>
                     <p className="text-[10px] text-gray-400 mt-0.5">Starts in 2 days. Keep shipping!</p>
                 </div>
             </div>
        </motion.div>
    </motion.div>
  );
}

export function FeatureSection() {
  return (
    <section className="py-24 relative overflow-hidden" id="features">
      {/* Optional Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 relative z-10">
        <StaggerChildrenContainer variants={containerVariants} className="space-y-16">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              Ways to Build Your<br />
              <span className="bg-linear-to-l from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% bg-clip-text text-transparent">
                Legacy.
              </span>
            </h2>
            <p className="text-lg text-muted-foreground text-balance">
              Stop waiting for {`"someday"`} and start building today. Here{"'"}s how The Nerdy Network helps you go from idea to reality.
            </p>
          </div>

          {/* Features Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="space-y-8 flex flex-col justify-start">
               {featuresSectionContent.left.map((feature, i) => (
                  <FeatureCard key={`l-${i}`} feature={feature} className="h-full" />
               ))}
            </div>

            {/* Center Visual (or additional text) */}
             <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-6 p-6">
                 <div className="relative size-40">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                    <ApplicationSvgLogo 
                        className="relative z-10 object-contain drop-shadow-2xl"
                    />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold">Everything Connected</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Join. Build. Grow. Its that simple.
                    </p>
                 </div>
                 <ButtonLink variant="outline" size="sm" href="/about">
                    Learn how it works
                 </ButtonLink>
             </div>

            {/* Right Column */}
            <div className="space-y-8 flex flex-col justify-start">
               {featuresSectionContent.right.map((feature, i) => (
                  <FeatureCard key={`r-${i}`} feature={feature} className="h-full" />
               ))}
            </div>
          </div>
        </StaggerChildrenContainer>
      </div>
    </section>
  );
}

interface HeroSection {
  user: Session["user"];
}

// Deprecated HeroSection wrapper for backward compatibility if needed, 
// but IntroSection is now the superior component.
export function HeroSection({ user }: HeroSection) {
  return (
    <div
      id="hero-section"
      className="z-10 w-full max-w-7xl max-h-96 relative flex flex-col gap-4 items-center justify-center py-24 px-2 sm:px-4 rounded-lg text-center lg:text-left"
      suppressHydrationWarning={true}
    >
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.1 }}
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-30 flex w-full items-center justify-center flex-col px-4 py-8 bg-background/30 border-muted/30 max-w-xl rounded-3xl border backdrop-blur"
      >
        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="font-bold tracking-tight mb-4 max-w-5xl mt-10 group relative"
        >
          <AnimatedGradientText
            className={cn(
              user
                ? "text-base sm:text-3xl"
                : "text-3xl sm:text-4xl md:text-5xl"
            )}
          >
            {getGreeting()}
          </AnimatedGradientText>{" "}
          <br />
          <span className="text-3xl sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-secondary dark:from-foreground to-primary">
            {user?.name}
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.35,
            type: "spring",
            damping: 20,
            stiffness: 300,
            delayChildren: 0.1,
          }}
          className="text-base text-muted-foreground text-center mb-5"
        >
          {appConfig.description.split(".")[0] ||
            "Welcome to the digital campus platform!"}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4"
        >
          <ButtonLink
            variant="dark"
            href={user ? `/${user.role[0]}` : "/auth/sign-in"}
            effect="shineHover"
            transition="damped"
            shadow="dark"
          >
            <Icon name="chart-candlestick" />
            {user ? "Dashboard" : "Sign In"} <Icon name="arrow-right" />
          </ButtonLink>
          <ButtonLink
            variant="outline"
            target="_blank"
            transition="scale"
            href={`https://github.com/${appConfig.githubUri}/blob/main/CONTRIBUTING.md`}
          >
            <Icon name="github" />
            Contribute Now
            <Icon name="arrow-up-right" />
          </ButtonLink>
        </motion.div>
      </motion.div>
      <FloatingElements />
    </div>
  );
}