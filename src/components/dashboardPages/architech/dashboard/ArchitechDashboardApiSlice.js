

import { apiSlice } from "../../../../ApiSliceComponent/jaiMaxApi"

export const architectApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Pulled from /Architech/userDetails (ArchitechController.getUserDetails),
        // not /architect/me/overview
        getDesignerUserDetails: builder.query({
            query: () => "/Architech/userDetails",
            providesTags: ["ArchitectOverview"],
        }),
        getDesignerQuotations: builder.query({
            query: (status) => ({
                url: "/Architech/me/quotations",
                params: status ? { status } : undefined,
            }),
            providesTags: ["ArchitectQuotations"],
        }),

        getArchitechProjects: builder.query({
            query: (status) => ({
                url: "/Architech/me/projects",
                params: status ? { status } : undefined,
            }),
            providesTags: ["DesignerProjects"],
        }),
        sendArchitectQuotation: builder.mutation({
            query: (body) => ({
                url: "/Architech/quotations",
                method: "POST",
                body,
            }),
            invalidatesTags: ["ArchitectOverview", "ArchitectQuotations"],
        }),
        withdrawArchitectQuotation: builder.mutation({
            query: (bidId) => ({
                url: `/Architech/quotations/${bidId}/withdraw`,
                method: "PATCH",
            }),
            invalidatesTags: ["ArchitectOverview", "ArchitectQuotations"],
        }),
    }),
})

export const {
    useGetDesignerUserDetailsQuery,
    useGetDesignerQuotationsQuery,
    useGetArchitechProjectsQuery,
    useSendArchitectQuotationMutation,
    useWithdrawArchitectQuotationMutation,
} = architectApiSlice

