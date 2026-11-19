"use server"
import {
  MySubmissionsResponse,
  SubmissionInput,
  SubmissionResponse,
} from "@/lib/validators/submission.validation";


export const createSubmissionRequest = async (input: SubmissionInput) => {
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

export const getMySubmissionsRequest = async ({
  page = 1,
  limit = 10,
  status,
}: {
  page?: number;
  limit?: number;
  status?: string;
} = {}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions/my`, {
    method: "GET",
    headers: {},
    params: { page, limit, status },
  });

  const data = await res.json();

  return {
    submissions: data.data.submissions,
    pagination: data.data.pagination,
  };
};

export const getAllSubmissionsRequest = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  if (params?.status && params.status !== "all") {
    queryParams.append("status", params.status);
  }

  const queryString = queryParams.toString();
  const url = `/submissions/all${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: "GET",
    headers: {},
  });
  const data = await res.json();
  return data.data;
};

export const updateSubmissionStatusRequest = async (
  submissionId: string,
  status: "approved" | "rejected",
  comment: string // নতুন প্যারামিটার
) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions/update/${submissionId}`, {
    method: "PATCH",
    headers: {},
    body: JSON.stringify({ status, comment }),
  });
  const data = await res.json();
  return data;
};