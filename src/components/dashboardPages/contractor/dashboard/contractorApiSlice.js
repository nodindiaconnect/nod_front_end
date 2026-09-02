import { apiSlice } from "../../../../ApiSliceComponent/jaiMaxApi";

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

    getContractorProfile: builder.query({
      query: () => "/Contractor/me/profile",
      providesTags: ["ContractorProfile"],
    }),

    updateContractorProfile: builder.mutation({
      query: (body) => ({
        url: "/Contractor/me/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ContractorProfile", "ContractorUserDetails"],
    }),

    // Aliases for compatibility
    getDesignerProfile: builder.query({
      query: () => "/Contractor/me/profile",
      providesTags: ["ContractorProfile"],
    }),

    updateDesignerProfile: builder.mutation({
      query: (body) => ({
        url: "/Contractor/me/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ContractorProfile", "ContractorUserDetails"],
    }),

    getContractorProjects: builder.query({
      query: ({ status, page = 1, limit = 10 } = {}) => ({
        url: "/contractor/me/projects",
        params: {
          ...(status && { status }),
          page,
          limit,
        },
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
});

export const {
  useGetContractorUserDetailsQuery,
  useGetContractorQuotationsQuery,
  useGetContractorProfileQuery,
  useUpdateContractorProfileMutation,
  useGetDesignerProfileQuery,
  useUpdateDesignerProfileMutation,
  useGetContractorProjectsQuery,
  useSendContractorQuotationMutation,
  useWithdrawContractorQuotationMutation,
} = contractorApiSlice;
