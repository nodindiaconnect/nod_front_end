
import { apiSlice } from "../../../../ApiSliceComponent/jaiMaxApi"

export const contractorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getContractorUserDetails: builder.query({
      query: () => "/contractor/userDetails",
      providesTags: ["ContractorUserDetails"],
    }),

    getContractorQuotations: builder.query({
      query: (status) => ({
        url: "/contractor/me/quotations",
        params: status ? { status } : undefined,
      }),
      providesTags: ["ContractorQuotations"],
    }),

    getContractorProjects: builder.query({
      query: (status) => ({
        url: "/contractor/me/projects",
        params: status ? { status } : undefined,
      }),
      providesTags: ["ContractorProjects"],
    }),

    sendContractorQuotation: builder.mutation({
      query: (body) => ({
        url: "/contractor/quotations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ContractorUserDetails", "ContractorQuotations"],
    }),

    withdrawContractorQuotation: builder.mutation({
      query: (bidId) => ({
        url: `/contractor/quotations/${bidId}/withdraw`,
        method: "PATCH",
      }),
      invalidatesTags: ["ContractorUserDetails", "ContractorQuotations"],
    }),
  }),
})

export const {
  useGetContractorUserDetailsQuery,
  useGetContractorQuotationsQuery,
  useGetContractorProjectsQuery,
  useSendContractorQuotationMutation,
  useWithdrawContractorQuotationMutation,
} = contractorApiSlice


