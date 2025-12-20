"use client";

import { motion, useInView, Variants } from "framer-motion";
import {
  Heart,
  Sparkles,
  Users,
  Code2,
  Rocket,
  Zap,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { useRef } from "react";
import Link from "next/link";

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function FindrPageClient() {
  const heroRef = useRef(null);
  const howItWorksRef = useRef(null);
  const whyRef = useRef(null);
  const ctaRef = useRef(null);

  const heroIn = useInView(heroRef, { once: true });
  const howItWorksIn = useInView(howItWorksRef, { once: true });
  const whyIn = useInView(whyRef, { once: true });
  const ctaIn = useInView(ctaRef, { once: true });

  return (
    <div className="flex flex-col gap-24 pb-20 overflow-hidden bg-background text-foreground">
      
      {/* HERO SECTION */}
      <section ref={heroRef} className="relative pt-24 pb-12 lg:pt-32 lg:pb-20">
        {/* Background Grid */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px] -z-10" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] -z-10" />

        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            animate={heroIn ? "visible" : "hidden"}
            variants={stagger}
            className="max-w-5xl mx-auto space-y-8"
          >
            {/* Coming Soon Badge */}
            <motion.div variants={fadeInUp} className="flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-sm font-medium text-pink-500 backdrop-blur-sm">
                <Sparkles className="size-4" />
                Coming Soon
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground text-balance"
            >
              Find Your{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                  Co-Founder
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={heroIn ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </span>
              <br />
              With a Swipe
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed text-balance"
            >
              Stop building alone. Findr is a swipe-based matching platform that connects you with 
              technical co-founders who share your vision, skills, and ambition.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                disabled
                className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-8 text-base font-medium text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Heart className="mr-2 size-5 fill-white" /> 
                Join Waitlist
              </button>
              <Link 
                href="/about"
                className="inline-flex h-14 items-center justify-center rounded-full border border-input bg-background/50 backdrop-blur-md px-8 text-base font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Learn More <ChevronRight className="ml-1 size-5" />
              </Link>
            </motion.div>

            {/* Stats Preview */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-3 gap-8 border-t border-border/40 pt-12 mt-12 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">500+</div>
                <div className="text-sm text-muted-foreground mt-1">Builders Ready</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">4</div>
                <div className="text-sm text-muted-foreground mt-1">Houses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">∞</div>
                <div className="text-sm text-muted-foreground mt-1">Possibilities</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section ref={howItWorksRef} className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate={howItWorksIn ? "visible" : "hidden"}
          variants={stagger}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold tracking-tight">
              How Findr Works
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A simple, intuitive process to find your perfect co-founder match
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StepCard
              number="01"
              title="Create Your Profile"
              description="Share your skills, interests, project ideas, and what you're looking for in a co-founder."
              icon={Users}
              gradient="from-pink-500 to-rose-500"
            />
            <StepCard
              number="02"
              title="Swipe & Match"
              description="Browse through builder profiles. Swipe right on those who align with your vision and tech stack."
              icon={Heart}
              gradient="from-purple-500 to-pink-500"
            />
            <StepCard
              number="03"
              title="Start Building"
              description="Connect with your matches, collaborate on ideas, and build something amazing together."
              icon={Rocket}
              gradient="from-indigo-500 to-purple-500"
            />
          </div>
        </motion.div>
      </section>

      {/* WHY FINDR */}
      <section ref={whyRef} className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate={whyIn ? "visible" : "hidden"}
          variants={stagger}
          className="border border-border/40 rounded-3xl p-8 md:p-12 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden"
        >
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-3xl -z-0" />
          
          <div className="relative z-10 space-y-12">
            <div className="text-center space-y-4">
              <motion.h2 variants={fadeInUp} className="text-4xl font-bold tracking-tight">
                Why Findr?
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Finding a co-founder is hard. We make it easier.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <FeatureCard
                icon={Code2}
                title="Tech Stack Matching"
                description="Filter by programming languages, frameworks, and technical expertise to find compatible builders."
              />
              <FeatureCard
                icon={Zap}
                title="House-Based Trust"
                description="All users are verified Nerdy Network members with proven building history and house reputation."
              />
              <FeatureCard
                icon={Sparkles}
                title="Smart Algorithm"
                description="Our matching algorithm considers skills, interests, availability, and project compatibility."
              />
              <FeatureCard
                icon={CheckCircle2}
                title="Verified Builders"
                description="Every profile shows GitHub activity, progress streaks, and community contributions."
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* FINAL CTA */}
      <section ref={ctaRef} className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate={ctaIn ? "visible" : "hidden"}
          variants={scaleIn}
          className="relative p-12 md:p-16 rounded-3xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white text-center overflow-hidden"
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Your Co-Founder is Waiting
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Join the waitlist to be among the first to experience Findr when we launch. 
              The future of co-founder matching starts here.
            </p>
            <div className="pt-4">
              <button
                disabled
                className="inline-flex h-14 items-center justify-center rounded-full bg-white text-purple-600 px-10 text-base font-semibold shadow-xl transition-all hover:shadow-2xl hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Heart className="mr-2 size-5 fill-purple-600" /> 
                Get Early Access
              </button>
              <p className="text-sm text-white/70 mt-4">
                Launching Q1 2025 • Limited to Nerdy Network members
              </p>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}

// Helper Components

function StepCard({ 
  number, 
  title, 
  description, 
  icon: Icon, 
  gradient 
}: { 
  number: string; 
  title: string; 
  description: string; 
  icon: any; 
  gradient: string;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className="relative group"
    >
      <div className="relative h-full p-8 rounded-2xl border border-border/40 bg-background hover:border-border transition-all">
        {/* Gradient Number */}
        <div className={`text-6xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-4`}>
          {number}
        </div>
        
        {/* Icon */}
        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${gradient} text-white mb-4`}>
          <Icon className="size-6" />
        </div>
        
        {/* Content */}
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: any; 
  title: string; 
  description: string;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className="flex gap-4 p-6 rounded-xl border border-border/40 bg-background/50 backdrop-blur-sm hover:border-primary/40 transition-all"
    >
      <div className="flex-shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-6" />
        </div>
      </div>
      <div className="space-y-1">
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
