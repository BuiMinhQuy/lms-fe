import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut, userRegistration } from "./authSlice";

type RegistrationResponse = {
    succues: boolean;
    message: string;
    activationToken: string;
};
type RegistrationData = {};

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //endpoints here
        registration: builder.mutation<RegistrationResponse, RegistrationData>({
            query: (data) => ({
                url: "registration",
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    // console.log("Full API response:", result);
                    // console.log("API response data:", result.data);
                    dispatch(
                        userRegistration({
                            token: result?.data.activationToken,
                        })
                    );
                } catch (error: any) {
                    // console.log(error);
                }
            },
        }),
        activation: builder.mutation({
            query: ({ activation_token, activation_code }) => ({
                url: "activate-user",
                method: "POST",
                body: {
                    activation_token,
                    activation_code,
                },
                credentials: "include",
            }),
        }),
        login: builder.mutation({
            query: ({ email, password }) => ({
                url: "login-user",
                method: "POST",

                body: {
                    email,
                    password,
                },
                credentials: "include",
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    // console.log("Full API response:", result);
                    // console.log("API response data:", result.data);
                    dispatch(
                        userLoggedIn({
                            accessToken: result?.data.accessToken,
                            user: result?.data.user,
                        })
                    );
                } catch (error: any) {
                    // console.log(error);
                }
            },
        }),
        socialAuth: builder.mutation({
            query: ({ email, name, avatar, provider }) => ({
                url: "social-auth",
                method: "POST",
                body: {
                    email,
                    name,
                    avatar,
                    provider,
                },
                credentials: "include",
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    // console.log("Full API response:", result);
                    // console.log("API response data:", result.data);
                    dispatch(
                        userLoggedIn({
                            accessToken: result?.data.accessToken,
                            user: result?.data.user,
                        })
                    );
                } catch (error: any) {
                    // console.log(error);
                }
            },
        }),
        logOut: builder.query({
            query: () => ({
                url: "logout",
                method: "GET",
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    dispatch(userLoggedOut());
                } catch (error: any) {
                    // console.log(error);
                }
            },
        }),
    }),
});

export const {
    useRegistrationMutation,
    useActivationMutation,
    useLoginMutation,
    useSocialAuthMutation,
    useLogOutQuery,
} = authApi;
