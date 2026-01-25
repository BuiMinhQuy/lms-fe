import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateAvatar: builder.mutation({
            query: (avatar) => ({
                url: `update-user-avatar`,
                method: "PUT",
                body: { avatar },
                credentials: "include" as const,
            }),
        }),
        editProfile: builder.mutation({
            query: ({ name }) => ({
                url: `update-user-info`,
                method: "PUT",
                body: { name },
                credentials: "include" as const,
            }),
        }),
        updatePassword: builder.mutation({
            query: ({ oldPassword, newPassword }) => ({
                url: `update-user-password`,
                method: "PUT",
                body: { oldPassword, newPassword },
                credentials: "include" as const,
            }),
        }),
        getAllUser: builder.query({
            query: () => ({
                url: `get-all-users`,
                method: "GET",
                credentials: "include" as const,
            }),
            providesTags: ["Users"],
        }),

        // Admin: delete user by id
        deleteUser: builder.mutation({
            query: ({ id }: { id: string }) => ({
                url: `delete-user/${id}`,
                method: "DELETE",
                credentials: "include" as const,
            }),
            invalidatesTags: ["Users"],
        }),

        // Admin: update user role
        updateUserRole: builder.mutation({
            query: ({ id, role }: { id: string; role: string }) => ({
                url: `update-user-role`,
                method: "PUT",
                body: { id, role },
                credentials: "include" as const,
            }),
            invalidatesTags: ["Users"],
        }),

        // Admin: update user info (name/email/role/isVerified)
        adminUpdateUser: builder.mutation({
            query: ({
                id,
                name,
                email,
                role,
                isVerified,
            }: {
                id: string;
                name?: string;
                email?: string;
                role?: string;
                isVerified?: boolean;
            }) => ({
                url: `admin/update-user/${id}`,
                method: "PUT",
                body: { name, email, role, isVerified },
                credentials: "include" as const,
            }),
            invalidatesTags: ["Users"],
        }),
    }),
});

export const {
    useUpdateAvatarMutation,
    useEditProfileMutation,
    useUpdatePasswordMutation,
    useGetAllUserQuery,
    useDeleteUserMutation,
    useUpdateUserRoleMutation,
    useAdminUpdateUserMutation,
} = userApi;
