import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

import {
  addUser,
  findUserByEmail,
  normalizeEmail,
  verifyPassword,
} from "./userStore";

type AppToken = JWT & {
  id?: string;
  picture?: string | null;
  provider?: string;
};

type AppSession = Session & {
  user?: Session["user"] & {
    id?: string;
    provider?: string;
  };
};

type GoogleTokenInfo = {
  aud?: string;
  email?: string;
  email_verified?: boolean | string;
  error?: string;
  error_description?: string;
};

type GoogleUserInfo = {
  email?: string;
  email_verified?: boolean | string;
  name?: string;
  given_name?: string;
  picture?: string;
};

const AUTH_FALLBACK_SECRET = "tinitiate-local-auth-secret-v1";

const SESSION_MAX_AGE = 30 * 24 * 60 * 60;

const GOOGLE_ACCESS_TOKEN_PROVIDER_ID = "google-access-token";

const googleSessionUserId = (email: string) =>
  `google:${email}`;

const facebookSessionUserId = (email: string) =>
  `facebook:${email}`;

const envValues = (...names: string[]) => {
  const values: string[] = [];

  for (const name of names) {
    const value = process.env[name];

    if (!value) continue;

    value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .forEach((entry) => values.push(entry));
  }

  return Array.from(new Set(values));
};

const firstEnvValue = (...names: string[]) =>
  envValues(...names)[0] || "";

if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET =
    firstEnvValue(
      "AUTH_SECRET",
      "NEXTAUTH_SECRET"
    ) || AUTH_FALLBACK_SECRET;
}

/* -------------------------------------------------------------------------- */
/*                              GOOGLE CONFIG                                 */
/* -------------------------------------------------------------------------- */

const getGoogleClientIds = () =>
  envValues(
    "GOOGLE_CLIENT_ID",
    "GOOGLE_ID",
    "AUTH_GOOGLE_ID",
    "AUTH_GOOGLE_CLIENT_ID",
    "NEXTAUTH_GOOGLE_CLIENT_ID",
    "NEXT_PUBLIC_GOOGLE_CLIENT_ID"
  );

const getGoogleClientId = () =>
  getGoogleClientIds()[0] || "";

const getGoogleClientSecret = () =>
  firstEnvValue(
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_SECRET",
    "AUTH_GOOGLE_SECRET",
    "AUTH_GOOGLE_CLIENT_SECRET",
    "NEXTAUTH_GOOGLE_CLIENT_SECRET"
  );

export const isGoogleClientConfigured = () =>
  Boolean(getGoogleClientId());

export const isGoogleAuthConfigured = () =>
  Boolean(
    getGoogleClientId() &&
      getGoogleClientSecret()
  );

export const getGoogleAuthClientConfig = () => {
  const clientId = getGoogleClientId();

  return {
    enabled: Boolean(clientId),
    clientId,
    oauth: Boolean(
      clientId &&
        getGoogleClientSecret()
    ),
    tokenProviderId:
      GOOGLE_ACCESS_TOKEN_PROVIDER_ID,
  };
};

/* -------------------------------------------------------------------------- */
/*                             FACEBOOK CONFIG                                */
/* -------------------------------------------------------------------------- */

const getFacebookClientId = () =>
  firstEnvValue(
    "FACEBOOK_CLIENT_ID",
    "FACEBOOK_ID",
    "META_CLIENT_ID"
  );

const getFacebookClientSecret = () =>
  firstEnvValue(
    "FACEBOOK_CLIENT_SECRET",
    "FACEBOOK_SECRET",
    "META_CLIENT_SECRET"
  );

export const isFacebookAuthConfigured = () =>
  Boolean(
    getFacebookClientId() &&
      getFacebookClientSecret()
  );

/* -------------------------------------------------------------------------- */
/*                              GOOGLE HELPERS                                */
/* -------------------------------------------------------------------------- */

const isGoogleEmailVerified = (value: unknown) =>
  value === true ||
  value === "true" ||
  value === "1";

