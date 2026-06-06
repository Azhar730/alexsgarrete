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
      // Safe to invalidate: defaultValues is frozen in a ref so form.reset
      // won't fire while the component is mounted (hasResetRef guard).
      // This ensures fresh data when user navigates away and returns.
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
    updateFamilyHealthHistory: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/family-health-history/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),

    deleteFamilyHealthHistory: builder.mutation({
      query: (id: string) => ({
        url: `/family-health-history/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),

    getFamilyHealthHistoryByApplication: builder.query({
      query: (applicationId: string) => ({
        url: `/family-health-history/application/${applicationId}`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    getFamilyHealthHistoryByQuestion: builder.query({
      query: ({ applicationId, questionId }: { applicationId: string; questionId: string }) => ({
        url: `/family-health-history/application/${applicationId}/question/${questionId}`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    getActiveQuestionnaire: builder.query({
      query: () => ({
        url: "/admin/questionnaire/active",
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    getAnswerByQuestion: builder.query({
      query: ({ applicationId, questionId }: { applicationId: string; questionId: string }) => ({
        url: `/application/${applicationId}/answer/question/${questionId}`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    getAnswerByNestedQuestion: builder.query({
      query: ({ applicationId, nestedQuestionId }: { applicationId: string; nestedQuestionId: string }) => ({
        url: `/application/${applicationId}/answer/nested-question/${nestedQuestionId}`,
        method: "GET",
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
      invalidatesTags: ["users", "applications"],
    }),
    updatePet: builder.mutation({
      query: (payload: PetPayload) => ({
        url: `/application/pet`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),
    updatePetById: builder.mutation({
      query: ({ petId, ...payload }: PetPayload & { petId: string }) => ({
        url: `/application/pet/${petId}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["users"],
    }),
    deletePet: builder.mutation({
      query: (petId: string) => ({
        url: `/application/pet/${petId}`,
        method: "DELETE",
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
    acceptHipaa: builder.mutation({
      query: ({ applicationId, hipaaAccepted }: { applicationId: string; hipaaAccepted: boolean }) => ({
        url: `/application/${applicationId}/accept-hipaa`,
        method: "PATCH",
        body: { hipaaAccepted },
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
    getAgreementDocuments: builder.query({
      query: () => ({
        url: "/admin/agreement-document",
        method: "GET",
      }),
      providesTags: ["users"],
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
  useUpdatePetByIdMutation,
  useDeletePetMutation,
  useUpdateProfileMutation,
  useUpdateRepresentativeMutation,
  useUpdateApplicationStatusMutation,
  useAcceptHipaaMutation,
  useGetMyQuotesQuery,
  useGetPetDetailsQuery,
  useReviewQuoteMutation,
  useAddPetMutation,
  useDeleteFamilyHealthHistoryMutation,
  useGetFamilyHealthHistoryByQuestionQuery,
  useGetFamilyHealthHistoryByApplicationQuery,
  useUpdateFamilyHealthHistoryMutation,
  useGetAgreementDocumentsQuery
} = onboardingApi;