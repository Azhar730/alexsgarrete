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
    getStripeOverview: builder.query<StripeOverviewResponse, void>({
      query: () => ({
        url: "/payment/stripe-overview",
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
  useGetStripeOverviewQuery,
} = paymentApi;
