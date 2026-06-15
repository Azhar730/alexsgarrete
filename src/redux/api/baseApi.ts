import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logout as clearAuth } from "../features/authSlice";
import { toast } from "sonner";

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

const baseQuery = fetchBaseQuery({
  baseUrl: baseApiUrl,
  credentials: "include"
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Token expired or unauthorized
    const state = api.getState() as any;
    if (state?.auth?.token) {
      toast.error("Your login session has expired. Please log in again.", { id: "session-expired" });
    }
    api.dispatch(clearAuth());
  }
  
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["users", "Agreement", "Storage", "Payment", "Activity", "Conversations", "Messages","applications"],
  endpoints: () => ({}),
});