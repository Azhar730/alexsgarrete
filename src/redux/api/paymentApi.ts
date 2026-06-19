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

export interface StripeOverviewResponse {
  success: boolean;
  message: string;
  data: {
    stripe: {
      isStripeConnected: boolean;
      stripeCustomerId: string | null;
      subscriptions: any[];
      invoices: any[];
      paymentMethods: any[];
    };
    local: {
      allPayments: any[];
      successfulPayments: any[];
      pendingPayments: any[];
      setupPayments: any[];
      monthlyPayments: any[];
      monthlySuccessfulPayments: any[];
      monthlyPendingPayments: any[];
      source: string;
    };
    summary: {
      totalRecords: number;
      successfulCount: number;
      pendingCount: number;
      setupCount: number;
      monthlyCount: number;
      source: string;
    };
  };
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    connectStripe: builder.mutation<ConnectStripeResponse, { quoteGroupId?: string } | void>({
      query: (body) => ({
        url: "/payment/connect",
        method: "POST",
        body: body || {},
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
    createSubscriptionIntent: builder.mutation<{ success: boolean; data: { clientSecret: string; type: string } }, StripeSessionRequest>({
      query: (body) => ({
        url: "/payment/create-subscription-intent",
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
    getStripeOverview: builder.query<StripeOverviewResponse, void>({
      query: () => ({
        url: "/payment/stripe-overview",
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),
    getPendingRequests: builder.query({
      query: () => ({
        url: "/payment/requests/pending",
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),
    approveRequest: builder.mutation({
      query: (requestId: string) => ({
        url: `/payment/requests/${requestId}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Payment"],
    }),
    rejectRequest: builder.mutation({
      query: (requestId: string) => ({
        url: `/payment/requests/${requestId}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  useConnectStripeMutation,
  useCreateCheckoutSessionMutation,
  useCreateSubscriptionIntentMutation,
  useGetConnectAccountQuery,
  useGetMyPaymentsQuery,
  useGetStripeOverviewQuery,
  useGetPendingRequestsQuery,
  useApproveRequestMutation,
  useRejectRequestMutation,
} = paymentApi;