const fetchJson = async <T,>(
  url: string,
  init?: RequestInit
) => {
  const response = await fetch(url, {
    ...init,

    headers: {
      Accept: "application/json",
      ...(init?.headers || {}),
    },
  });

  const data =
    (await response
      .json()
      .catch(() => ({}))) as T;

  return {
    response,
    data,
  };
};

/* -------------------------------------------------------------------------- */
/*                              GOOGLE PROVIDER                               */
/* -------------------------------------------------------------------------- */

const googleProvider = () =>
  GoogleProvider({
    clientId: getGoogleClientId(),

    clientSecret:
      getGoogleClientSecret(),

    authorization: {
      params: {
        prompt: "select_account",
        access_type: "offline",
        response_type: "code",
      },
    },
  });

/* -------------------------------------------------------------------------- */
/*                            FACEBOOK PROVIDER                               */
/* -------------------------------------------------------------------------- */

const facebookProvider = () =>
  FacebookProvider({
    clientId: getFacebookClientId(),

    clientSecret:
      getFacebookClientSecret(),

    authorization: {
      params: {
        scope: "email,public_profile",
      },
    },
  });

/* -------------------------------------------------------------------------- */
/*                       GOOGLE ACCESS TOKEN PROVIDER                         */
/* -------------------------------------------------------------------------- */

const googleAccessTokenProvider = () =>
  CredentialsProvider({
    id: GOOGLE_ACCESS_TOKEN_PROVIDER_ID,

    name: "Google",

    credentials: {
      accessToken: {
        label: "Google Access Token",
        type: "text",
      },
    },

    async authorize(credentials) {
      const accessToken = String(
        credentials?.accessToken || ""
      ).trim();

      const clientIds =
        getGoogleClientIds();

      if (
        !accessToken ||
        clientIds.length === 0
      ) {
        throw new Error(
          "Google sign-in is not configured."
        );
      }

      const tokenInfoUrl =
        `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(
          accessToken
        )}`;

      const {
        response: tokenResponse,
        data: tokenInfo,
      } =
        await fetchJson<GoogleTokenInfo>(
          tokenInfoUrl
        );

      if (
        !tokenResponse.ok ||
        !tokenInfo.aud ||
        !clientIds.includes(
          tokenInfo.aud
        )
      ) {
        throw new Error(
          tokenInfo.error_description ||
            "Google sign-in token is invalid."
        );
      }

      const {
        response: userResponse,
        data: userInfo,
      } =
        await fetchJson<GoogleUserInfo>(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },
          }
        );

      if (!userResponse.ok) {
        throw new Error(
          "Could not read Google account profile."
        );
      }

      const email = normalizeEmail(
        userInfo.email ||
          tokenInfo.email
      );

      if (
        !email ||
        !isGoogleEmailVerified(
          userInfo.email_verified ??
            tokenInfo.email_verified
        )
      ) {
        throw new Error(
          "Google account email is not verified."
        );
      }

      const existing =
        await findUserByEmail(email)
          .catch(() => null);

      const image =
        typeof userInfo.picture ===
        "string"
          ? userInfo.picture
          : null;

      if (existing) {
        return {
          id: existing.id,
          name: existing.fullName,
          email: existing.email,
          image,
        };
      }

      const fullName =
        String(
          userInfo.name ||
            userInfo.given_name ||
            ""
        ).trim() ||
        email.split("@")[0] ||
        "Google User";

      try {
        const created =
          await addUser({
            fullName,
            email,
          });

        if (created.ok) {
          return {
            id: created.user.id,
            name: created.user.fullName,
            email: created.user.email,
            image,
          };
        }

        const createdLater =
          await findUserByEmail(email);

        if (createdLater) {
          return {
            id: createdLater.id,
            name: createdLater.fullName,
            email: createdLater.email,
            image,
          };
        }
      } catch {
        // Serverless deployments such as Netlify may not allow writing bundled files.
      }

      return {
        id: googleSessionUserId(email),
        name: fullName,
        email,
        image,
      };
    },
  });

