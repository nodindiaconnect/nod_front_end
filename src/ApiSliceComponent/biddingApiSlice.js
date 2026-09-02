import { apiSlice } from "./jaiMaxApi";

export const biddingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new bid on a project (by professional)
    createBid: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/bids/projects/${projectId}/bids`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ProjectBids", "MyBids", "Project", "DesignerProjects", "ArchitectProjects"],
    }),

    // Get all bids for a project (Client view, grouped by role)
    getProjectBids: builder.query({
      query: ({ projectId, status }) => ({
        url: `/bids/projects/${projectId}/bids`,
        method: "GET",
        params: status ? { status } : undefined,
      }),
      providesTags: (result, error, { projectId }) => [
        { type: "ProjectBids", id: projectId },
        "ProjectBids",
      ],
    }),

    // Get single bid by ID
    getBidById: builder.query({
      query: (bidId) => ({
        url: `/bids/bids/${bidId}`,
        method: "GET",
      }),
      providesTags: (result, error, bidId) => [{ type: "Bids", id: bidId }],
    }),

    // Get bids submitted by logged-in professional
    getMyBids: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page);
        if (params.limit) queryParams.append("limit", params.limit);
        if (params.status) queryParams.append("status", params.status);

        const queryString = queryParams.toString();
        return {
          url: `/bids/me${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["MyBids"],
    }),

    // Update existing bid
    updateBid: builder.mutation({
      query: ({ bidId, ...body }) => ({
        url: `/bids/bids/${bidId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { bidId }) => [
        { type: "Bids", id: bidId },
        "ProjectBids",
        "MyBids",
      ],
    }),

    // Withdraw bid
    withdrawBid: builder.mutation({
      query: (bidId) => ({
        url: `/bids/bids/${bidId}/withdraw`,
        method: "POST",
      }),
      invalidatesTags: (result, error, bidId) => [
        { type: "Bids", id: bidId },
        "ProjectBids",
        "MyBids",
        "Project",
      ],
    }),

    // Shortlist / Unshortlist bid (Client only)
    shortlistBid: builder.mutation({
      query: ({ bidId, isShortlisted = true }) => ({
        url: `/bids/bids/${bidId}/shortlist`,
        method: "PATCH",
        body: { isShortlisted },
      }),
      invalidatesTags: (result, error, { bidId }) => [
        { type: "Bids", id: bidId },
        "ProjectBids",
        "MyBids",
      ],
    }),

    // Award / Accept bid (Client only)
    acceptBid: builder.mutation({
      query: (bidId) => ({
        url: `/bids/bids/${bidId}/accept`,
        method: "POST",
      }),
      invalidatesTags: (result, error, bidId) => [
        { type: "Bids", id: bidId },
        "ProjectBids",
        "MyBids",
        "Project",
        "ProjectsList",
        "ProjectTeam",
      ],
    }),

    // Reject bid (Client only)
    rejectBid: builder.mutation({
      query: ({ bidId, reason }) => ({
        url: `/bids/bids/${bidId}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { bidId }) => [
        { type: "Bids", id: bidId },
        "ProjectBids",
        "MyBids",
      ],
    }),

    // Get Project Contracts and Milestones
    getProjectMilestones: builder.query({
      query: (projectId) => ({
        url: `/payments/projects/${projectId}/milestones`,
        method: "GET",
      }),
      providesTags: (result, error, projectId) => [
        { type: "Project", id: projectId },
        "ProjectTeam",
      ],
    }),

    // Create Razorpay payment order for a milestone
    createPaymentOrder: builder.mutation({
      query: ({ milestoneId, idempotencyKey }) => ({
        url: `/payments/milestones/${milestoneId}/create-order`,
        method: "POST",
        headers: idempotencyKey ? { "idempotency-key": idempotencyKey } : undefined,
      }),
      invalidatesTags: ["Project", "DashboardStats"],
    }),

    // Start working on milestone (Professional)
    startMilestone: builder.mutation({
      query: (milestoneId) => ({
        url: `/payments/milestones/${milestoneId}/start`,
        method: "POST",
      }),
      invalidatesTags: ["Project"],
    }),

    // Submit milestone for client review (Professional)
    submitMilestone: builder.mutation({
      query: ({ milestoneId, proofUrls, notes }) => ({
        url: `/payments/milestones/${milestoneId}/submit`,
        method: "POST",
        body: { proofUrls, notes },
      }),
      invalidatesTags: ["Project"],
    }),

    // Approve milestone deliverables (Client)
    approveMilestone: builder.mutation({
      query: (milestoneId) => ({
        url: `/payments/milestones/${milestoneId}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["Project", "DashboardStats"],
    }),

    // Dispute milestone (Client)
    disputeMilestone: builder.mutation({
      query: ({ milestoneId, reason }) => ({
        url: `/payments/milestones/${milestoneId}/dispute`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["Project"],
    }),

    // Get payment history (Client / Professional)
    getMyPayments: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page);
        if (params.limit) queryParams.append("limit", params.limit);
        const qs = queryParams.toString();
        return {
          url: `/payments/me${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["DashboardStats"],
    }),

    // Get dedicated Project Escrow Details (Role-Aware)
    getProjectEscrow: builder.query({
      query: (projectId) => ({
        url: `/payments/projects/${projectId}/escrow`,
        method: "GET",
      }),
      providesTags: (result, error, projectId) => [
        { type: "Project", id: projectId },
        "ProjectEscrow",
      ],
    }),

    // Create Initial 50% Deposit + 5% Platform Fee Order
    createInitialEscrowOrder: builder.mutation({
      query: ({ projectId, idempotencyKey }) => ({
        url: `/payments/projects/${projectId}/initial-escrow-order`,
        method: "POST",
        headers: idempotencyKey ? { "idempotency-key": idempotencyKey } : undefined,
      }),
      invalidatesTags: ["Project", "ProjectEscrow"],
    }),

    // Confirm Initial 50% Deposit + 5% Platform Fee Payment
    confirmInitialEscrowPayment: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/payments/projects/${projectId}/confirm-initial-escrow`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Project", "ProjectEscrow", "ProjectsList", "DashboardStats"],
    }),

    // Reject milestone deliverables (Client requests revision)
    rejectMilestone: builder.mutation({
      query: ({ milestoneId, reason }) => ({
        url: `/payments/milestones/${milestoneId}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["Project", "ProjectEscrow"],
    }),

    // Raise dispute on a milestone or project (Client or Specialist)
    raiseDispute: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/payments/projects/${projectId}/disputes`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Project", "ProjectEscrow", "Disputes"],
    }),

    // Admin: Financial Overview & KPIs
    getAdminFinancialOverview: builder.query({
      query: () => ({
        url: `/Admin/finance/overview`,
        method: "GET",
      }),
      providesTags: ["AdminFinance", "ProjectEscrow"],
    }),

    // Admin: All Project Escrows
    getAdminProjectEscrows: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page);
        if (params.limit) queryParams.append("limit", params.limit);
        if (params.status) queryParams.append("status", params.status);
        const qs = queryParams.toString();
        return {
          url: `/Admin/finance/escrows${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["AdminFinance", "ProjectEscrow"],
    }),

    // Admin: List all Disputes
    getAdminDisputes: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page);
        if (params.limit) queryParams.append("limit", params.limit);
        if (params.status) queryParams.append("status", params.status);
        const qs = queryParams.toString();
        return {
          url: `/Admin/finance/disputes${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Disputes"],
    }),

    // Admin: Get Dispute by ID
    getAdminDisputeById: builder.query({
      query: (disputeId) => ({
        url: `/Admin/finance/disputes/${disputeId}`,
        method: "GET",
      }),
      providesTags: (result, error, disputeId) => [{ type: "Disputes", id: disputeId }],
    }),

    // Admin: Resolve Dispute
    resolveDispute: builder.mutation({
      query: ({ disputeId, ...body }) => ({
        url: `/Admin/finance/disputes/${disputeId}/resolve`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Disputes", "ProjectEscrow", "Project", "DashboardStats", "AdminFinance"],
    }),

    // Admin: Platform Revenue 5% Ledger
    getPlatformRevenue: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page);
        if (params.limit) queryParams.append("limit", params.limit);
        const qs = queryParams.toString();
        return {
          url: `/Admin/finance/platform-revenue${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["AdminFinance"],
    }),

    // Personal Wallet Details (Private)
    getMyWallet: builder.query({
      query: () => ({
        url: `/wallet/me`,
        method: "GET",
      }),
      providesTags: ["Wallet", "DashboardStats"],
    }),

    // Request Wallet Withdrawal
    requestWithdrawal: builder.mutation({
      query: (body) => ({
        url: `/wallet/withdraw`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wallet", "DashboardStats"],
    }),

    // Admin: Update Withdrawal Status
    updateWithdrawalStatus: builder.mutation({
      query: ({ withdrawalId, ...body }) => ({
        url: `/Admin/finance/withdrawals/${withdrawalId}/status`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wallet", "AdminFinance"],
    }),
    // Dynamic Platform Fee (Public/Authenticated)
    getPlatformFeeConfig: builder.query({
      query: () => ({
        url: `/payments/platform-fee`,
        method: "GET",
      }),
      providesTags: ["PlatformFee"],
    }),

    // Admin: Update Dynamic Platform Fee
    updatePlatformFeeConfig: builder.mutation({
      query: (body) => ({
        url: `/admin/finance/platform-fee`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PlatformFee", "AdminFinance", "ProjectEscrow"],
    }),

    // Centralized Project Payment & Milestone Breakdown Summary
    getProjectPaymentSummary: builder.query({
      query: (projectId) => ({
        url: `/payments/projects/${projectId}/summary`,
        method: "GET",
      }),
      providesTags: (result, error, projectId) => [
        { type: "ProjectPaymentSummary", id: projectId },
        { type: "ProjectEscrow", id: projectId },
        "PlatformFee",
      ],
    }),

    // Unified Milestone Payment Execution (1: 50% Advance, 2: 25% Second, 3: 25% Final)
    payProjectMilestone: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `/payments/projects/${projectId}/pay-milestone`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "ProjectPaymentSummary", id: projectId },
        { type: "ProjectEscrow", id: projectId },
        { type: "Project", id: projectId },
        "ProjectInvoices",
        "Wallet",
        "DashboardStats",
      ],
    }),

    // Get All Invoices for a Project
    getProjectInvoices: builder.query({
      query: (projectId) => ({
        url: `/payments/projects/${projectId}/invoices`,
        method: "GET",
      }),
      providesTags: (result, error, projectId) => [
        { type: "ProjectInvoices", id: projectId },
        "ProjectInvoices",
      ],
    }),

    // Get Single Invoice by ID
    getInvoiceById: builder.query({
      query: (invoiceId) => ({
        url: `/payments/invoices/${invoiceId}`,
        method: "GET",
      }),
      providesTags: (result, error, invoiceId) => [
        { type: "Invoice", id: invoiceId },
      ],
    }),
  }),
});

