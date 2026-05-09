import { baseApi } from "@/redux/api/baseApi";

export type PetPayload = {
  applicationId: string;
  id?: string;
  species?: string;
  name?: string;
  gender?: string;
  isSpayedNeutered?: boolean;
  birthday?: string;
  primaryBreed?: string;
  additionalBreed?: string | null;
  colorsAndCoat?: string;
  isMicrochipped?: boolean;
  microchipNumber?: string | null;
  microchipId?: string | null;
  photoUrl?: string | null;
};

type QueryArgs = Record<string, string | number | boolean | undefined>;

const onboardingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    startApplication: builder.mutation({
      query: (payload) => ({
        url: "/application/start",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),
    giveAnswer: builder.mutation({
      query: (payload) => ({
        url: "/application/answer",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),
    familyHealthHistory: builder.mutation({
      query: (payload) => ({
        url: "/family-health-history",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),
    getActiveQuestionnaire: builder.query({
      query: () => ({
        url: "/admin/questionnaire/active",
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    getAnswerByQuestion: builder.query({
      query: (params: QueryArgs = {}) => ({
        url: "/get-answer-by-question",
        method: "GET",
        params,
      }),
      providesTags: ["users"],
    }),
    getAnswerByNestedQuestion: builder.query({
      query: (params: QueryArgs = {}) => ({
        url: "/get-answer-by-nested-question",
        method: "GET",
        params,
      }),
      providesTags: ["users"],
    }),
    getMyApplications: builder.query({
      query: () => ({
        url: "/application/my",
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    addPet: builder.mutation({
      query: (payload: PetPayload) => ({
        url: `/application/pet`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),
    updatePet: builder.mutation({
      query: (payload: PetPayload) => ({
        url: `/application/pet`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),
    updateProfile: builder.mutation({
      query: (payload) => ({
        url: `/application/profile`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),
    updateRepresentative: builder.mutation({
      query: (payload) => ({
        url: "/application/representative",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),
    updateApplicationStatus: builder.mutation({
      query: (payload: { applicationId: string; status: string }) => ({
        url: "/application/status",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),
    getMyQuotes: builder.query({
      query: () => ({
        url: "/quote/my-quotes",
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    getPetDetails: builder.query({
      query: (petId: string) => ({
        url: `/application/pet/${petId}`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    reviewQuote: builder.mutation({
      query: (payload: { 
        quoteGroupId: string; 
        action: "accept" | "reject"; 
        rejectionReason?: string;
      }) => ({
        url: "/quote/review",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),
  }),
});
export const {
  useStartApplicationMutation,
  useGiveAnswerMutation,
  useFamilyHealthHistoryMutation,
  useGetActiveQuestionnaireQuery,
  useGetAnswerByQuestionQuery,
  useGetAnswerByNestedQuestionQuery,
  useGetMyApplicationsQuery,
  useUpdatePetMutation,
  useUpdateProfileMutation,
  useUpdateRepresentativeMutation,
  useUpdateApplicationStatusMutation,
  useGetMyQuotesQuery,
  useGetPetDetailsQuery,
  useReviewQuoteMutation,
  useAddPetMutation
} = onboardingApi;