import { BaseQueryFn, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:5000/api/";

const baseQueryConfig = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: headers => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `${token}`);
    }
    return headers;
  },
});

export const customFetchBaseQuery: BaseQueryFn = async (...args) => {
  const result = await baseQueryConfig(...args);

  if (result.error && result.error.status === 401) {
    console.error("Авторизация не пройдена:", result.error);
  }

  return result;
};
