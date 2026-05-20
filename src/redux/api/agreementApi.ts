import { baseApi } from "./baseApi";

export interface AgreementDocument {
  id: string;
  agreementId: string | null;
  agreementDocURL: string | null;
}

export interface Agreement {
  id: string;
  quoteId: string;
  documentUrl: string;
  isSigned: boolean;
  signatureDocUrl: string | null;
  signedAt: string | null;
  ipAddress: string | null;
  agreementDocuments?: AgreementDocument[];
  createdAt: string;
}

export interface SignAgreementRequest {
  quoteId: string;
  documentUrl: string;
  signatureDocUrl?: string;
  ipAddress?: string;
}

export const agreementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAgreementById: builder.query<{ data: Agreement }, string>({
      query: (id) => `/agreement/${id}`,
      providesTags: ["Agreement"],
    }),
    getMyAgreements: builder.query<{ data: Agreement[] }, void>({
      query: () => "/agreement/my",
      providesTags: ["Agreement"],
    }),
    signAgreement: builder.mutation<{ data: Agreement }, SignAgreementRequest>({
      query: (body) => ({
        url: "/agreement/sign",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Agreement"],
    }),
  }),
});

export const {
  useGetAgreementByIdQuery,
  useGetMyAgreementsQuery,
  useSignAgreementMutation,
} = agreementApi;
