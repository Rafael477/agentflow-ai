import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        return {
          id: "user-rafael",
          name: "Rafael",
          email: credentials.email,
          image: ""
        };
      }
    })
  ],
  pages: {
    signIn: "/login"
  }
};
