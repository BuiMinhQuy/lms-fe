import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            // Lưu provider vào token khi người dùng đăng nhập
            if (account) {
                token.provider = account.provider; // "google" hoặc "github"
            }
            return token;
        },
        async session({ session, token }) {
            // Gán provider từ token vào session
            session.user.provider = token.provider || null;
            return session;
        },
    },
    secret: process.env.SECRET,
};
export default NextAuth(authOptions);
