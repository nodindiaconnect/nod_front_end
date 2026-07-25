

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

        // Create a new project
        createProject: builder.mutation({
            query: (formData) => ({
                url: "/Client/createProject",
                method: "POST",
                body: formData, // FormData object for multipart/form-data (file uploads)
            }),
            invalidatesTags: ["ProjectsList", "DashboardStats"],
        }),

        // Fetch all projects with optional filters
        listProjects: builder.query({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                if (params.category) queryParams.append("category", params.category);
                if (params.service) queryParams.append("service", params.service);
                if (params.status) queryParams.append("status", params.status);
                if (params.city) queryParams.append("city", params.city);

                const queryString = queryParams.toString();
                const url = `/Client/projects${queryString ? `?${queryString}` : ""}`;

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
    }),
});

export const {
    useGetUserDetailsQuery,
    useGetDashboardStatsQuery,
    useCreateProjectMutation,
    useListProjectsQuery,
    useGetProjectByIdQuery,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
} = clientApiSlice;

