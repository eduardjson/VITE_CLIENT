import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CustomerCategory,
  PriceList,
  Price,
  PriceHistory,
  CreatePriceDto,
  UpdatePriceDto,
} from "../types/price";

export const priceApi = createApi({
  reducerPath: "priceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: headers => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) headers.set("authorization", `${accessToken}`);
      return headers;
    },
  }),
  tagTypes: ["Category", "PriceList", "Price", "History"],
  endpoints: builder => ({
    // Categories
    getCategories: builder.query<CustomerCategory[], void>({
      query: () => "/prices/categories",
      providesTags: ["Category"],
    }),
    getCategory: builder.query<CustomerCategory, string>({
      query: id => `/prices/categories/${id}`,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),
    createCategory: builder.mutation<
      CustomerCategory,
      Partial<CustomerCategory>
    >({
      query: body => ({
        url: "/prices/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation<
      CustomerCategory,
      { id: string; body: Partial<CustomerCategory> }
    >({
      query: ({ id, body }) => ({
        url: `/prices/categories/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id },
        "Category",
      ],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: id => ({
        url: `/prices/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    // PriceLists
    getPriceLists: builder.query<PriceList[], boolean | void>({
      query: activeOnly => {
        const params = activeOnly ? "?active=true" : "";
        return `/prices/lists${params}`;
      },
      providesTags: ["PriceList"],
    }),
    getPriceList: builder.query<PriceList, string>({
      query: id => `/prices/lists/${id}`,
      providesTags: (result, error, id) => [{ type: "PriceList", id }],
    }),
    createPriceList: builder.mutation<PriceList, Partial<PriceList>>({
      query: body => ({
        url: "/prices/lists",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PriceList"],
    }),
    updatePriceList: builder.mutation<
      PriceList,
      { id: string; body: Partial<PriceList> }
    >({
      query: ({ id, body }) => ({
        url: `/prices/lists/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PriceList", id },
        "PriceList",
      ],
    }),
    deletePriceList: builder.mutation<void, string>({
      query: id => ({
        url: `/prices/lists/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PriceList"],
    }),

    // Prices
    getPrices: builder.query<
      Price[],
      { productId?: string; categoryId?: string; priceListId?: string } | void
    >({
      query: params => {
        const queryParams = new URLSearchParams(params as any).toString();
        return `/prices${queryParams ? `?${queryParams}` : ""}`;
      },
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Price" as const, id })),
              "Price",
            ]
          : ["Price"],
    }),
    getPrice: builder.query<Price, string>({
      query: id => `/prices/${id}`,
      providesTags: (result, error, id) => [{ type: "Price", id }],
    }),
    createPrice: builder.mutation<Price, CreatePriceDto>({
      query: body => ({
        url: "/prices",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Price"],
    }),
    updatePrice: builder.mutation<Price, { id: string; body: UpdatePriceDto }>({
      query: ({ id, body }) => ({
        url: `/prices/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Price", id },
        "Price",
      ],
    }),
    deletePrice: builder.mutation<void, string>({
      query: id => ({
        url: `/prices/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Price"],
    }),

    // History
    getPriceHistory: builder.query<PriceHistory[], string>({
      query: priceId => `/prices/history/price/${priceId}`,
      providesTags: (result, error, priceId) => [
        { type: "History", id: priceId },
      ],
    }),
    getPriceHistoryByProduct: builder.query<PriceHistory[], string>({
      query: productId => `/prices/history/product/${productId}`,
      providesTags: (result, error, productId) => [
        { type: "History", id: productId },
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetPriceListsQuery,
  useGetPriceListQuery,
  useCreatePriceListMutation,
  useUpdatePriceListMutation,
  useDeletePriceListMutation,
  useGetPricesQuery,
  useGetPriceQuery,
  useCreatePriceMutation,
  useUpdatePriceMutation,
  useDeletePriceMutation,
  useGetPriceHistoryQuery,
  useGetPriceHistoryByProductQuery,
} = priceApi;
