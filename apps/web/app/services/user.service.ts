import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/lib/baseQuery";

export const userService = createApi({
  reducerPath: "userService",
  baseQuery: axiosBaseQuery(
    `${process.env.NEXT_PUBLIC_API_BASE_URL as string}/user`
  ),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    saveUser: builder.mutation<any, any>({
      query: (userData) => ({
        url: "/save",
        method: "POST",
        data: userData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useSaveUserMutation } = userService;
