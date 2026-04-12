import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        if (credentials.email !== process.env.ADMIN_EMAIL) return null;

        const hash = process.env.ADMIN_PASSWORD_HASH;
        if (!hash) return null;

        const valid = await bcryptjs.compare(credentials.password, hash);
        if (!valid) return null;

        return { id: "owner", email: credentials.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages:   { signIn: "/admin/login" },
  secret:  process.env.NEXTAUTH_SECRET,
};
