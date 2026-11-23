"use server"
import {
  PaginationData,
  Submission,
  SubmissionInput,
  SubmissionStats,
} from "@/lib/validators/submission.validation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type SubmissionDetails = Submission & {
  reviewedBy?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  feedbacks?: Array<{
    id: string;
    comment: string;
    createdAt: string;
    mentor: {
      id: string;
      name: string | null;
      email: string;
    };
  }>;
};

export async function getSubmissionByIdServer(submissionId: string) {
  const cookieStore = await cookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}`,
    {
      cache: "no-store",
      headers: { Cookie: cookieStore.toString() },
    }
  );

  if (res.status === 401) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/dashboard/details/${submissionId}`)}`);
  }
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load submission (${res.status})`);

  const json = await res.json();
  return json.data as SubmissionDetails;
}


export const createSubmissionRequest = async (input: SubmissionInput) => {
  console.log(input)
  // const res = await apiServer.post<SubmissionResponse>("/submissions", input);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions`, {
    method: "POST",
    headers: {}});

  const data = await res.json();

  return {
    message: data.message,
    submission: data.data,
  };
};

export async function getMySubmissionsServer({
  page = 1,
  limit = 10,
  status,
}: {
  page?: number;
  limit?: number;
  status?: string;
} = {}) {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status && status !== "all") qs.set("status", status);

  const cookieStore = await cookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/submissions/my?${qs}`,
    {
      cache: "no-store",
      headers: { Cookie: cookieStore.toString() },
    }
  );

  if (res.status === 401) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/dashboard/my-submissions")}`);
  }
  if (!res.ok) throw new Error(`Failed to load submissions (${res.status})`);

  const json = await res.json();
  return {
    submissions: (json.data.submissions ?? []) as Submission[],
    pagination: json.data.pagination as PaginationData,
  };
}

export async function getAllSubmissionsServer(params: {
  page: number;
  limit: number;
  status: string;
}) {
  const qs = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });
  if (params.status !== "all") qs.set("status", params.status);

  const cookieStore = await cookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/submissions/all?${qs}`,
    {
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(), // browser cookie backend e pathano
      },
    }
  );

  if (res.status === 401) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/dashboard/assignment-manage")}`);
  }
  if (!res.ok) throw new Error(`Failed to load submissions (${res.status})`);

  const json = await res.json();
  return json.data as {
    submissions: Submission[];
    pagination: PaginationData;
    stats: SubmissionStats;
  };
}

// export const updateSubmissionStatusRequest = async (
//   submissionId: string,
//   status: "approved" | "rejected",
//   comment: string
// ) => {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions/update/${submissionId}`, {
//     method: "PATCH",
//     headers: {},
//     body: JSON.stringify({ status, comment }),
//   });
//   const data = await res.json();
//   return data;
// };
export const updateSubmissionStatusRequest = async (
  submissionId: string,
  status: "approved" | "rejected",
  comment: string
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/submissions/update/${submissionId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        status,
        comment,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update submission");
  }

  return data;
};