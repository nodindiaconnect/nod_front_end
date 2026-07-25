

import { apiSlice } from "../../../../ApiSliceComponent/jaiMaxApi"

export const designerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDesignerUserDetails: builder.query({
      query: () => "/Designer/me/userDetails",
      providesTags: ["DesignerUserDetails"],
    }),
    getDesignerQuotations: builder.query({
      query: (status) => ({
        url: "/Designer/me/quotations",
        params: status ? { status } : undefined,
      }),
      providesTags: ["DesignerQuotations"],
    }),
    getDesignerProjects: builder.query({
      query: (status) => ({
        url: "/Designer/me/projects",
        params: status ? { status } : undefined,
      }),
      providesTags: ["DesignerProjects"],
    }),
    sendDesignerQuotation: builder.mutation({
      query: (body) => ({
        url: "/Designer/quotations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["DesignerUserDetails", "DesignerQuotations"],
    }),
    withdrawDesignerQuotation: builder.mutation({
      query: (bidId) => ({
        url: `/Designer/quotations/${bidId}/withdraw`,
        method: "PATCH",
      }),
      invalidatesTags: ["DesignerUserDetails", "DesignerQuotations"],
    }),
  }),
})

export const {
  useGetDesignerUserDetailsQuery,
  useGetDesignerQuotationsQuery,
  useGetDesignerProjectsQuery,
  useSendDesignerQuotationMutation,
  useWithdrawDesignerQuotationMutation,
} = designerApiSlice

