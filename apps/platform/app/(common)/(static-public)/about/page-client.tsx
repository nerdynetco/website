"use client";

import { cn } from "@/lib/utils";
import { motion, useInView, Variants, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Code2,
  Flame,
  Globe,
  HeartHandshake,
  LayoutGrid,
  Rocket,
  Sword,
  Trophy,
  Users,
  Zap,
  ChevronDown
} from "lucide-react";
import { useRef, useState } from "react";
import Link from "next/link";

// --- ANIMATION VARIANTS ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function AboutPage() {
  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const featuresRef = useRef(null);
  const faqRef = useRef(null);

  const heroIn = useInView(heroRef, { once: true });
  const missionIn = useInView(missionRef, { once: true });
  const featuresIn = useInView(featuresRef, { once: true });
  const faqIn = useInView(faqRef, { once: true });

  return (
    <div className="flex flex-col gap-24 pb-20 overflow-hidden bg-background text-foreground">
      
      {/* --- HERO SECTION --- */}
      <section ref={heroRef} className="relative pt-24 pb-12 lg:pt-32 lg:pb-20">
        {/* Background Decor */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            animate={heroIn ? "visible" : "hidden"}
            variants={stagger}
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* Pill Badge */}
            <motion.div variants={fadeInUp} className="flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                The Network is Live
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground text-balance"
            >
              The Internet{"'"}s Messiest, <br />
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Nerdiest Corner.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed text-balance"
            >
              We are a community for student builders who talk to their laptops like they{"'"}re alive.
              Code, create, collaborate, and compete for glory.
            </motion.p>

            {/* Buttons (Standard HTML/Tailwind to avoid missing component errors) */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link 
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <Zap className="mr-2 size-4" /> Start Building
              </Link>
              <Link 
                href="/manifesto"
                className="inline-flex h-12 items-center justify-center rounded-full border border-input bg-background/50 backdrop-blur-md px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <BrainCircuit className="mr-2 size-4" /> Read the Manifesto
              </Link>
            </motion.div>

            {/* Static Stats Row */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border/40 pt-12 mt-12"
            >
              <StatItem label="Builders" value="500+" icon={Users} />
              <StatItem label="Projects Shipped" value="120+" icon={Rocket} />
              <StatItem label="Houses" value="4" icon={Trophy} />
              <StatItem label="Lines of Code" value="∞" icon={Code2} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- MISSION / PHILOSOPHY --- */}
      <section ref={missionRef} className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate={missionIn ? "visible" : "hidden"}
          variants={stagger}
          className="space-y-6"
        >
          <div className="flex flex-col items-center text-center space-y-2 mb-10">
            <h2 className="text-3xl font-semibold tracking-tight">How It Works</h2>
            <p className="text-muted-foreground">Stop waiting for {`"someday"`} and start building today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BentoCard
              title="Find Your Co-Founder"
              desc="Swipe through profiles of fellow builders. Match with people who share your vision and tech stack. No more solo dev depression."
              icon={HeartHandshake}
              className="md:col-span-1 border-pink-500/20 bg-pink-500/5 hover:border-pink-500/40"
              iconColor="text-pink-500"
            />
            <BentoCard
              title="Gamified Chaos"
              desc="Get sorted into a House. Earn points for every commit, streak, and launch. Compete on the leaderboard for eternal glory (and maybe swag)."
              icon={Sword}
              className="md:col-span-2 border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40"
              iconColor="text-purple-500"
            />
            <BentoCard
              title="Build in Public"
              desc="Your digital lab notebook. Document your journey, post daily updates, and keep your streak alive. Accountability is our love language."
              icon={Flame}
              className="md:col-span-2 border-orange-500/20 bg-orange-500/5 hover:border-orange-500/40"
              iconColor="text-orange-500"
            />
            <BentoCard
              title="Open Source Core"
              desc="We practice what we preach. The entire platform is open source. Contribute to the tool you use every day."
              icon={Code2}
              className="md:col-span-1 border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40"
              iconColor="text-blue-500"
            />
          </div>
        </motion.div>
      </section>

      {/* --- TECH STACK --- */}
      <section ref={featuresRef} className="container mx-auto px-4 py-12">
        <motion.div
          initial="hidden"
          animate={featuresIn ? "visible" : "hidden"}
          variants={stagger}
          className="border-y border-border/40 py-16 bg-muted/20 -mx-4 px-4 sm:px-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
            <div className="lg:col-span-4 space-y-6">
              <h2 className="text-3xl font-semibold tracking-tight">Built specifically <br /> for Builders.</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We {`didn't`} just build a social network. We built a productivity engine wrapped in a game.
                Powered by a modern, type-safe stack.
              </p>
              <Link href="/docs" className="inline-flex items-center text-primary font-medium hover:underline">
                View System Architecture <ArrowRight className="ml-1 size-4" />
              </Link>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {techStack.map((tech, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-xl border border-border/40 bg-background p-6 transition-all hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-muted/30 group-hover:text-primary transition-colors">
                      <tech.icon className="size-5" />
                    </div>
                  </div>

                  <h4 className="font-medium text-foreground text-base mb-1">{tech.name}</h4>
                  <p className="text-sm text-muted-foreground">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- FAQ SECTION (Manual implementation to avoid imports) --- */}
      <section ref={faqRef} className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial="hidden"
          animate={faqIn ? "visible" : "hidden"}
          variants={stagger}
        >
          <div className="text-center mb-10">
             <h2 className="text-2xl font-semibold mb-2">Frequently Asked Questions</h2>
             <p className="text-muted-foreground">Everything you need to know about the chaos.</p>
          </div>
         
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <SimpleAccordion key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-muted/50 to-background border border-border/50 relative overflow-hidden">
             <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <h2 className="text-3xl font-bold">Ready to get sorted?</h2>
                <p className="text-muted-foreground">
                    The Sorting Hat is waiting. Join a House, find your team, and start building your legacy.
                </p>
                <Link 
                  href="/register"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                    Join Nerdy Network
                </Link>
             </div>
             {/* Abstract Background */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full -z-0" />
        </div>
      </section>
    </div>
  );
}

// --- DATA & HELPERS ---

function SimpleAccordion({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border/40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:text-primary"
      >
        {question}
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-muted-foreground leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatItem({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="flex flex-col items-center space-y-2 group cursor-default">
      <div className="flex items-center justify-center size-12 rounded-full bg-muted/50 mb-2 group-hover:scale-110 transition-transform duration-300">
        <Icon className="size-6 text-primary" />
      </div>
      <div className="text-2xl lg:text-3xl font-bold tabular-nums tracking-tight">
        {value}
      </div>
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
         {label}
      </div>
    </div>
  );
}

function BentoCard({ title, desc, icon: Icon, className, iconColor }: { title: string; desc: string; icon: any; className?: string, iconColor?: string }) {
  return (
    <div className={cn("group relative overflow-hidden rounded-xl border border-border/40 bg-card p-6 lg:p-8 transition-all hover:shadow-lg", className)}>
      <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-background/80 p-3 backdrop-blur-sm border border-border/20">
        <Icon className={cn("size-5", iconColor || "text-foreground")} />
      </div>
      <h3 className="mb-2 text-lg font-bold tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

const techStack = [
  { name: "Next.js & React", icon: Globe, desc: "Server-side rendering for lightning fast profiles." },
  { name: "TypeScript", icon: Code2, desc: "Because we respect ourselves and our codebase." },
  { name: "Tailwind CSS", icon: LayoutGrid, desc: "Utility-first for when you need to ship UI fast." },
  { name: "Gamification Engine", icon: Trophy, desc: "Custom logic for House Points and Streaks." },
];

const faqItems = [
  {
    q: "Is this just for Computer Science students?",
    a: "Nope. We have designers, PMs, and hardware geeks. If you build things, you belong here. However, talking to your laptop is a prerequisite."
  },
  {
    q: "How does the House Sorting work?",
    a: "You take a personality quiz based on your building style (e.g., 'Do you ship fast and break things?' vs 'Do you architect perfection?'). The algorithm then places you in one of the 4 Houses."
  },
  {
    q: "Is this a dating app?",
    a: "It's a dating app for co-founders. You swipe to find teammates for hackathons or side projects. If you fall in love while debugging, that's on you."
  },
  {
    q: "Does it cost money?",
    a: "The Nerdy Network is free for students. We might add premium features later for recruiters to find you, but your profile and projects will always be free."
  }
];