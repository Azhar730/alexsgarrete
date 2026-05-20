import { baseApi } from "./baseApi";

export const storageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: "/upload/documents",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: { data: { urls: string[] } }) => {
        return { url: response.data.urls[0] };
      },
      invalidatesTags: ["Storage"],
    }),
    getDownloadUrl: builder.query<{ url: string }, string>({
      query: (key) => ({
        url: "/upload/download",
        method: "GET",
        params: { key },
      }),
    }),
  }),
});

export const { useUploadFileMutation, useGetDownloadUrlQuery } = storageApi;
