import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compareHash, getUserByEmail } from "../lib/users";

export default {
  providers: [
    Credentials({
      name: "NeuroSync",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const User = await getUserByEmail(credentials.email as string);
          if (!User || !User.password) return null;

          const isValidUserCredentials = await compareHash(
            User.password,
            credentials.password as string
          );

          return isValidUserCredentials ? User : null;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
} satisfies NextAuthConfig;
