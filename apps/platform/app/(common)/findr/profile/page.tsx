import { Metadata } from "next";
import { redirect } from "next/navigation";
import ProfileSetupForm from "../components/profile-setup-form";
import { getMyFindrProfile } from "~/actions/findr";

export const metadata: Metadata = {
    title: "Setup Profile | Findr",
    description: "Create your co-founder matching profile",
};

export default async function FindrProfilePage() {
    const profile = await getMyFindrProfile();

    // Convert to plain object for client component
    const existingProfile = profile
        ? {
            bio: profile.bio || "",
            role: profile.role,
            skills: (profile.skills as string[]) || [],
            lookingFor: (profile.lookingFor as string[]) || [],
            projectIdeas: (profile.projectIdeas as string[]) || [],
            interests: (profile.interests as string[]) || [],
            commitment: profile.commitment || "flexible",
        }
        : null;

    return <ProfileSetupForm existingProfile={existingProfile} />;
}
