import { baseApi } from "./baseApi";

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyActivities: builder.query<any, undefined>({
      query: () => ({
        url: "/activity/my",
        method: "GET",
      }),
      providesTags: ["Activity"],
    }),
    markActivityAsRead: builder.mutation<any, string>({
      query: (id) => ({
        url: `/activity/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Activity"],
    }),
  }),
});

export const { useGetMyActivitiesQuery, useMarkActivityAsReadMutation } = activityApi;
