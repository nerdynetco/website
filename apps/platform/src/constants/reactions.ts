export type ReactionType = "fire" | "rocket" | "bulb";

export const REACTIONS = {
  fire: { emoji: "🔥", label: "Fire" },
  rocket: { emoji: "🚀", label: "Rocket" },
  bulb: { emoji: "💡", label: "Idea" },
} as const;