import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { customFetchBaseQuery } from "./config";

export const filesApi = createApi({
  reducerPath: "filesApi",
  baseQuery: customFetchBaseQuery,
  endpoints: builder => ({
    downloadFile: builder.query<Blob, { id: string; fileName: string }>({
      query: ({ id }) => ({
        url: `/attachments/${id}`,
        responseHandler: response => response.blob(),
      }),
    }),
  }),
});

export const { useLazyDownloadFileQuery } = filesApi;
