"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  ExternalLink,
  Info,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { submissionSchema } from "@/lib/validators/submission.validation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SubmissionForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);

      const payload = {
        projectName: String(formData.get("project") ?? "").trim(),
        category: String(formData.get("category") ?? "Web app"),
        repoUrl: String(formData.get("repository") ?? "").trim(),
        liveUrl: String(formData.get("liveUrl") ?? "").trim(),
        description: String(formData.get("description") ?? "").trim(),
      };

      const parsed = submissionSchema.safeParse(payload);

      if (!parsed.success) {
        const firstError = parsed.error.issues[0]?.message;

        toast.error(firstError || "Please check the form fields");
        return;
      }

      // Add your existing API submission logic here.

    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full border-border/60 shadow-sm">
      <CardContent className="grid gap-6 p-4 md:grid-cols-[1fr_300px] md:p-6">

        {/* Submission Form */}
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center gap-3 px-0">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
              01
            </span>

            <CardContent className="space-y-1 p-0">
              <CardTitle className="text-xl">
                Project details
              </CardTitle>
              <CardDescription>
                Tell us a little about your work.
              </CardDescription>
            </CardContent>
          </CardHeader>

          <CardContent className="space-y-5 px-0">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Project Name */}
              <CardContent className="space-y-2 p-0">
                <Label htmlFor="project">
                  Project name <span className="text-destructive">*</span>
                </Label>

                <Input
                  id="project"
                  name="project"
                  placeholder="e.g. Launchpad — SaaS starter"
                  required
                  minLength={3}
                />
              </CardContent>

              {/* Category */}
              <CardContent className="space-y-2 p-0">
                <Label htmlFor="category">
                  Project category <span className="text-destructive">*</span>
                </Label>

                <Select name="category" defaultValue="Web app" required>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Web app">Web app</SelectItem>
                    <SelectItem value="Mobile app">Mobile app</SelectItem>
                    <SelectItem value="Open source">Open source</SelectItem>
                    <SelectItem value="Data & AI">Data & AI</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>

              {/* Repository */}
              <CardContent className="space-y-2 p-0">
                <Label htmlFor="repository">
                  Repository URL <span className="text-destructive">*</span>
                </Label>

                <CardContent className="relative p-0">
                  <Code2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="repository"
                    name="repository"
                    type="url"
                    placeholder="https://github.com/developerMohib"
                    className="pl-10"
                    required
                  />
                </CardContent>
              </CardContent>

              {/* Live URL */}
              <CardContent className="space-y-2 p-0">
                <Label htmlFor="liveUrl">
                  Live demo URL
                  <span className="ml-2 text-xs text-muted-foreground">
                    OPTIONAL
                  </span>
                </Label>

                <CardContent className="relative p-0">
                  <ExternalLink className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="liveUrl"
                    name="liveUrl"
                    type="url"
                    placeholder="https://your-project.com"
                    className="pl-10"
                  />
                </CardContent>
              </CardContent>

              {/* Description */}
              <CardContent className="space-y-2 p-0">
                <Label htmlFor="description">
                  Project description <span className="text-destructive">*</span>
                </Label>

                <Textarea
                  id="description"
                  name="description"
                  placeholder="What does your project do? What are you most proud of?"
                  minLength={20}
                  maxLength={500}
                  required
                  rows={5}
                  className="resize-none"
                />

                <p className="text-xs text-muted-foreground">
                  Share the problem you re solving and any details your reviewer should know.
                </p>
              </CardContent>

              {/* Actions */}
              <CardContent className="flex flex-col-reverse gap-3 p-0 sm:flex-row sm:justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="size-4" />
                  Go back
                </Button>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit project
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </form>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <Card className="h-fit border-primary/10 bg-primary/[0.03] shadow-none">
          <CardContent className="space-y-4 p-5">

            <Sparkles className="size-6 text-primary" />

            <CardContent className="space-y-2 p-0">
              <p className="text-xs font-semibold tracking-wider text-primary">
                A QUICK TIP
              </p>

              <CardTitle className="text-lg">
                Help your project shine
              </CardTitle>

              <CardDescription className="leading-relaxed">
                A clear README and a working demo help your mentor understand
                your work and give more useful feedback.
              </CardDescription>
            </CardContent>

            <CardContent className="space-y-3 p-0 text-sm">
              {[
                "Repository is public or accessible",
                "Include setup instructions",
                "Add a live demo if you can",
              ].map((tip) => (
                <CardContent key={tip} className="flex items-center gap-2 p-0">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                    ✓
                  </span>
                  <span>{tip}</span>
                </CardContent>
              ))}
            </CardContent>
          </CardContent>
        </Card>

        {/* Information */}
        <Card className="border-blue-500/20 bg-blue-500/5 shadow-none md:col-span-2">
          <CardContent className="flex items-start gap-3 p-4">
            <Info className="mt-0.5 size-4 shrink-0 text-blue-500" />

            <CardDescription className="text-sm leading-relaxed">
              You can submit one project at a time. Once it s reviewed,
              you can share your next one.
            </CardDescription>
          </CardContent>
        </Card>

      </CardContent>
    </Card>
  );
}
