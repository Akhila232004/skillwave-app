"use client";

import Image from "next/image";
import { useState, useContext, useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

import { ThemeContext } from "../context/ThemeContext";

import {
  clearBrowserSessionActive,
  hasBrowserSessionActive,
  markBrowserSessionActive,
} from "../lib/browserSession";

import { writeCachedSessionUser } from "../lib/app-session";

import {
  cacheCurrentSessionUser,
  fetchGoogleAuthClientConfig,
  loadGoogleIdentityScript,
  requestGoogleAccessToken,
  type GoogleAuthClientConfig,
} from "../lib/google-auth-client";

import { normalizeCallbackUrl } from "../lib/public-entry";

import {
  FaMoon,
  FaSun,
  FaArrowRight,
  FaAt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebookF,
  FaWhatsapp,
} from "react-icons/fa";

type FieldProps = {
  label: string;
  icon: ReactNode;
  children: ReactNode;
  hint?: string;
};

function Field({ label, icon, children, hint }: FieldProps) {
  return (
    <div className="auth-field grid gap-2">
      <div className="auth-field__label-row flex items-end justify-between gap-3">
        <label className="auth-field__label text-sm font-semibold tracking-tight">
          {label}
        </label>

        {hint ? (
          <span className="auth-field__hint text-xs text-[color:var(--text-muted)]">
            {hint}
          </span>
        ) : null}
      </div>

      <div className="relative">
        <span className="auth-field__icon absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]">
          {icon}
        </span>

        {children}
      </div>
    </div>
  );
}

const PENDING_WHATSAPP_KEY =
  "tinitiate.whatsapp.pending-number";

const PREMIER_WHATSAPP_NUMBER =
  "916309123486";

function normalizeWhatsAppNumber(value: string) {
  return value
    .trim()
    .replace(/[^\d+]/g, "");
}

function isValidWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, "");

  return (
    digits.length >= 10 &&
    digits.length <= 15
  );
}

async function syncPendingWhatsAppNumber() {
  if (typeof window === "undefined") {
    return;
  }

  const pending = localStorage.getItem(
    PENDING_WHATSAPP_KEY
  );

  if (!pending) {
    return;
  }

  try {
    const response = await fetch(
      "/api/users/whatsapp-premier",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          whatsappNumber: pending,
        }),
      }
    );

    if (response.ok) {
      localStorage.removeItem(
        PENDING_WHATSAPP_KEY
      );
    }
  } catch {
    // Keep the number so the next login can retry it.
  }
}

