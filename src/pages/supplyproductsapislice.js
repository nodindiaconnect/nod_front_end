


import { apiSlice } from "../ApiSliceComponent/jaiMaxApi"

export const materialSupplierApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // getPublicProducts: builder.query({
        //     query: (params = {}) => ({
        //         url: "/materialSupplier/public/products",
        //         method: "GET",
        //         params,
        //     }),
        //     providesTags: [{ type: "SupplierProducts", id: "PUBLIC_LIST" }],
        // }),

        getPublicProducts: builder.query({
            query: (body) => {
                console.log("BODY RECEIVED:", body);

                return {
                    url: "/materialSupplier/public/products",
                    method: "POST",
                    body, // { page, limit, lat?, lng?, radiusKm?, search?, category?, ... }
                };
            },
            providesTags: ["PublicProducts"],
        }),

        searchLocations: builder.query({
            query: (query) => ({
                url: "/materialSupplier/public/geocode",
                method: "GET",
                params: { query },
            }),
        }),

           submitContactLead: builder.mutation({
            query: (body) => ({
                url: "/contact/contact-team",
                method: "POST",
                body,
            }),
            invalidatesTags: ["ContactLeads"],
        }),

    }),
})

export const {
    useGetPublicProductsQuery,
    useLazySearchLocationsQuery,
    useSubmitContactLeadMutation
} = materialSupplierApiSlice