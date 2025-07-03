import { axiosBaseQuery } from "@/shared/lib/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const photosService = createApi({
  reducerPath: "photosService",
  baseQuery: axiosBaseQuery(
    `${process.env.NEXT_PUBLIC_API_BASE_URL as string}/photos`
  ),
  tagTypes: ["Photos"],
  endpoints: (builder) => ({
    getPhotos: builder.query<any, any>({
      query: ({ q, page, perPage = 30 }) => ({
        url: "/list",
        method: "GET",
        params: { q, page, perPage },
      }),
      providesTags: ["Photos"],
    }),
  }),
});

export const { useGetPhotosQuery } = photosService;