/* -------------------------------------------------------------------------- */
/*                              AUTH OPTIONS                                  */
/* -------------------------------------------------------------------------- */

export const authOptions: NextAuthOptions = {
  secret:
    process.env.NEXTAUTH_SECRET ||
    AUTH_FALLBACK_SECRET,

  session: {
    strategy: "jwt",

    maxAge: SESSION_MAX_AGE,

    updateAge: 24 * 60 * 60,
  },

  jwt: {
    maxAge: SESSION_MAX_AGE,
  },

  providers: [
    /* ---------------------------------------------------------------------- */
    /*                         EMAIL / PASSWORD                                */
    /* ---------------------------------------------------------------------- */

    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const email = normalizeEmail(
          credentials?.email
        );

        const password = String(
          credentials?.password || ""
        );

        if (!email || !password) {
          throw new Error(
            "Please enter email and password."
          );
        }

        const user =
          await findUserByEmail(email);

        if (!user) {
          throw new Error(
            "No account found. Please sign up first."
          );
        }

        if (!user.passwordHash) {
          if (
            user.provider === "facebook"
          ) {
            throw new Error(
              "Please sign in with Facebook."
            );
          }

          if (
            user.provider === "google"
          ) {
            throw new Error(
              "Please sign in with Google."
            );
          }

          throw new Error(
            "This account does not have a password."
          );
        }

        const ok = verifyPassword(
          password,
          user.passwordHash
        );

        if (!ok) {
          throw new Error(
            "Invalid credentials."
          );
        }

        return {
          id: user.id,
          name: user.fullName,
          email: user.email,
          image: null,
        };
      },
    }),

    /* ---------------------------------------------------------------------- */
    /*                              GOOGLE                                    */
    /* ---------------------------------------------------------------------- */

    ...(isGoogleClientConfigured()
      ? [googleAccessTokenProvider()]
      : []),

    ...(isGoogleAuthConfigured()
      ? [googleProvider()]
      : []),

    /* ---------------------------------------------------------------------- */
    /*                            FACEBOOK / META                             */
    /* ---------------------------------------------------------------------- */

    ...(isFacebookAuthConfigured()
      ? [facebookProvider()]
      : []),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    /* ---------------------------------------------------------------------- */
    /*                              SIGN IN                                   */
    /* ---------------------------------------------------------------------- */

    async signIn({
      user,
      account,
    }) {
      const provider =
        account?.provider;

      /*
       * Credentials login does not need
       * additional OAuth processing.
       */
      if (
        provider === "credentials" ||
        provider ===
          GOOGLE_ACCESS_TOKEN_PROVIDER_ID
      ) {
        return true;
      }

      /*
       * Google and Facebook OAuth
       * accounts both need an email.
       */
      if (
        provider !== "google" &&
        provider !== "facebook"
      ) {
        return true;
      }

      const email = normalizeEmail(
        user.email
      );

      if (!email) {
        return false;
      }

      const existing =
        await findUserByEmail(email)
          .catch(() => null);

      /*
       * Existing user:
       * allow login.
       */
      if (existing) {
        return true;
      }

      const isFacebook =
        provider === "facebook";

      const fullName =
        String(user.name || "")
          .trim() ||
        email.split("@")[0] ||
        (isFacebook
          ? "Facebook User"
          : "Google User");

      /*
       * Create a new OAuth user.
       *
       * addUser() currently defaults
       * passwordless accounts to Google.
       * Therefore we create the user
       * first and then update the
       * provider in the JWT/session
       * handling below.
       */
      try {
        const created =
          await addUser({
            fullName,
            email,
          });

        if (created.ok) {
          /*
           * The account has been created.
           * The provider will be represented
           * by the OAuth account/session.
           */
          return true;
        }

        const createdLater =
          await findUserByEmail(email);

        return Boolean(
          createdLater
        ) || created.status === 409;
      } catch {
        /*
         * In serverless environments,
         * local file writes may fail.
         * OAuth authentication should
         * still be allowed to continue.
         */
        return true;
      }
    },

    /* ---------------------------------------------------------------------- */
    /*                                 JWT                                    */
    /* ---------------------------------------------------------------------- */

    async jwt({
      token,
      user,
      account,
    }) {
      const appToken =
        token as AppToken;

      /*
       * Credentials and Google access-token
       * users are already returned from
       * authorize().
       */
      if (
        (
          account?.provider ===
            "credentials" ||
          account?.provider ===
            GOOGLE_ACCESS_TOKEN_PROVIDER_ID
        ) &&
        user
      ) {
        appToken.id = String(
          user.id || ""
        );

        appToken.name =
          user.name || "";

        appToken.email =
          user.email || "";

        appToken.picture =
          typeof user.image ===
          "string"
            ? user.image
            : null;

        appToken.provider =
          account.provider;
      }

      /* -------------------------------------------------------------------- */
      /*                              GOOGLE                                  */
      /* -------------------------------------------------------------------- */

      if (
        account?.provider === "google"
      ) {
        const email =
          normalizeEmail(
            appToken.email ||
              user?.email
          );

        const fallbackName =
          String(
            user?.name ||
              appToken.name ||
              ""
          ).trim() ||
          email.split("@")[0] ||
          "Google User";

        appToken.picture =
          typeof user?.image ===
          "string"
            ? user.image
            : typeof appToken.picture ===
              "string"
            ? appToken.picture
            : null;

        appToken.provider =
          "google";

        if (email) {
          const existing =
            await findUserByEmail(
              email
            ).catch(() => null);

          if (existing) {
            appToken.id =
              existing.id;

            appToken.name =
              existing.fullName;

            appToken.email =
              existing.email;
          } else {
            appToken.id =
              googleSessionUserId(
                email
              );

            appToken.name =
              fallbackName;

            appToken.email =
              email;
          }
        }
      }

      /* -------------------------------------------------------------------- */
      /*                            FACEBOOK                                   */
      /* -------------------------------------------------------------------- */

      if (
        account?.provider ===
        "facebook"
      ) {
        const email =
          normalizeEmail(
            appToken.email ||
              user?.email
          );

        const fallbackName =
          String(
            user?.name ||
              appToken.name ||
              ""
          ).trim() ||
          email.split("@")[0] ||
          "Facebook User";

        appToken.picture =
          typeof user?.image ===
          "string"
            ? user.image
            : typeof appToken.picture ===
              "string"
            ? appToken.picture
            : null;

        appToken.provider =
          "facebook";

        if (email) {
          const existing =
            await findUserByEmail(
              email
            ).catch(() => null);

          if (existing) {
            appToken.id =
              existing.id;

            appToken.name =
              existing.fullName;

            appToken.email =
              existing.email;
          } else {
            appToken.id =
              facebookSessionUserId(
                email
              );

            appToken.name =
              fallbackName;

            appToken.email =
              email;
          }
        }
      }

      return appToken;
    },

    /* ---------------------------------------------------------------------- */
    /*                              SESSION                                   */
    /* ---------------------------------------------------------------------- */

    async session({
      session,
      token,
    }) {
      const appSession =
        session as AppSession;

      const appToken =
        token as AppToken;

      if (appSession.user) {
        appSession.user.id =
          String(
            appToken.id || ""
          );

        appSession.user.name =
          String(
            appToken.name ||
              appSession.user.name ||
              ""
          );

        appSession.user.email =
          String(
            appToken.email ||
              appSession.user.email ||
              ""
          );

        appSession.user.image =
          typeof appToken.picture ===
          "string"
            ? appToken.picture
            : typeof appSession.user
                  .image === "string"
            ? appSession.user.image
            : null;

        appSession.user.provider =
          appToken.provider;
      }

      return appSession;
    },

    /* ---------------------------------------------------------------------- */
    /*                              REDIRECT                                  */
    /* ---------------------------------------------------------------------- */

    async redirect({
      url,
      baseUrl,
    }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (url.startsWith(baseUrl)) {
        return url;
      }

      return `${baseUrl}/dashboard`;
    },
  },
};