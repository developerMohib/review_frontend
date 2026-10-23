import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // cookie pathano/neyar jonno must
  headers: { "Content-Type": "application/json" },
});