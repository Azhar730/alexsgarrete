import { baseApi } from "@/redux/api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    editContractorProfile: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/contractors/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),
    getAllContractor: builder.query({
      query: () => ({
        url: "/contractors",
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    getContractorProfile: builder.query({
      query: () => ({
        url: `/contractors/my-profile`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    getAllUser: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    getMe: builder.query({
      query: () => ({
        url: `/users/me`,
        method: "GET",
      }),
      providesTags:["users"]
    }),
    switchRole: builder.mutation({
      query: (payload) => ({
        url: "/users/switch-role",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users"]
    }),
    askQuestion: builder.mutation({
      query: (payload) => ({
        url: "/users/support",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users"]
    }),
  }),
});
export const {
  useGetAllContractorQuery,
  useEditContractorProfileMutation,
  useGetContractorProfileQuery,
  useGetAllUserQuery,
  useGetMeQuery,
  useSwitchRoleMutation,
  useAskQuestionMutation
} = userApi;
