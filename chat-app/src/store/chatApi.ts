import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface Message {
  id: string;
  roomId: string;
  username: string;
  text: string;
  timestamp: number;
}

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  }),
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/users",
    }),
    getRoomMessages: builder.query<Message[], string>({
      query: (roomId) => `/rooms/${roomId}/messages`,
    }),
  }),
});

export const { useGetUsersQuery, useGetRoomMessagesQuery } = chatApi;