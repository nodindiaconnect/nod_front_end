import { apiSlice } from "../ApiSliceComponent/jaiMaxApi";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ── REGISTER (Multi-Step Flow) ──
        registerStart: builder.mutation({
            query: (credentials) => ({
                url: "/Auth/register/start",
                method: "POST",
                body: credentials
            }),
        }),
        registerVerifyOtp: builder.mutation({
            query: (data) => ({
                url: "/Auth/register/verify-otp",
                method: "POST",
                body: data
            })
        }),
        registerCreateAccount: builder.mutation({
            query: (data) => ({
                url: "/Auth/register/create-account",
                method: "POST",
                body: data
            })
        }),
        registerFinish: builder.mutation({
            query: (data) => ({
                url: "/Auth/register/finish",
                method: "POST",
                body: data
            })
        }),

        // ── LOGIN ──
        login: builder.mutation({
            query: (credentials) => ({
                url: "/Auth/login",
                method: "POST",
                body: credentials
            }),
        }),

        // ── FORGOT PASSWORD (Multi-Step Flow) ──
        forgotStart: builder.mutation({
            query: (credentials) => ({
                url: "/Auth/forgotPassword/start",
                method: "POST",
                body: credentials
            })
        }),
        forgotVerifyOtp: builder.mutation({
            query: (data) => ({
                url: "/Auth/forgotPassword/verify-otp",
                method: "POST",
                body: data
            })
        }),
        resetPassword: builder.mutation({
            query: (credentials) => ({
                url: "/Auth/resetPassword",
                method: "POST",
                body: credentials
            })
        }),

        // ── CHANGE PASSWORD (Logged-in user) ──
        changePwd: builder.mutation({
            query: (credentials) => ({
                url: "/Auth/changePassword",
                method: "POST",
                body: credentials
            })
        }),
        changePwdReq: builder.mutation({
            query: (credentials) => ({
                url: "/Auth/changePasswordReq",
                method: "POST",
                body: credentials
            })
        }),

        // ── RESEND OTP (Session-token based) ──
        resendOtp: builder.mutation({
            query: (data) => ({
                url: '/Auth/resendOtp',
                method: 'POST',
                body: data,
            })
        }),

        // ── VERIFY RECAPTCHA (standalone check-only endpoint) ──
        // FIX: backend's verifyCaptcha does `const { token } = req.body`,
        // so the body must be a { token } object, not the raw string.
        // Sending the bare token as the body meant req.body.token was
        // always undefined server-side.
        // NOTE: with TurnstileWidget wired directly into registerStart /
        // login / forgotStart, this standalone endpoint is no longer
        // needed for the main auth flows — keeping it here only in case
        // something else in the app still calls it directly.
        verifyRecaptcha: builder.mutation({
            query: (token) => ({
                url: '/Auth/reCAPTCHAVerify',
                method: 'POST',
                body: { token },
            })
        }),

        // ── CHECK USERNAME (Live availability check) ──
        checkUsername: builder.query({
            query: (username) => ({
                url: "/Auth/CheckUserName",
                method: "GET",
                params: { username },
            }),
        }),
        // ── CATEGORIES & SPECIALIZATIONS (Dynamic registration) ──
        getCategoriesAndSpecializations: builder.query({
            query: () => ({
                url: "/Auth/categories-specializations",
                method: "GET",
            }),
            providesTags: ["Categories"],
        }),
        getCategories: builder.query({
            query: () => ({
                url: "/Auth/categories",
                method: "GET",
            }),
            providesTags: ["Categories"],
        }),
    }),
});

export const {
    useRegisterStartMutation,
    useRegisterVerifyOtpMutation,
    useRegisterCreateAccountMutation,
    useRegisterFinishMutation,
    useLoginMutation,
    useForgotStartMutation,
    useForgotVerifyOtpMutation,
    useResetPasswordMutation,
    useChangePwdMutation,
    useChangePwdReqMutation,
    useResendOtpMutation,
    useVerifyRecaptchaMutation,
    useLazyCheckUsernameQuery,
    useGetCategoriesAndSpecializationsQuery,
    useGetCategoriesQuery,
} = authApiSlice;