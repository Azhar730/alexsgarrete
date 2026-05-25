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
    clearAllActivities: builder.mutation<any, undefined>({
      query: () => ({
        url: "/activity/clear-all",
        method: "DELETE",
      }),
      invalidatesTags: ["Activity"],
    }),
    deleteActivity: builder.mutation<any, string>({
      query: (id) => ({
        url: `/activity/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Activity"],
    }),
  }),
});

export const { 
  useGetMyActivitiesQuery, 
  useMarkActivityAsReadMutation, 
  useClearAllActivitiesMutation,
  useDeleteActivityMutation
} = activityApi;
