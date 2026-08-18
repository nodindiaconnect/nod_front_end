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

    getDesignerProfile: builder.query({
      query: () => "/Designer/me/profile",
      providesTags: ["DesignerProfile"],
    }),

    updateDesignerProfile: builder.mutation({
      query: (body) => ({
        url: "/Designer/me/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["DesignerProfile", "DesignerUserDetails"],
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
  useGetDesignerProfileQuery,
  useUpdateDesignerProfileMutation,
  useGetContractorProjectsQuery,
  useSendContractorQuotationMutation,
  useWithdrawContractorQuotationMutation,
} = contractorApiSlice;
