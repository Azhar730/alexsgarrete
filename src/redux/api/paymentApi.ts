import { baseApi } from "./baseApi";

export interface StripeSessionRequest {
  quoteGroupId: string;
  setupFee: number;
  totalMonthlyCharge: number;
}

export interface StripeSessionResponse {
  success: boolean;
  message: string;
  data: {
    sessionId: string;
    url: string;
  };
}

export interface ConnectStripeResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
  };
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    connectStripe: builder.mutation<ConnectStripeResponse, void>({
      query: () => ({
        url: "/payment/connect",
        method: "POST",
      }),
      invalidatesTags: ["Payment"],
    }),
    createCheckoutSession: builder.mutation<StripeSessionResponse, StripeSessionRequest>({
      query: (body) => ({
        url: "/payment/create-checkout-session",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payment"],
    }),
    getConnectAccount: builder.query({
      query: () => ({
        url: "/payment/status",
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),
    getMyPayments: builder.query({
      query: () => ({
        url: "/payment/my",
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),
  }),
});

export const {
  useConnectStripeMutation,
  useCreateCheckoutSessionMutation,
  useGetConnectAccountQuery,
  useGetMyPaymentsQuery,
} = paymentApi;
