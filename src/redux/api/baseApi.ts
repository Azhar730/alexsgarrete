import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const getBaseApiUrl = () => {
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:3030";
  }
  return (
    process.env.NEXT_PUBLIC_BASE_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_BASE_API?.trim() ||
    "http://localhost:3030"
  );
};

const baseApiUrl = getBaseApiUrl();

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseApiUrl,
    credentials: "include"
  }),
  tagTypes: ["users", "Agreement", "Storage", "Payment", "Activity", "Conversations", "Messages"],
  endpoints: () => ({}),
});