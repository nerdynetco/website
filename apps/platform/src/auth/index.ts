import { betterAuth, BetterAuthOptions, User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin, haveIBeenPwned, username } from "better-auth/plugins";

import { db } from "~/db/connect";
import { accounts, sessions, users, verifications } from "~/db/schema";
import { appConfig } from "~/project.config";
import { mailFetch } from "../lib/fetch-server";

const VERIFY_EMAIL_PATH_PREFIX = "/auth/verify-mail";
const RESET_PASSWORD_PATH_PREFIX = "/auth/reset-password";

const baseUrl = new URL(process.env.BETTER_AUTH_URL || "http://localhost:3000");


export const betterAuthOptions = {
  appName: appConfig.name,
  baseURL: baseUrl.toString(),
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      users,
      sessions,
      accounts,
      verifications,
    },
    //if all of them are just using plural form, you can just pass the option below
    usePlural: true,
  }),

  onAPIError: {
    throw: true,
    onError: (error, ctx) => {
      console.log("Auth error:", error);
      console.log("Auth error , context:", ctx);
    },
    // errorURL: "/auth/error",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      // const verification_url = `${baseUrl}${RESET_PASSWORD_PATH_PREFIX}${token}`;
      const reset_link = new URL(process.env.BETTER_AUTH_URL as string);
      reset_link.pathname = RESET_PASSWORD_PATH_PREFIX;
      reset_link.searchParams.set("token", token);

      try {
        const response = await mailFetch<{
          data: string[] | null;
          error?: string | null | object;
        }>("/api/send", {
          method: "POST",
          body: JSON.stringify({
            template_key: "reset-password",
            targets: [user.email],
            subject: "Reset Password",
            payload: {
              name: user.name,
              email: user.email,
              reset_link: reset_link.toString(),
            },
          }),
        });
        if (response.error) {
          throw new APIError("INTERNAL_SERVER_ERROR", {
            message: "Error sending email from mail server",
          });
        }
        console.log(response.data);
      } catch (err) {
        console.error(err);
        throw new APIError("INTERNAL_SERVER_ERROR", {
          message: "Error sending email",
        });
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const verification_url = new URL(process.env.BETTER_AUTH_URL as string);
      verification_url.pathname = VERIFY_EMAIL_PATH_PREFIX;
      verification_url.searchParams.set("token", token);
      try {
        const response = await mailFetch<{
          data: string[] | null;
          error?: string | null | object;
        }>("/api/send", {
          method: "POST",
          body: JSON.stringify({
            template_key: "welcome_verify",
            targets: [user.email],
            subject: `Welcome to ${appConfig.name}`,
            payload: {
              platform_name: appConfig.name,
              name: user.name,
              email: user.email,
              verification_url: verification_url.toString(),
            },
          }),
        });
        if (response.error) {
          throw new APIError("INTERNAL_SERVER_ERROR", {
            message: "Error sending email",
          });
        }
        console.log(response);
      } catch (err) {
        console.error(err);
        throw new APIError("INTERNAL_SERVER_ERROR", {
          message: "Error sending email",
        });
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      mapProfileToUser: async (profile) => {
        const userData = {
          email: profile.email,
          name: profile.name,
          username: profile.email.split("@")[0] + "_google",
          image: profile.picture,
          role: "user",
          displayUsername: profile.email.split("@")[0] + "_google",
          house:null,
          gender:"not_specified",
          emailVerified: true,
          hasCompletedSorting: false,
          
        };
        return {
          ...userData
        };
      },
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://*.vercel.app",
    "*.vercel.app",
    "https://v0-2-ecosystem.vercel.app",
    process.env.BETTER_AUTH_URL

  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        input: false,
        defaultValue: "user",
      },
      gender: {
        type: "string",
        input: false,
        defaultValue: "not_specified",
      },
      username: {
        type: "string",
        required: true,
        unique: true,
        input: false,
      },
      house:{
        type: "string",
        input: false,
        defaultValue: null,
      },
      hasCompletedSorting:{
        type: "boolean",
        input: false,
        defaultValue: false,
      }
    },
  },
  session: {
    expiresIn: 604800, // 7 days
  },
  account: {
    encryptOAuthTokens: true, // Encrypt OAuth tokens before storing them in the database

    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github", "email-password"],
      allowDifferentEmails: false,
    },
  },

  plugins: [
    username(),
    admin({
      defaultRole: "user",
      adminRole: ["admin"],
      defaultBanExpiresIn: 60 * 60 * 24 * 7, // 1 week
    }),
    haveIBeenPwned({
      customPasswordCompromisedMessage: "Please choose a more secure password.",
    }),
    nextCookies(),
  ], // make sure this is the last plugin (nextCookies) in the array
  telemetry: {
    enabled: false,
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth(betterAuthOptions);




export type Session = typeof auth.$Infer.Session;
export type SessionUser = typeof auth.$Infer.Session.user;
