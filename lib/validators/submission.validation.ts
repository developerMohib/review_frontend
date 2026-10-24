export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface SubmissionInput {
  projectName: string;
  category: string;
  repoUrl: string;
  liveUrl: string;
  description: string;
}

export interface Submission {
  id: string;
  projectName: string;
  category: string;
  repoUrl: string;
  liveUrl: string;
  description: string;
  status: SubmissionStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  data: Submission;
}

export interface MySubmissionsResponse {
  success: boolean;
  message: string;
  data: Submission[];
}

import { z } from "zod";

export const submissionSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must be at most 100 characters"),

  category: z
    .string()
    .trim()
    .min(1, "Please select a category"),

  repoUrl: z
    .string()
    .trim()
    .url("Repository URL must be a valid URL")
    .regex(/^https?:\/\//, "Repository URL must start with http:// or https://"),

  liveUrl: z
    .string()
    .trim()
    .url("Live URL must be a valid URL")
    .regex(/^https?:\/\//, "Live URL must start with http:// or https://")
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be at most 1000 characters"),
});

export type SubmissionFormValues = z.infer<typeof submissionSchema>;