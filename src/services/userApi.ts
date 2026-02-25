import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBaseQuery } from "./config";
import { RegisterFormData } from "../components";

export const userApi = createApi({
  reducerPath: "user",
  baseQuery: customFetchBaseQuery,
  tagTypes: ["Auth"],
  endpoints: builder => ({
    getCurrentUser: builder.query<RegisterFormData, void>({
      query() {
        return {
          url: "/user/me",
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetCurrentUserQuery } = userApi;
