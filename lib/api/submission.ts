import { api } from "@/lib/axios";
import { MySubmissionsResponse, SubmissionInput, SubmissionResponse } from "@/lib/validators/submission.validation";

export const createSubmissionRequest = async (input: SubmissionInput) => {
  const res = await api.post<SubmissionResponse>("/submissions", input);

  return {
    message: res.data.message,
    submission: res.data.data,
  };
};

export const getMySubmissionsRequest = async () => {
  const res = await api.get<MySubmissionsResponse>("/submissions/my");

  return {
    message: res.data.message,
    submissions: res.data.data,
  };
};
export const getAllSubmissionsRequest = async () => {
  const res = await api.get<MySubmissionsResponse>("/submissions/all");

  return {
    message: res.data.message,
    submissions: res.data.data,
  };
};