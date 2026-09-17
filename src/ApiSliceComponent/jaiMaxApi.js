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
    let token = Cookies.get("token");
    if (!token) {
      try {
        const u = JSON.parse(localStorage.getItem("userData") || "null");
        token = u?.token || localStorage.getItem("token");
      } catch {}
    }
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
  let result = await baseQuery(args, api, extraOptions);

  // If a 408 error occurs, try to refresh the token
  if (result?.error?.data?.status_code === 408 || result?.error?.status === 408) {
    console.log("[apiSlice] token expired (408), attempting refresh...");

    const refreshResult = await baseQuery(
      { url: "/Auth/refreshToken", method: "GET" },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      const newToken = refreshResult.data?.data?.token;
      if (newToken) {
        Cookies.set("token", newToken, { expires: 7 });
        localStorage.setItem("token", newToken);
        try {
          const u = JSON.parse(localStorage.getItem("userData") || "null");
          if (u) {
            u.token = newToken;
            localStorage.setItem("userData", JSON.stringify(u));
          }
        } catch {}
      }

      // Retry the original query with the new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      return refreshResult;
    }
  }

  // If a 401 error occurs, logout and clear session properly
  const is401 = result?.error?.data?.status_code === 401 || result?.error?.status === 401;
  if (is401) {
    console.log("[apiSlice] 401 unauthorized, logging out and clearing session");
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    Object.keys(Cookies.get()).forEach(function (cookieName) {
      Cookies.remove(cookieName);
    });
    if (!window.location.pathname.startsWith("/Signin") && !window.location.pathname.startsWith("/Signup")) {
      window.location.href = "/Signin";
    }
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



