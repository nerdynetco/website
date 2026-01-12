"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Code2,
    Briefcase,
    Sparkles,
    ChevronRight,
    ChevronLeft,
    X,
    Rocket,
    CheckCircle2,
    Clock
} from "lucide-react";
import { createOrUpdateFindrProfile, type CreateFindrProfileInput } from "~/actions/findr";
import { toast } from "sonner";

const profileSchema = z.object({
    bio: z.string().max(280, "Bio must be 280 characters or less").optional(),
    role: z.enum(["technical", "non-technical", "hybrid"]),
    skills: z.array(z.string()).min(1, "Add at least one skill"),
    lookingFor: z.array(z.string()).min(1, "Add at least one skill you're looking for"),
    projectIdeas: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
    commitment: z.enum(["full-time", "part-time", "weekends", "flexible"]).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const SKILL_SUGGESTIONS = [
    "React", "Next.js", "TypeScript", "Node.js", "Python", "Go", "Rust",
    "Machine Learning", "AI/LLM", "Data Science", "DevOps", "AWS", "Docker",
    "UI/UX Design", "Product Management", "Marketing", "Sales", "Finance",
    "Mobile (React Native)", "Mobile (Flutter)", "iOS (Swift)", "Android (Kotlin)",
    "Blockchain", "Web3", "Smart Contracts", "Backend", "Frontend", "Full Stack"
];

const INTEREST_SUGGESTIONS = [
    "AI/ML", "SaaS", "Consumer Apps", "B2B", "Developer Tools",
    "EdTech", "FinTech", "HealthTech", "Climate", "Gaming",
    "E-commerce", "Social", "Productivity", "Open Source", "Hardware"
];

interface ProfileSetupFormProps {
    existingProfile?: CreateFindrProfileInput | null;
}

export default function ProfileSetupForm({ existingProfile }: ProfileSetupFormProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [skillInput, setSkillInput] = useState("");
    const [lookingForInput, setLookingForInput] = useState("");
    const [ideaInput, setIdeaInput] = useState("");

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            bio: existingProfile?.bio || "",
            role: existingProfile?.role || "technical",
            skills: existingProfile?.skills || [],
            lookingFor: existingProfile?.lookingFor || [],
            projectIdeas: existingProfile?.projectIdeas || [],
            interests: existingProfile?.interests || [],
            commitment: existingProfile?.commitment || "flexible",
        },
    });

    const { watch, setValue, handleSubmit, formState: { errors } } = form;
    const skills = watch("skills");
    const lookingFor = watch("lookingFor");
    const projectIdeas = watch("projectIdeas") || [];
    const interests = watch("interests") || [];
    const role = watch("role");

    const addSkill = (skill: string) => {
        const trimmed = skill.trim();
        if (trimmed && !skills.includes(trimmed)) {
            setValue("skills", [...skills, trimmed]);
        }
        setSkillInput("");
    };

    const removeSkill = (skill: string) => {
        setValue("skills", skills.filter((s) => s !== skill));
    };

    const addLookingFor = (skill: string) => {
        const trimmed = skill.trim();
        if (trimmed && !lookingFor.includes(trimmed)) {
            setValue("lookingFor", [...lookingFor, trimmed]);
        }
        setLookingForInput("");
    };

    const removeLookingFor = (skill: string) => {
        setValue("lookingFor", lookingFor.filter((s) => s !== skill));
    };

    const toggleInterest = (interest: string) => {
        if (interests.includes(interest)) {
            setValue("interests", interests.filter((i) => i !== interest));
        } else {
            setValue("interests", [...interests, interest]);
        }
    };

    const addProjectIdea = () => {
        const trimmed = ideaInput.trim();
        if (trimmed && projectIdeas.length < 3) {
            setValue("projectIdeas", [...projectIdeas, trimmed]);
            setIdeaInput("");
        }
    };

    const removeProjectIdea = (idea: string) => {
        setValue("projectIdeas", projectIdeas.filter((i) => i !== idea));
    };

    const onSubmit = async (data: ProfileFormData) => {
        setIsSubmitting(true);
        try {
            await createOrUpdateFindrProfile(data as CreateFindrProfileInput);
            toast.success("Profile saved! Let's start swiping!");
            router.push("/findr");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to save profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalSteps = 4;

    return (
        <div className="container max-w-2xl py-8">
            {/* Progress */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
                    <span className="text-sm font-medium">{Math.round((step / totalSteps) * 100)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / totalSteps) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Step 1: Role Selection */}
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">What&apos;s your role?</CardTitle>
                                <CardDescription>
                                    This helps us match you with complementary co-founders
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <RadioGroup
                                    value={role}
                                    onValueChange={(value) => setValue("role", value as any)}
                                    className="grid gap-4"
                                >
                                    {[
                                        {
                                            value: "technical",
                                            icon: Code2,
                                            title: "Technical",
                                            description: "You can build the product - coding, engineering, etc.",
                                            color: "text-blue-500 bg-blue-500/10 border-blue-500/30",
                                        },
                                        {
                                            value: "non-technical",
                                            icon: Briefcase,
                                            title: "Non-Technical",
                                            description: "You focus on business - sales, marketing, operations, etc.",
                                            color: "text-amber-500 bg-amber-500/10 border-amber-500/30",
                                        },
                                        {
                                            value: "hybrid",
                                            icon: Sparkles,
                                            title: "Hybrid",
                                            description: "You're comfortable with both technical and business sides.",
                                            color: "text-purple-500 bg-purple-500/10 border-purple-500/30",
                                        },
                                    ].map((option) => (
                                        <label
                                            key={option.value}
                                            className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${role === option.value
                                                ? option.color
                                                : "border-border hover:border-primary/50"
                                                }`}
                                        >
                                            <RadioGroupItem value={option.value} className="mt-1" />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 font-semibold">
                                                    <option.icon className="size-5" />
                                                    {option.title}
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {option.description}
                                                </p>
                                            </div>
                                        </label>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Step 2: Skills */}
                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Your Skills</CardTitle>
                                <CardDescription>
                                    What can you bring to the table?
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Skills input */}
                                <div className="space-y-2">
                                    <Label>Your skills</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Type a skill and press Enter"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addSkill(skillInput);
                                                }
                                            }}
                                        />
                                        <Button type="button" variant="secondary" onClick={() => addSkill(skillInput)}>
                                            Add
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {skills.map((skill) => (
                                            <Badge key={skill} variant="secondary" className="pl-3 pr-1 py-1.5 text-sm">
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => removeSkill(skill)}
                                                    className="ml-2 hover:bg-destructive/20 rounded-full p-0.5"
                                                >
                                                    <X className="size-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                    {errors.skills && (
                                        <p className="text-sm text-destructive">{errors.skills.message}</p>
                                    )}
                                </div>

                                {/* Suggestions */}
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground text-xs">Suggestions</Label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s)).slice(0, 12).map((skill) => (
                                            <Button
                                                key={skill}
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="text-xs h-7"
                                                onClick={() => addSkill(skill)}
                                            >
                                                + {skill}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Looking for */}
                                <div className="space-y-2 pt-4 border-t">
                                    <Label>Skills you&apos;re looking for in a co-founder</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="What skills complement yours?"
                                            value={lookingForInput}
                                            onChange={(e) => setLookingForInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addLookingFor(lookingForInput);
                                                }
                                            }}
                                        />
                                        <Button type="button" variant="secondary" onClick={() => addLookingFor(lookingForInput)}>
                                            Add
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {lookingFor.map((skill) => (
                                            <Badge key={skill} variant="outline" className="pl-3 pr-1 py-1.5 text-sm border-primary/30 text-primary">
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => removeLookingFor(skill)}
                                                    className="ml-2 hover:bg-destructive/20 rounded-full p-0.5"
                                                >
                                                    <X className="size-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                    {errors.lookingFor && (
                                        <p className="text-sm text-destructive">{errors.lookingFor.message}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Step 3: Interests & Ideas */}
                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Interests & Ideas</CardTitle>
                                <CardDescription>
                                    What domains excite you? Any project ideas?
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Interests */}
                                <div className="space-y-3">
                                    <Label>Domains you&apos;re interested in</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {INTEREST_SUGGESTIONS.map((interest) => (
                                            <Button
                                                key={interest}
                                                type="button"
                                                variant={interests.includes(interest) ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => toggleInterest(interest)}
                                            >
                                                {interests.includes(interest) && <CheckCircle2 className="size-3.5 mr-1" />}
                                                {interest}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Project Ideas */}
                                <div className="space-y-3 pt-4 border-t">
                                    <Label>Project ideas (optional, max 3)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Brief description of your idea"
                                            value={ideaInput}
                                            onChange={(e) => setIdeaInput(e.target.value)}
                                            disabled={projectIdeas.length >= 3}
                                        />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={addProjectIdea}
                                            disabled={projectIdeas.length >= 3 || !ideaInput.trim()}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    {projectIdeas.length > 0 && (
                                        <div className="space-y-2 mt-3">
                                            {projectIdeas.map((idea, i) => (
                                                <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-muted">
                                                    <Rocket className="size-4 text-primary mt-0.5 flex-shrink-0" />
                                                    <span className="flex-1 text-sm">{idea}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeProjectIdea(idea)}
                                                        className="text-muted-foreground hover:text-destructive"
                                                    >
                                                        <X className="size-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Step 4: Bio & Commitment */}
                {step === 4 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Almost done!</CardTitle>
                                <CardDescription>
                                    Add a bio and set your availability
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Bio */}
                                <div className="space-y-2">
                                    <Label>Bio (optional)</Label>
                                    <Textarea
                                        placeholder="Tell potential co-founders about yourself..."
                                        {...form.register("bio")}
                                        rows={4}
                                        maxLength={280}
                                    />
                                    <p className="text-xs text-muted-foreground text-right">
                                        {(watch("bio") || "").length}/280
                                    </p>
                                </div>

                                {/* Commitment */}
                                <div className="space-y-3">
                                    <Label>Your availability</Label>
                                    <RadioGroup
                                        value={watch("commitment")}
                                        onValueChange={(value) => setValue("commitment", value as any)}
                                        className="grid grid-cols-2 gap-3"
                                    >
                                        {[
                                            { value: "full-time", label: "Full-time", icon: "🚀" },
                                            { value: "part-time", label: "Part-time", icon: "⏰" },
                                            { value: "weekends", label: "Weekends", icon: "📅" },
                                            { value: "flexible", label: "Flexible", icon: "🌊" },
                                        ].map((option) => (
                                            <label
                                                key={option.value}
                                                className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${watch("commitment") === option.value
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:border-primary/50"
                                                    }`}
                                            >
                                                <RadioGroupItem value={option.value} />
                                                <span>{option.icon}</span>
                                                <span className="font-medium">{option.label}</span>
                                            </label>
                                        ))}
                                    </RadioGroup>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setStep((s) => s - 1)}
                        disabled={step === 1}
                    >
                        <ChevronLeft className="size-4 mr-1" />
                        Back
                    </Button>

                    {step < totalSteps ? (
                        <Button
                            type="button"
                            onClick={() => setStep((s) => s + 1)}
                            disabled={
                                (step === 1 && !role) ||
                                (step === 2 && (skills.length === 0 || lookingFor.length === 0))
                            }
                        >
                            Continue
                            <ChevronRight className="size-4 ml-1" />
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white"
                        >
                            {isSubmitting ? (
                                <>
                                    <Clock className="size-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="size-4 mr-2" />
                                    Start Matching
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
