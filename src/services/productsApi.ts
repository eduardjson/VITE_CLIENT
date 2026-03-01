import { CreateProductDTO, ProductDTO, UpdateProductDTO } from "../dto";
import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBaseQuery } from "./config";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: customFetchBaseQuery,
  tagTypes: ["Product"],
  endpoints: builder => ({
    getAllProducts: builder.query<ProductDTO[], void>({
      query: () => "/products",
      providesTags: ["Product"],
    }),
    getProductById: builder.query<ProductDTO, string>({
      query: id => `/products/${id}`,
      providesTags: result =>
        result ? [{ type: "Product", id: result.id }] : [],
    }),
    createProduct: builder.mutation<
      ProductDTO,
      { data: CreateProductDTO | UpdateProductDTO; id: string }
    >({
      query: ({ data }) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<
      UpdateProductDTO,
      { data: CreateProductDTO | UpdateProductDTO; id: string }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "Product", id }],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: id => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: () => ["Product"],
    }),
    addImages: builder.mutation<
      ImageUploadResponse,
      { id: string; images: File[] }
    >({
      queryFn: async ({ id, images }) => {
        // формируем FormData
        const formData = new FormData();
        images.forEach(f => formData.append("images", f));

        const url = `http://localhost:5000/api/products/${id}/images`;

        // используем fetch напрямую, чтобы отправить multipart/form-data
        const res = await fetch(url, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorText = await res.text();
          return { error: { status: res.status, data: errorText } as any };
        }

        const data = (await res.json()) as ImageUploadResponse;
        return { data };
      },
      transformResponse: (response: ImageUploadResponse) => response,
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddImagesMutation,
} = productsApi;
