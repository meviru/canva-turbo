import { axiosBaseQuery } from "@/shared/lib/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const uploadService = createApi({
  reducerPath: "uploadService",
  baseQuery: axiosBaseQuery(
    `${process.env.NEXT_PUBLIC_API_BASE_URL as string}/images`
  ),
  tagTypes: ["Upload"],
  endpoints: (builder) => ({
    uploadFile: builder.mutation<any, any>({
      query: ({ formData }) => ({
        url: "/upload",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["Upload"],
    }),
    listFiles: builder.query<any, any>({
      query: ({ userId }) => ({
        url: `/${userId}/`,
        method: "GET",
      }),
      providesTags: ["Upload"],
    }),
  }),
});

export const { useUploadFileMutation, useListFilesQuery } = uploadService;