export const {
  useCreateBidMutation,
  useGetProjectBidsQuery,
  useGetBidByIdQuery,
  useGetMyBidsQuery,
  useUpdateBidMutation,
  useWithdrawBidMutation,
  useShortlistBidMutation,
  useAcceptBidMutation,
  useRejectBidMutation,
  useGetProjectMilestonesQuery,
  useGetProjectEscrowQuery,
  useCreateInitialEscrowOrderMutation,
  useConfirmInitialEscrowPaymentMutation,
  useCreatePaymentOrderMutation,
  useStartMilestoneMutation,
  useSubmitMilestoneMutation,
  useApproveMilestoneMutation,
  useRejectMilestoneMutation,
  useDisputeMilestoneMutation,
  useRaiseDisputeMutation,
  useGetMyPaymentsQuery,
  useGetAdminFinancialOverviewQuery,
  useGetAdminProjectEscrowsQuery,
  useGetAdminDisputesQuery,
  useGetAdminDisputeByIdQuery,
  useResolveDisputeMutation,
  useGetPlatformRevenueQuery,
  useGetMyWalletQuery,
  useRequestWithdrawalMutation,
  useUpdateWithdrawalStatusMutation,
  useGetPlatformFeeConfigQuery,
  useUpdatePlatformFeeConfigMutation,
  useGetProjectPaymentSummaryQuery,
  usePayProjectMilestoneMutation,
  useGetProjectInvoicesQuery,
  useGetInvoiceByIdQuery,
} = biddingApiSlice;


