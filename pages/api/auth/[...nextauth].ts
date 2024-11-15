import NextAuth, { NextAuthOptions, SessionStrategy } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import { compareSync } from "bcryptjs";

// Correct typing for `authOptions`
export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const user = await User.findOne({ email: credentials.email });

        if (user && compareSync(credentials.password, user.password)) {
          return { id: user._id, email: user.email };
        } else {
          return null;
        }
      }
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,  // Explicitly type the session strategy
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
      } else {
        session.user = {
          email: token.email as string,
        };
      }
      return session;
    },
  }
};

export default NextAuth(authOptions); // Default export for the NextAuth configuration
