import { apiSlice } from "./jaiMaxApi";

export const bankApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBankDetails: builder.query({
      query: () => ({
        url: "/bank-details",
        method: "GET",
      }),
      providesTags: ["BankDetails"],
    }),
    saveBankDetails: builder.mutation({
      query: (body) => ({
        url: "/bank-details",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BankDetails"],
    }),
  }),
});

export const {
  useGetBankDetailsQuery,
  useSaveBankDetailsMutation,
} = bankApiSlice;
