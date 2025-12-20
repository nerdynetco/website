import { Metadata } from "next";
import FindrPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Findr | Nerdy Network",
  description: "Swipe-based co-founder matching for builders. Find your perfect technical co-founder.",
};

export default function FindrPage() {
  return <FindrPageClient />;
}
