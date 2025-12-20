// Project configuration for the College Ecosystem platform
export const orgConfig = {
  name: "Nerdy Network",
  shortName: "NN",
  domain: "nerdynet.co",
  website: "https://nerdynet.co",
  logo: "https://nerdynet.co/logo.svg",
  logoSquare: "https://nerdynet.co/logo-square.png",
  mailSuffix: "@nerdynet.co",

  // Enhanced social profiles
  socials: {
    twitter: {
      url: "https://twitter.com/nerdynetworkco",
      handle: "@nerdynetworkco",
      publisher: "@nerdynetworkco",
    },
    linkedin: "https://linkedin.com/company/nerdynetworkco",
    instagram: "https://instagram.com/nerdynetworkco",
    facebook: "https://facebook.com/nerdynetworkco",
    youtube: "https://youtube.com/@nerdynetworkco",
  },

  contact: {
    email: "contact@nerdynet.co",
    phone: "+91-8299284936",
  },


  // Enhanced structured data
  jsonLds: {
    EducationalOrganization: {
      "@context": "https://schema.org",
      "@type": ["NerdsUniversity", "NerdsOrganization"],
      name: "Nerdy Network",
      url: "https://nerdynet.co",
      logo: "https://nerdynet.co/logo.svg",
      foundingDate: "2025",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Contact",
        telephone: "+91-8299284936",
        email: "contact@nith.ac.in",
      },
    },
  },
} as const;

// This file contains the configuration for the app and college
export const appConfig = {
  name: "Nerdy Network",
  shortName: "NN",
  appDomain: "nerdynet.co",
  otherAppDomains: [
    "app.nerdynet.co",
    "platform.nerdynet.co",
    "os.nerdynet.co",
  ],
  url: "https://app.nerdynet.co",
  logoSquare: "/logo-square.png",
  logo: "/logo.svg",
  logoDark: "/logo-dark.svg",
  description:
    "A community for student builders who talk to their laptops like they're alive.",
  keywords: [
    // Primary terms
    "Code",
    "Creativity",
    "Collaberation",
    "connect with peers",
    "announcements",
  ].join(", "),
  creator: "Nerdy Network",
  authors: [
    {
      name: "Nerdy Network",
      url: "https://aadrika.nerdynet.co",
      image: "https://github.com/nerdynetco.png",
      email: "aadrika@nerdynet.co",
    },
  ],
  githubRepo:
    "https://github.com/nerdynetco/website",
  githubUri: "pro-nerdynetco/website",
  socials: {
    twitter: "https://twitter.com/nerdynetworkco",
    linkedin: "https://linkedin.com/in/nerdynetworkco",
    instagram: "https://instagram.com/nerdynetworkco",
    github: "https://github.com/nerdynetwork",
    website: "https://nerdynet.co/",
  },

  verifications: {
    google_adsense: "ca-pub-6988693445063744",
    google_analytics: "G-SC4TQQ5PCW",
  },
  // SEO-specific enhancements
  seo: {
    locale: "en_IN",
    timezone: "Asia/Kolkata",
    category: "Social Networking",
    publisher: orgConfig.name,
    schemaType: "WebApplication",
  },
  contact: "https://forms.gle/hRwNKJouXpaPSJBv9",
  // Structured data templates
  jsonLds: {
    WebApplication: {
      "@type": "WebApplication",
      name: "Nerdy Network Platform",
      url: "https://app.nerdynet.co",
      applicationCategory: "Social Networking",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
    },
  },

  flags: {
    enableOgImage: false, // Enable Open Graph image generation
  },
};

export const supportLinks = [
  {
    href: appConfig.githubRepo,
    title: "Contribute to this project",
  },
  {
    href: appConfig.githubRepo + "/issues",
    title: "Report an issue",
  },

  {
    href: "https://forms.gle/hRwNKJouXpaPSJBv9",
    title: "Give a feedback",
  },
  {
    href: "https://forms.gle/hRwNKJouXpaPSJBv9",
    title: "Suggest a feature",
  },
] as const;

export default {
  appConfig,
  orgConfig,
  supportLinks,
} as const;
