


// import { apiSlice } from "../ApiSliceComponent/jaiMaxApi"

// export const materialSupplierApiSlice = apiSlice.injectEndpoints({
//     endpoints: (builder) => ({
//         getPublicProducts: builder.query({
//             query: (body) => {
//                 console.log("BODY RECEIVED:", body);
//                 return {
//                     url: "/materialSupplier/public/products",
//                     method: "POST",
//                     body,
//                 };
//             },
//             providesTags: ["PublicProducts"],
//         }),

//         searchLocations: builder.query({
//             query: (query) => ({
//                 url: "/materialSupplier/public/geocode",
//                 method: "GET",
//                 params: { query },
//             }),
//         }),

//         submitContactLead: builder.mutation({
//             query: (body) => ({
//                 url: "/contact/contact-team",
//                 method: "POST",
//                 body,
//             }),
//             invalidatesTags: ["ContactLeads"],
//         }),

//         // ---------- Portfolio / Posts ----------
//         getAllPortfolios: builder.query({
//             query: (params = {}) => ({
//                 url: "/portfolio/all",
//                 method: "GET",
//                 params,
//             }),
//             providesTags: ["Portfolios"],
//         }),

//         getUserPortfolio: builder.query({
//             query: (userId) => ({
//                 url: `/portfolio/${userId}`,
//                 method: "GET",
//             }),
//             providesTags: (result, error, userId) => [{ type: "Portfolio", id: userId }],
//         }),

//         getHomeFeed: builder.query({
//             query: (params = {}) => ({
//                 url: "/feed",
//                 method: "GET",
//                 params,
//             }),
//             providesTags: ["Feed"],
//         }),


//         // ---------- Follow / Unfollow ----------
//         followUser: builder.mutation({
//             query: (userId) => ({
//                 url: `/follow/${userId}`,
//                 method: "POST",
//             }),
//             invalidatesTags: (result, error, userId) => [{ type: "Portfolio", id: userId }, "Feed"],
//         }),

//         unfollowUser: builder.mutation({
//             query: (userId) => ({
//                 url: `/follow/${userId}`,
//                 method: "DELETE",
//             }),
//             invalidatesTags: (result, error, userId) => [{ type: "Portfolio", id: userId }, "Feed"],
//         }),

//         getFollowers: builder.query({
//             query: (userId) => ({
//                 url: `/follow/${userId}/followers`,
//                 method: "GET",
//             }),
//         }),

//         getFollowing: builder.query({
//             query: (userId) => ({
//                 url: `/follow/${userId}/following`,
//                 method: "GET",
//             }),
//         }),
//     }),
// })

// export const {
//     useGetPublicProductsQuery,
//     useLazySearchLocationsQuery,
//     useSubmitContactLeadMutation,
//     useGetAllPortfoliosQuery,
//     useGetUserPortfolioQuery,
//     useGetHomeFeedQuery,
//     useFollowUserMutation,
//     useUnfollowUserMutation,
//     useGetFollowersQuery,
//     useGetFollowingQuery,
// } = materialSupplierApiSlice


import { apiSlice } from "../ApiSliceComponent/jaiMaxApi"

export const materialSupplierApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPublicProducts: builder.query({
            query: (body) => {
                console.log("BODY RECEIVED:", body);
                return {
                    url: "/materialSupplier/public/products",
                    method: "POST",
                    body,
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

        submitPopupLead: builder.mutation({
            query: (body) => ({
                url: "/contact/leads/popup",
                method: "POST",
                body,
            }),
            invalidatesTags: ["ContactLeads"],
        }),

        submitContactSectionLead: builder.mutation({
            query: (body) => ({
                url: "/contact/leads/contact",
                method: "POST",
                body,
            }),
            invalidatesTags: ["ContactLeads"],
        }),

        // ---------- Portfolio / Posts ----------
        getAllPortfolios: builder.query({
            query: (params = {}) => ({
                url: "/portfolio/all",
                method: "GET",
                params,
            }),
            providesTags: ["Portfolios"],
        }),

        getUserPortfolio: builder.query({
            query: (userId) => ({
                url: `/portfolio/${userId}`,
                method: "GET",
            }),
            providesTags: (result, error, userId) => [{ type: "Portfolio", id: userId }],
        }),

        getHomeFeed: builder.query({
            query: (params = {}) => ({
                url: "/feed",
                method: "GET",
                params,
            }),
            providesTags: ["Feed"],
        }),


        // ---------- Follow / Unfollow ----------
        followUser: builder.mutation({
            query: (userId) => ({
                url: `/follow/${userId}`,
                method: "POST",
            }),
            invalidatesTags: (result, error, userId) => [{ type: "Portfolio", id: userId }, "Feed"],
        }),

        unfollowUser: builder.mutation({
            query: (userId) => ({
                url: `/follow/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, userId) => [{ type: "Portfolio", id: userId }, "Feed"],
        }),

        getFollowers: builder.query({
            query: (userId) => ({
                url: `/follow/${userId}/followers`,
                method: "GET",
            }),
        }),


        getAllPortfoliosByRole: builder.query({
            query: ({ role, page = 1, limit = 20 } = {}) => ({
                url: "/portfolio/all/by-role",
                method: "GET",
                params: { role, page, limit },
            }),
            providesTags: ["Portfolios"],
        }),

        getFollowing: builder.query({
            query: (userId) => ({
                url: `/follow/${userId}/following`,
                method: "GET",
            }),
        }),
    }),
})

export const {
    useGetPublicProductsQuery,
    useLazySearchLocationsQuery,
    useSubmitPopupLeadMutation,
    useSubmitContactSectionLeadMutation,
    useGetAllPortfoliosQuery,
    useGetUserPortfolioQuery,
    useGetHomeFeedQuery,
    useFollowUserMutation,
    useUnfollowUserMutation,
    useGetFollowersQuery,
    useGetFollowingQuery,
    useGetAllPortfoliosByRoleQuery
} = materialSupplierApiSlice

