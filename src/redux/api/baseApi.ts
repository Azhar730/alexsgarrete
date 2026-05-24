import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const baseApiUrl =
  process.env.NEXT_PUBLIC_BASE_API_URL?.trim() ||
  process.env.NEXT_PUBLIC_BASE_API?.trim() ||
  "http://localhost:3030";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseApiUrl,
    credentials: "include"
  }),
  tagTypes: ["users", "Agreement", "Storage", "Payment", "Activity", "Conversations", "Messages"],
  endpoints: () => ({}),
});