import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_API}`,
    credentials: "include",
    prepareHeaders: (headers) => {
      // Bypass localtunnel and ngrok warning pages
      headers.set("bypass-tunnel-reminder", "true");
      headers.set("ngrok-skip-browser-warning", "true");
      return headers;
    },
  }),
  tagTypes: ["users"],
  endpoints: () => ({}),
});