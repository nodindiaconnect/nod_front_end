// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import Cookies from "js-cookie";
// const baseQuery = fetchBaseQuery({
//   baseUrl: import.meta.env.VITE_API_BASE_URL,
//   // credentials: "include",

//   prepareHeaders: (headers, { getState }) => {
//     headers.set("Access-Control-Allow-Origin", "*");
//     headers.set(
//       "Access-Control-Allow-Methods",
//       "GET, POST, PUT,PATCH, DELETE, OPTIONS"
//     );

//     const token = Cookies.get("token");
//     if (token) {
//       headers.set("authorization", `Bearer ${token}`);
//     }
//     return headers;
//   },
// });

// /**
//  * Custom base query to handle token refresh and retry logic.
//  */
// const baseQueryWithReAuth = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);

//   // If a 408 error occurs, try to refresh the token
//   if (result?.error?.data?.status_code === 408) {
//     const refreshResult = await baseQuery(
//       { url: "/Auth/refreshToken", method: "GET" },
//       api,
//       extraOptions
//     );


//     if (refreshResult?.data) {
//       // Store the new token
//       // localStorage.setItem("token", refreshResult.data?.data.token);
//       Cookies.set("token", refreshResult.data?.data.token, { expires: 7 });
//       // Retry the original query with the new token
//       result = await baseQuery(args, api, extraOptions);
//     } else {
//       // Token refresh failed
//       return refreshResult;
//     }
//   }

//   // If a 401 error occurs, logout or handle it (custom behavior)
//   if (result?.error?.data?.status_code === 401) {
//     window.location.href = "/login";
//     // localStorage.clear();
//     Object.keys(Cookies.get()).forEach(function(cookieName) {
//   Cookies.remove(cookieName);
// });
//   }

//   return result;
// };

// export const apiSlice = createApi({
//   reducerPath: "apiSlice",
//   baseQuery: baseQueryWithReAuth,
//   tagTypes: ["getComment", "updateDetails", "getTicket", "shareholder","WealthPlan","WITHDRAW_HISTORY", "WITHDRAW_LIST","withdrawal"],
//   refetchOnFocus: false, 
//   refetchOnReconnect: true,
//   endpoints: (builder) => ({}),
// });

// export const { usePrefetch } = apiSlice;








import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  // credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT,PATCH, DELETE, OPTIONS"
    );

    const token = Cookies.get("token");
    console.log("[apiSlice] outgoing request, token present:", !!token);
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Custom base query to handle token refresh and retry logic.
 */
const baseQueryWithReAuth = async (args, api, extraOptions) => {
  console.log("[apiSlice] request args:", args);

  let result = await baseQuery(args, api, extraOptions);

  console.log("[apiSlice] initial result status_code:", result?.error?.data?.status_code ?? "OK");

  // If a 408 error occurs, try to refresh the token
  if (result?.error?.data?.status_code === 408) {
    console.log("[apiSlice] token expired (408), attempting refresh...");

    const refreshResult = await baseQuery(
      { url: "/Auth/refreshToken", method: "GET" },
      api,
      extraOptions
    );

    console.log("[apiSlice] refresh result:", refreshResult);

    if (refreshResult?.data) {
      // Store the new token
      console.log("[apiSlice] refresh succeeded, new token:", refreshResult.data?.data?.token);
      // localStorage.setItem("token", refreshResult.data?.data.token);
      Cookies.set("token", refreshResult.data?.data.token, { expires: 7 });

      console.log("[apiSlice] retrying original request with new token");
      // Retry the original query with the new token
      result = await baseQuery(args, api, extraOptions);
      console.log("[apiSlice] retry result:", result);
    } else {
      // Token refresh failed
      console.log("[apiSlice] refresh failed, returning refresh error");
      return refreshResult;
    }
  }

  // If a 401 error occurs, logout or handle it (custom behavior)
  if (result?.error?.data?.status_code === 401) {
    console.log("[apiSlice] 401 unauthorized, logging out and clearing cookies");
    window.location.href = "/Signin";
    // localStorage.clear();
    Object.keys(Cookies.get()).forEach(function (cookieName) {
      console.log("[apiSlice] removing cookie:", cookieName);
      Cookies.remove(cookieName);
    });
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: baseQueryWithReAuth,
  tagTypes: [
    "getComment", "updateDetails", "getTicket", "shareholder", "WealthPlan", "WITHDRAW_HISTORY", "WITHDRAW_LIST", "withdrawal",
    "Bids", "ProjectBids", "MyBids", "Project", "ProjectsList", "ProjectTeam", "Chats", "Messages", "ProjectChats",
    "UserDetails", "DesignerUserDetails", "ArchitectUserDetails", "ContractorUserDetails", "DashboardStats",
    "Reviews", "MyReviews", "UserReviews", "ProjectReviews", "EligibleReviews", "BankDetails"
  ],
  refetchOnFocus: false,
  refetchOnReconnect: true,
  endpoints: (builder) => ({}),
});


export const { usePrefetch } = apiSlice;



