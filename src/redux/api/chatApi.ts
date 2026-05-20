import { baseApi } from "./baseApi";

export const ChatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => "/chat/conversations",
      providesTags: ["Conversations"],
    }),
    getMessages: builder.query({
      query: (conversationId) => `/chat/messages/${conversationId}`,
      providesTags: (result, error, id) => [{ type: "Messages", id }],
    }),
    sendMessage: builder.mutation({
      query: (data) => ({
        url: "/chat/message",
        method: "POST",
        body: data,
      }),
    }),
    createConversation: builder.mutation({
      query: (participantIds) => ({
        url: "/chat/conversation",
        method: "POST",
        body: { participantIds },
      }),
      invalidatesTags: ["Conversations"],
    }),
    markAsRead: builder.mutation({
      query: (conversationId) => ({
        url: "/chat/mark-read",
        method: "PATCH",
        body: { conversationId },
      }),
      invalidatesTags: ["Conversations"],
    }),
    getSupportAdmin: builder.query({
      query: () => "/chat/support-admin",
    }),
  }),
});

export const { 
  useGetConversationsQuery, 
  useGetMessagesQuery, 
  useSendMessageMutation,
  useCreateConversationMutation,
  useMarkAsReadMutation,
  useGetSupportAdminQuery
} = ChatApi;
