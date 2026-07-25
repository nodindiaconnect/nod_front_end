// import { apiSlice } from "../../../../ApiSliceComponent/jaiMaxApi"

// export const materialSupplierApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getSupplierUserDetails: builder.query({
//       query: () => ({
//         url: "/materialSupplier/me/userDetails",
//         method: "GET",
//       }),
//       providesTags: ["SupplierUserDetails"],
//     }),

//     createProduct: builder.mutation({
//       query: (payload) => ({
//         url: "/materialSupplier/create-products",
//         method: "POST",
//         body: payload,
//       }),
//       invalidatesTags: ["SupplierUserDetails"],
//     }),
//   }),
// })

// export const {
//   useGetSupplierUserDetailsQuery,
//   useCreateProductMutation,
// } = materialSupplierApiSlice

import { apiSlice } from "../../../../ApiSliceComponent/jaiMaxApi"

export const materialSupplierApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSupplierUserDetails: builder.query({
      query: () => ({
        url: "/materialSupplier/me/userDetails",
        method: "GET",
      }),
      providesTags: ["SupplierUserDetails"],
    }),

    createProduct: builder.mutation({
      query: (payload) => ({
        url: "/materialSupplier/create-products",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SupplierUserDetails", "SupplierProducts"],
    }),

    getSupplierProducts: builder.query({
      // params: { page, limit, search, status, availability }
      query: (params = {}) => ({
        url: "/materialSupplier/products",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data?.products
          ? [
              ...result.data.products.map((p) => ({ type: "SupplierProducts", id: p.id })),
              { type: "SupplierProducts", id: "LIST" },
            ]
          : [{ type: "SupplierProducts", id: "LIST" }],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/materialSupplier/products/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SupplierProducts", id },
        { type: "SupplierProducts", id: "LIST" },
        "SupplierUserDetails",
      ],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/materialSupplier/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "SupplierProducts", id: "LIST" }, "SupplierUserDetails"],
    }),


     getContactDetails: builder.query({
      query: () => ({
        url: "/materialSupplier/contact-details",
        method: "GET",
      }),
      providesTags: ["ContactDetails"],
    }),

    createContactDetails: builder.mutation({
      query: (payload) => ({
        url: "/materialSupplier/contact-details",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ContactDetails"],
    }),

    updateContactDetails: builder.mutation({
      query: (payload) => ({
        url: "/materialSupplier/contact-details",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["ContactDetails"],
    }),

    deleteContactDetails: builder.mutation({
      query: () => ({
        url: "/materialSupplier/contact-details",
        method: "DELETE",
      }),
      invalidatesTags: ["ContactDetails"],
    }),


    
  }),
})

export const {
  useGetSupplierUserDetailsQuery,
  useCreateProductMutation,
  useGetSupplierProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetContactDetailsQuery,
  useCreateContactDetailsMutation,
  useUpdateContactDetailsMutation,
  useDeleteContactDetailsMutation
} = materialSupplierApiSlice

