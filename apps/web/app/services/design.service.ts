import { axiosBaseQuery } from "@/shared/lib/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const designService = createApi({
  reducerPath: "designService",
  baseQuery: axiosBaseQuery(
    `${process.env.NEXT_PUBLIC_API_BASE_URL as string}/design`
  ),
  tagTypes: ["Design"],
  endpoints: (builder) => ({
    createDesign: builder.mutation<any, any>({
      query: (designData) => ({
        url: "/create",
        method: "POST",
        data: designData,
      }),
      invalidatesTags: ["Design"],
    }),
    getDesignById: builder.query<any, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: ["Design"],
    }),
  }),
});

export const { useCreateDesignMutation, useGetDesignByIdQuery } = designService;
