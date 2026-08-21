import { apiSlice } from "./jaiMaxApi";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all conversations for current user
    getMyChats: builder.query({
      query: () => ({
        url: "/chat/me",
        method: "GET",
      }),
      providesTags: ["Chats"],
    }),

    // Start or retrieve a chat (Direct or Project Team)
    startChat: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/chat/projects/${projectId}/chats`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chats", "ProjectChats"],
    }),

    // Get all chats for a specific project
    getProjectChats: builder.query({
      query: (projectId) => ({
        url: `/chat/projects/${projectId}/chats`,
        method: "GET",
      }),
      providesTags: (result, error, projectId) => [
        { type: "ProjectChats", id: projectId },
        "ProjectChats",
      ],
    }),

    // Get paginated messages for a chat
    getMessages: builder.query({
      query: ({ chatId, page = 1, limit = 50, before }) => {
        const queryParams = new URLSearchParams();
        if (page) queryParams.append("page", page);
        if (limit) queryParams.append("limit", limit);
        if (before) queryParams.append("before", before);

        const queryString = queryParams.toString();
        return {
          url: `/chat/chats/${chatId}/messages${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result, error, { chatId }) => [
        { type: "Messages", id: chatId },
        "Messages",
      ],
    }),

    // Send a message via REST
    sendMessage: builder.mutation({
      query: ({ chatId, text, attachments = [] }) => ({
        url: `/chat/chats/${chatId}/messages`,
        method: "POST",
        body: { text, attachments },
      }),
      invalidatesTags: (result, error, { chatId }) => [
        { type: "Messages", id: chatId },
        "Chats",
      ],
    }),

    // Mark messages as read in a chat
    markAsRead: builder.mutation({
      query: ({ chatId, messageId }) => ({
        url: `/chat/chats/${chatId}/read`,
        method: "PATCH",
        body: { messageId },
      }),
      invalidatesTags: (result, error, { chatId }) => [
        { type: "Messages", id: chatId },
        "Chats",
      ],
    }),
  }),
});

export const {
  useGetMyChatsQuery,
  useStartChatMutation,
  useGetProjectChatsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
} = chatApiSlice;