export default function LoginPage() {
  const router = useRouter();

  const { status } = useSession();

  const {
    theme,
    toggleTheme,
  } = useContext(ThemeContext);

  const sessionExpired =
    typeof router.query.reason === "string" &&
    router.query.reason === "session-ended";

  const logoSrc =
    theme === "dark"
      ? "/TinitiateLogo.png"
      : "/TinitiateLogoLight.png";

  const callbackUrl =
    normalizeCallbackUrl(
      router.query.callbackUrl,
      "/dashboard"
    ) || "/dashboard";

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    googleConfig,
    setGoogleConfig,
  ] =
    useState<GoogleAuthClientConfig | null>(
      null
    );

  const [
    googleReady,
    setGoogleReady,
  ] = useState(false);

  useEffect(() => {
    if (
      status === "authenticated" &&
      hasBrowserSessionActive()
    ) {
      router.replace(callbackUrl);
    }
  }, [
    status,
    router,
    callbackUrl,
  ]);

  useEffect(() => {
    void router.prefetch(
      callbackUrl
    );

    void router.prefetch(
      "/signup"
    );
  }, [
    callbackUrl,
    router,
  ]);

  useEffect(() => {
    let cancelled = false;

    setGoogleReady(false);

    void fetchGoogleAuthClientConfig()
      .then((config) => {
        if (!cancelled) {
          setGoogleConfig(config);
        }

        if (
          !cancelled &&
          config.enabled &&
          !config.oauth
        ) {
          void loadGoogleIdentityScript()
            .catch(() => undefined)
            .finally(() => {
              if (!cancelled) {
                setGoogleReady(true);
              }
            });

          return;
        }

        if (!cancelled) {
          setGoogleReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGoogleConfig({
            enabled: false,
            clientId: "",
            oauth: false,
            tokenProviderId:
              "google-access-token",
          });

          setGoogleReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function onRequestPremierAccess() {
    setError("");

    const input = window.prompt(
      "Enter your WhatsApp number (for example, +91 9876543210):"
    );

    if (input === null) {
      return;
    }

    const whatsappNumber =
      normalizeWhatsAppNumber(input);

    if (
      !isValidWhatsAppNumber(
        whatsappNumber
      )
    ) {
      setError(
        "Please enter a valid WhatsApp number with country code."
      );

      return;
    }

    localStorage.setItem(
      PENDING_WHATSAPP_KEY,
      whatsappNumber
    );

    try {
      const response = await fetch(
        "/api/users/whatsapp-premier",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            whatsappNumber,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        setError(
          data?.message ||
            "Could not save the WhatsApp number."
        );

        return;
      }

      localStorage.removeItem(
        PENDING_WHATSAPP_KEY
      );

      const message =
        `Hello, I would like to request Premier access. My WhatsApp number is ${whatsappNumber}.`;

      const whatsappUrl =
        `https://wa.me/${PREMIER_WHATSAPP_NUMBER}?text=${encodeURIComponent(
          message
        )}`;

      window.location.assign(
        whatsappUrl
      );
    } catch {
      setError(
        "Could not save the WhatsApp number. Please try again."
      );
    }
  }

  async function onSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");

    if (
      !email.trim() ||
      !password.trim()
    ) {
      setError(
        "Please enter email and password."
      );

      return;
    }

    setLoading(true);

    try {
      const verifyRes =
        await fetch(
          "/api/auth/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

      const verifyData =
        await verifyRes
          .json()
          .catch(() => ({}));

      if (!verifyRes.ok) {
        setError(
          verifyData?.message ||
            "Login failed."
        );

        return;
      }

      markBrowserSessionActive();

      const result =
        await signIn(
          "credentials",
          {
            email,
            password,
            redirect: false,
            callbackUrl,
          }
        );

      if (result?.error) {
        clearBrowserSessionActive();

        setError(
          "Login failed. Please try again."
        );

        return;
      }

      writeCachedSessionUser({
        id: verifyData?.user?.id,

        name:
          verifyData?.user
            ?.fullName,

        email:
          verifyData?.user?.email,
      });

      await syncPendingWhatsAppNumber();

      router.replace(
        result?.url ||
          callbackUrl
      );
    } catch {
      setError(
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setError("");

    if (
      !googleConfig ||
      !googleReady
    ) {
      return;
    }

    if (
      !googleConfig.enabled ||
      !googleConfig.clientId
    ) {
      setError(
        "Google sign-in needs a Google Client ID on this server. Add GOOGLE_CLIENT_ID, then restart or redeploy."
      );

      return;
    }

    setLoading(true);

    try {
      markBrowserSessionActive();

      if (googleConfig.oauth) {
        await signIn(
          "google",
          {
            callbackUrl,
          }
        );

        return;
      }

      const accessToken =
        await requestGoogleAccessToken(
          googleConfig.clientId
        );

      const result =
        await signIn(
          googleConfig.tokenProviderId,
          {
            accessToken,
            redirect: false,
            callbackUrl,
          }
        );

      if (
        result?.error ||
        result?.ok === false
      ) {
        clearBrowserSessionActive();

        setError(
          "Google sign-in failed. Please try again."
        );

        return;
      }

      await cacheCurrentSessionUser();

      await syncPendingWhatsAppNumber();

      router.replace(
        result?.url ||
          callbackUrl
      );
    } catch (err) {
      clearBrowserSessionActive();

      setError(
        err instanceof Error
          ? err.message
          : "Google sign-in failed."
      );
    } finally {
      setLoading(false);
    }
  }

  async function onFacebook() {
    setError("");

    setLoading(true);

    try {
      markBrowserSessionActive();

      await signIn(
        "facebook",
        {
          callbackUrl,
        }
      );
    } catch (err) {
      clearBrowserSessionActive();

      setError(
        err instanceof Error
          ? err.message
          : "Facebook sign-in failed. Please try again."
      );

      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-sm">
          Loading...
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="app-shell app-shell--home auth-shell min-h-screen relative overflow-hidden px-4 sm:px-6 flex flex-col">

      <div className="pointer-events-none absolute inset-0">

        <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-[color:var(--brand)] opacity-[0.10] blur-[90px]" />

        <div className="absolute -bottom-44 -left-44 h-[520px] w-[520px] rounded-full bg-[color:var(--brand-2)] opacity-[0.10] blur-[90px]" />

        <div className="auth-grid-pattern absolute inset-0 opacity-[0.07]" />

      </div>

      <header className="auth-header mx-auto max-w-2xl pt-5 sm:pt-7 w-full relative">

        <div className="auth-topbar glass rounded-2xl px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between">

          <div
            className="flex items-center gap-3 min-w-0 cursor-pointer"
            onClick={() =>
              router.push("/")
            }
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" ||
                e.key === " "
              ) {
                router.push("/");
              }
            }}
          >

            <Image
              src={logoSrc}
              alt="Tinitiate"
              width={1720}
              height={181}
              style={{
                width: 180,
                maxWidth: "48vw",
                height: "auto",
                objectFit: "contain",
              }}
            />

          </div>

          <button
            className="btn btn-outline !rounded-2xl !px-3 !py-2 hover:opacity-90 transition"
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle theme"
          >

            <span className="text-[14px]">

              {theme === "dark" ? (
                <FaSun />
              ) : (
                <FaMoon />
              )}

            </span>

          </button>

        </div>

      </header>

      <main className="auth-main auth-main--focused mx-auto max-w-2xl mt-8 sm:mt-12 w-full flex-1 relative">

        <div className="auth-layout auth-layout--focused grid gap-6 items-stretch">

          <section className="auth-panel auth-form-panel glass rounded-3xl p-6 sm:p-10 relative overflow-hidden">

            <div
              className="pointer-events-none absolute top-0 left-0 right-0 h-[120px] opacity-[0.55]"
              style={{
                background:
                  "linear-gradient(to bottom, color-mix(in srgb, var(--surface) 14%, transparent), transparent)",
              }}
            />

            <div className="auth-form-inner max-w-xl mx-auto relative">

              <div className="auth-eyebrow inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] px-3 py-1 text-[11px] sm:text-xs text-[color:var(--text-muted)]">

                <span className="h-2 w-2 rounded-full bg-[color:var(--brand)]" />

                Existing users login

              </div>

              <h1 className="auth-form-title mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight">
                Sign in
              </h1>

              <p className="auth-form-copy mt-2 text-sm text-[color:var(--text-muted)]">
                Continue with Google or Facebook, or use email/password.
              </p>

              {sessionExpired ? (
                <div
                  className="mt-4 rounded-2xl border border-[color:var(--border)] px-4 py-3 text-sm text-[color:var(--text)]"
                  style={{
                    background:
                      "color-mix(in srgb, var(--dashboard-avatar-bg) 16%, transparent)",
                  }}
                >
                  Your last browser session ended. Please sign in again.
                </div>
              ) : null}

              <div className="auth-provider-actions mt-6 grid gap-3">

                <button
                  className="auth-btn btn btn-outline w-full !rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed"
                  type="button"
                  onClick={onGoogle}
                  disabled={
                    loading ||
                    !googleReady
                  }
                >

                  <span className="inline-flex items-center gap-2">

                    <FaGoogle />

                    {googleReady
                      ? "Continue with Google"
                      : "Checking Google..."}

                  </span>

                </button>

                <button
                  className="auth-btn btn btn-outline w-full !rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed"
                  type="button"
                  onClick={onFacebook}
                  disabled={loading}
                >

                  <span className="inline-flex items-center gap-2">

                    <FaFacebookF
                      style={{
                        color:
                          "#1877F2",
                      }}
                    />

                    Continue with Facebook

                  </span>

                </button>

                <button
                  className="auth-btn btn btn-outline w-full !rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed"
                  type="button"
                  onClick={
                    onRequestPremierAccess
                  }
                  disabled={loading}
                >

                  <span className="inline-flex items-center gap-2">

                    <FaWhatsapp
                      style={{
                        color:
                          "#25D366",
                      }}
                    />

                    Request Premier Access

                  </span>

                </button>

                <div className="flex items-center gap-3">

                  <div className="h-px flex-1 bg-[color:var(--border)]" />

                  <div className="text-xs text-[color:var(--text-muted)]">
                    OR
                  </div>

                  <div className="h-px flex-1 bg-[color:var(--border)]" />

                </div>

              </div>

              <form
                onSubmit={onSubmit}
                className="auth-form mt-6 grid gap-4"
              >

                <Field
                  label="Email"
                  icon={<FaAt />}
                  hint="Use your registered email"
                >

                  <input
                    className="auth-input w-full rounded-2xl border border-[color:var(--border)] bg-transparent pl-10 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-[color:var(--brand)] transition"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    autoComplete="email"
                    type="email"
                  />

                </Field>

                <Field
                  label="Password"
                  icon={<FaLock />}
                  hint="Keep it private"
                >

                  <div className="relative">

                    <input
                      className="auth-input w-full rounded-2xl border border-[color:var(--border)] bg-transparent pl-10 pr-12 py-3.5 outline-none focus:ring-2 focus:ring-[color:var(--brand)] transition"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      autoComplete="current-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (v) => !v
                        )
                      }
                      className="auth-password-toggle absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 inline-flex items-center justify-center rounded-2xl border border-[color:var(--border)] hover:opacity-80 transition"
                      aria-label="Toggle password visibility"
                    >

                      {showPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}

                    </button>

                  </div>

                </Field>

                {error ? (
                  <div
                    aria-live="polite"
                    className="text-sm rounded-2xl border border-[color:var(--border)] px-4 py-3"
                    style={{
                      color:
                        "var(--status-offline-color)",

                      background:
                        "color-mix(in srgb, var(--status-offline-color) 7%, transparent)",
                    }}
                  >
                    {error}
                  </div>
                ) : null}

                <button
                  className="auth-btn btn btn-primary w-full !rounded-2xl group disabled:opacity-60 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading}
                >

                  <span>
                    {loading
                      ? "Signing in..."
                      : "Login"}
                  </span>

                  <span className="inline-flex items-center transition-transform group-hover:translate-x-0.5">

                    <FaArrowRight />

                  </span>

                </button>

                <button
                  className="auth-btn btn btn-outline w-full !rounded-2xl"
                  type="button"
                  onClick={() =>
                    router.push(
                      "/signup"
                    )
                  }
                  disabled={loading}
                >
                  New user? Sign up first
                </button>

              </form>

            </div>

          </section>

        </div>

      </main>

      <footer className="auth-footer mx-auto max-w-2xl w-full py-8 sm:py-10 relative">

        <div className="glass rounded-3xl p-5 sm:p-8">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-[color:var(--text-muted)]">

            <span>
              Copyright{" "}
              {new Date().getFullYear()}{" "}
              TINITIATE Technologies Pvt Ltd.
            </span>

            <span className="opacity-80">
              tinitiate.com
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}

export {
  redirectAuthenticatedUserFromPublicPage as getServerSideProps,
} from "../lib/redirect-authenticated-page";