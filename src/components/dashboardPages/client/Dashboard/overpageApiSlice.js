import { apiSlice } from "../../../../ApiSliceComponent/jaiMaxApi";

export const clientApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserDetails: builder.query({
            query: () => ({
                url: "/Client/userDetails",
                method: "GET",
            }),
            providesTags: ["UserDetails"],
        }),

        getDashboardStats: builder.query({
            query: () => ({
                url: "/Client/dashboardStats",
                method: "GET",
            }),
            providesTags: ["DashboardStats"],
        }),

        // Enum values (category, servicesRequired, propertyStatus, etc.)
        // Backend is the single source of truth — frontend renders
        // whatever this returns instead of hardcoding option lists.
        getProjectEnums: builder.query({
            query: () => ({
                url: "/Client/projectEnums",
                method: "GET",
            }),
        }),

        // Create a new project
        createProject: builder.mutation({
            query: (formData) => ({
                url: "/Client/createProject",
                method: "POST",
                body: formData, // FormData object for multipart/form-data (file uploads)
            }),
            invalidatesTags: ["ProjectsList", "DashboardStats"],
        }),

        // ===== UPDATED: Fetch all projects with pagination + filters =====
        listProjects: builder.query({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();

                // Pagination parameters
                if (params.page) queryParams.append("page", params.page);
                if (params.limit) queryParams.append("limit", params.limit);

                // Filter parameters
                if (params.category) queryParams.append("category", params.category);
                if (params.service) queryParams.append("service", params.service);
                if (params.status) queryParams.append("status", params.status);
                if (params.city) queryParams.append("city", params.city);

                const queryString = queryParams.toString();
                const url = `/Client/clientprojects${queryString ? `?${queryString}` : ""}`;

                return {
                    url,
                    method: "GET",
                };
            },
            providesTags: ["ProjectsList"],
        }),

        // Fetch a single project by ID
        getProjectById: builder.query({
            query: (projectId) => ({
                url: `/Client/projects/${projectId}`,
                method: "GET",
            }),
            providesTags: (result, error, projectId) => [
                { type: "Project", id: projectId },
            ],
        }),

        // Update project (if your backend supports it)
        updateProject: builder.mutation({
            query: ({ projectId, data }) => ({
                url: `/Client/projects/${projectId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: "Project", id: projectId },
                "ProjectsList",
            ],
        }),

        // Delete project (if your backend supports it)
        deleteProject: builder.mutation({
            query: (projectId) => ({
                url: `/Client/projects/${projectId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ProjectsList", "DashboardStats"],
        }),

        updateProjectAvailability: builder.mutation({
            query: ({ projectId, status }) => ({
                url: `/Client/projects/${projectId}/availability-status`,
                method: "POST",
                body: { status },
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: "Project", id: projectId },
                "ProjectsList",
            ],
        }),

    }),
});

export const {
    useGetUserDetailsQuery,
    useGetDashboardStatsQuery,
    useGetProjectEnumsQuery,
    useCreateProjectMutation,
    useListProjectsQuery,
    useGetProjectByIdQuery,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useUpdateProjectAvailabilityMutation
} = clientApiSlice;