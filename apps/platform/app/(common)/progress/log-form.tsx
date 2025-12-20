"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { createProgressLog, quickBuildLog } from "~/actions/progress";
import { PROGRESS_CATEGORIES } from "~/models/progress";

const progressFormSchema = z.object({
  category: z.enum(PROGRESS_CATEGORIES),
  intensity: z.number().min(1).max(4),
  note: z.string().max(500).optional(),
  autoShare: z.boolean().default(true),
});

type ProgressFormValues = z.infer<typeof progressFormSchema>;

export default function ProgressLogForm() {
  const router = useRouter();

  const form = useForm<ProgressFormValues>({
    resolver: zodResolver(progressFormSchema),
    defaultValues: {
      category: "Code",
      intensity: 2,
      note: "",
      autoShare: true,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: ProgressFormValues) {
    try {
      const log = await createProgressLog({
        date: new Date(),
        category: values.category,
        intensity: values.intensity,
        note: values.note || undefined,
        autoShared: values.autoShare,
      });

      toast.success("Progress logged! 🚀");
      form.reset();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to log progress");
    }
  }

  async function handleQuickLog(category: string) {
    try {
      await quickBuildLog(category, 2);
      toast.success(`${category} progress logged! 🎉`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to log progress");
    }
  }

  const intensityValue = form.watch("intensity");

  return (
    <div className="space-y-6">
      {/* Quick Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="size-5" />
            Quick Log
          </CardTitle>
          <CardDescription>
            One-click progress logging for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PROGRESS_CATEGORIES.map((category) => (
              <Button
                key={category}
                variant="outline"
                onClick={() => handleQuickLog(category)}
                className="h-auto py-3 flex flex-col gap-1"
              >
                <span className="font-semibold">{category}</span>
                <span className="text-xs text-muted-foreground">
                  I built today
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-5" />
            Detailed Progress Log
          </CardTitle>
          <CardDescription>
            Add more details about your progress today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Category Selection */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROGRESS_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Intensity Slider */}
              <FormField
                control={form.control}
                name="intensity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Intensity: {"⭐".repeat(intensityValue)}
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={4}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      How intense was your work session? (1-4)
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Optional Note */}
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What did you work on today? Any wins or challenges?"
                        className="resize-none"
                        rows={4}
                        maxLength={500}
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground text-right">
                      {field.value?.length || 0}/500
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Auto-Share Toggle */}
              <FormField
                control={form.control}
                name="autoShare"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Share to Community
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Automatically post this progress to your house feed
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Logging Progress...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 size-4" />
                    Log Progress
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
