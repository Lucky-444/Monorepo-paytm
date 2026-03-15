import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

const authSchema = z.object({
  phone: z.string().min(10).max(10),
  password: z.string().min(6),
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: {
          label: "Phone number",
          type: "text",
          placeholder: "1231231231",
          required: true,
        },
        password: { label: "Password", type: "password", required: true },
      },

      async authorize(credentials: any) {
        const parsedData = authSchema.safeParse(credentials);

        if (!parsedData.success) {
          return null;
        }

        const { phone, password, name, email } = parsedData.data;

        const existingUser = await db.user.findFirst({
          where: {
            number: phone,
          },
        });

        // USER EXISTS → LOGIN FLOW
        if (existingUser) {
          const passwordValidation = await bcrypt.compare(
            password,
            existingUser.password,
          );

          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              name: existingUser.name,
              email: existingUser.email,
            };
          }

          return null;
        }

        // USER DOES NOT EXIST → SIGNUP FLOW
        try {
          const hashedPassword = await bcrypt.hash(password, 10);

          const user = await db.user.create({
            data: {
              number: phone,
              password: hashedPassword,
              name: name,
              email: email,
            },
          });

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (e) {
          console.error(e);
        }

        return null;
      },
    }),
  ],

  secret: process.env.JWT_SECRET || "secret",

  callbacks: {
    async session({ token, session }: any) {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
