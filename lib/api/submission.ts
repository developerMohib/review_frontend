import { api } from "@/lib/axios";
import {
  MySubmissionsResponse,
  SubmissionInput,
  SubmissionResponse,
} from "@/lib/validators/submission.validation";

export const createSubmissionRequest = async (input: SubmissionInput) => {
  const res = await api.post<SubmissionResponse>("/submissions", input);

  return {
    message: res.data.message,
    submission: res.data.data,
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
  const res = await api.get("/submissions/my", {
    params: { page, limit, status },
  });

  return {
    submissions: res.data.data.submissions,
    pagination: res.data.data.pagination,
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

  const res = await api.get<MySubmissionsResponse>(url);
  return res.data.data;
};

export const updateSubmissionStatusRequest = async (
  submissionId: string,
  status: "approved" | "rejected"
) => {
  const res = await api.patch(`/submissions/update/${submissionId}`, {
    status,
  });

  return res.data;
};