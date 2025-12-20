// Updated feature data arrays for College Ecosystem

import {
  Building,
  Calendar,
  FileText,
  Gamepad2,
  GraduationCap,
  LucideIcon,
  MessageSquare,
  Rocket,
  Users,
} from "lucide-react";

export type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  position?: "left" | "right";
  cornerStyle?: string;
};

const leftFeatures: FeatureItem[] = [
  {
    icon: Rocket, // lucide-react
    title: "build in public",
    description:
      "Your digital lab notebook. Document your journey. Post daily updates. Build streaks. Set deadlines. Actually finish what you start.",
    position: "left",
    cornerStyle: "sm:translate-x-4 sm:rounded-br-[2px]",
  },
  {
    icon: Gamepad2, // lucide-react
    title: "Gamified community building",
    description:
      "Get sorted into a house. Earn points for every action. Compete on the leaderboard. Glory awaits.",
    position: "left",
    cornerStyle: "sm:-translate-x-4 sm:rounded-br-[2px]",
  },
  {
    icon: Calendar, // lucide-react
    title: "Events & Activities",
    description:
      "Stay updated with hackathons, workshops, and events — all in one place.",
    position: "right",
    cornerStyle: "sm:-translate-x-4 sm:rounded-bl-[2px]",
  },
];

const rightFeatures: FeatureItem[] = [
  {
    icon: Users, // lucide-react
    title: "Find your perfect project partners",
    description:
      "Swipe through profiles of fellow builders. Match with people who share your vision. Start collaborating on projects that matter.",
    position: "left",
    cornerStyle: "sm:translate-x-4 sm:rounded-tr-[2px]",
  },
  {
    icon: FileText, // lucide-react
    title: "Resources Hub",
    description:
      "Get suggested resources and study material tailored to your needs.",
    position: "right",
    cornerStyle: "sm:translate-x-4 sm:rounded-bl-[2px]",
  },
  {
    icon: MessageSquare, // lucide-react
    title: "Community Space",
    description:
      "Engage with peers, share ideas, and collaborate through dedicated student forums.",
    position: "right",
    cornerStyle: "sm:-translate-x-4 sm:rounded-tl-[2px]",
  },
];

export const featuresSectionContent = {
  left: leftFeatures,
  right: rightFeatures,
};

export const testimonialsContent = [
  {
    description: "Just got access to the beta. The sorting quiz was actually surprisingly deep? Proud to be in House 3! 🦁",
    image: "https://i.pravatar.cc/150?img=12",
    name: "Sarah Jenkins",
    handle: "@sarah_builds",
  },
  {
    description: "Finally a platform for us. The Tinder-style swiping for teammates is slick. Already found a designer for my weekend project.",
    image: "https://i.pravatar.cc/150?img=59",
    name: "Marcus Chen",
    handle: "@marcus_dev",
  },
  {
    description: "The 'messy' branding is such a vibe. It feels like a real discord server but organized. Excited to see where v1 goes.",
    image: "https://i.pravatar.cc/150?img=32",
    name: "Priya Patel",
    handle: "@priya_codes",
  },
  {
    description: "Logged my first build streak today. The gamification actually makes me want to code after classes. UI looks clean for a v1 launch.",
    image: "https://i.pravatar.cc/150?img=15",
    name: "David Ross",
    handle: "@dave_ships",
  },
  {
    description: "Connecting with other builders at my uni is usually so awkward. This makes it way easier. Just set up my profile.",
    image: "https://i.pravatar.cc/150?img=60",
    name: "Elena Rodriguez",
    handle: "@elena_tech",
  },
  {
    description: "Wait, the leaderboard is actually live? I need to push some commits before I sleep or my House is gonna lose.",
    image: "https://i.pravatar.cc/150?img=11",
    name: "James Foster",
    handle: "@foster_logic",
  },
  {
    description: "Love that it’s dark mode by default. A few little bugs here and there but the core idea of 'building in public' is executed perfectly.",
    image: "https://i.pravatar.cc/150?img=5",
    name: "Aisha Khan",
    handle: "@aisha_ui",
  },
  {
    description: "Just swiped right on a project that looks exactly like what I wanted to build. Collab time. 🚀",
    image: "https://i.pravatar.cc/150?img=8",
    name: "Tom Baker",
    handle: "@tbaker_99",
  },
  {
    description: "Being part of the first wave of users feels cool. The 'Talk to your laptops' tagline is literally me. Signed up immediately.",
    image: "https://i.pravatar.cc/150?img=25",
    name: "Chloe Kim",
    handle: "@chlo_stacks",
  },
  {
    description: "Simple, fast, and to the point. No corporate fluff. Just students building cool stuff. Glad I registered.",
    image: "https://i.pravatar.cc/150?img=33",
    name: "Ryan O'Connor",
    handle: "@ryan_builds",
  },
];