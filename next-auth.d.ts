// types/next-auth.d.ts (or src/types/next-auth.d.ts)
import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            provider?: string | null; // Extend the user object to include the provider field
            email?: string | null;
            name?: string | null;
            image?: string | null;
        };
    }
}
