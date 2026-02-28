import { BaseQueryFn, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:5000/api/";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: headers => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `${token}`);
    }
    return headers;
  },
});

export const customFetchBaseQuery: BaseQueryFn<any, unknown, any> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await baseQuery(args, api, extraOptions);

  // если есть 401 и есть refreshToken, пробуем обновить
  if ((result as any).error?.status === 401) {
    alert("ПОПЫТКА ОБНОВЛЕНИЯ ТОКЕНА!!!");
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        // запрос на обновление токена
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions,
        );

        if ((refreshResult as any).data) {
          const newAccessToken = (refreshResult as any).data.accessToken;
          // сохранить новый accessToken
          if (newAccessToken) {
            localStorage.setItem("accessToken", newAccessToken);
            // повторить исходный запрос
            result = await baseQuery(args, api, extraOptions);
          } else {
            // если обновление вернуло без токена, выйти в логин
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          }
        } else {
          // 실패 обновления
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      } catch {
        // сетевой или другой сбой
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    } else {
      // нет refreshToken — выход из системы
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  // иногда полезно логгировать ошибки 401
  if ((result as any).error?.status === 401) {
    console.error("Авторизация не пройдена");
  }

  return result;
};
