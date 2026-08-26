"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FaArrowRight,
  FaBookOpen,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLayerGroup,
  FaLinkedinIn,
  FaMoon,
  FaStar,
  FaSun,
  FaUserTie,
  FaWifi,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useDesign } from "../context/DesignContext";
import { ThemeContext } from "../context/ThemeContext";
import { normalizeCallbackUrl } from "../lib/public-entry";

const featureCards = [
  {
    key: "structuredCourses",
    title: "Structured Courses",
    description: "Subject-led learning paths with searchable topics and organized reading flow.",
    icon: <FaBookOpen />,
  },
  {
    key: "interviewPractice",
    title: "Interview Practice",
    description: "Curated Q&A sets for focused interview preparation across tech domains.",
    icon: <FaUserTie />,
  },
  {
    key: "offlineReady",
    title: "Offline-Ready",
    description: "Installable PWA with cached content available even without internet.",
    icon: <FaWifi />,
  },
  {
    key: "cbtHub",
    title: "CBT Hub",
    description: "Slides, videos, and audio content gathered into one consistent experience.",
    icon: <FaLayerGroup />,
  },
] as const;

export default function Home() {
  const router = useRouter();
  const { status } = useSession();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { design } = useDesign();

  const isAuthenticated = status === "authenticated";
  const sessionExpired =
    typeof router.query.reason === "string" && router.query.reason === "session-ended";
  const callbackUrl = normalizeCallbackUrl(router.query.callbackUrl);
  const authParams = new URLSearchParams();
  if (callbackUrl) {
    authParams.set("callbackUrl", callbackUrl);
  }
  const authQuery = authParams.toString();
  const primaryHref = authQuery ? `/signup?${authQuery}` : "/signup";
  const secondaryHref = authQuery ? `/login?${authQuery}` : "/login";
  const primaryLabel = "Sign Up";
  const secondaryLabel = "Login";
  const logoSrc = theme === "dark" ? "/TinitiateLogo.png" : "/TinitiateLogoLight.png";
  const featureTones = design?.landing.features;

  useEffect(() => {
    const targets = isAuthenticated ? ["/dashboard"] : [primaryHref, secondaryHref];
    targets.forEach((href) => {
      void router.prefetch(href);
    });
  }, [isAuthenticated, primaryHref, router, secondaryHref]);

  return (
    <div className="app-shell app-shell--home">
      {/* Header */}
      <header className="page-main" style={{ paddingBottom: 0 }}>
        <div className="card page-hero-card">
          <div className="page-hero-top" style={{ gap: 14 }}>
            <Image
              src={logoSrc}
              alt="Tinitiate"
              width={1720}
              height={181}
              style={{ width: 180, maxWidth: "50vw", height: "auto", objectFit: "contain" }}
            />
            <button className="btn btn-outline" onClick={toggleTheme} type="button" style={{ minWidth: 42 }}>
              {theme === "dark" ? <FaSun /> : <FaMoon />}
              <span className="hide-mobile">{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="page-main" style={{ paddingTop: 20 }}>
        {/* Hero Section */}
        <section
          className="card page-hero-card landing-hero-card"
          style={{
            borderRadius: 30,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            {/* Hero Text */}
            <div>
              <div className="landing-hero-badges" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                <span className="badge">Installable PWA</span>
                <span className="badge">Offline reading</span>
              </div>

              {sessionExpired ? (
                <div
                  className="card"
                  style={{
                    marginBottom: 18,
                    padding: "12px 14px",
                    borderRadius: 18,
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  Your previous session ended. Continue from the landing page and choose login or
                  signup to open your dashboard again.
                </div>
              ) : null}

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(28px, 5vw, 48px)",
                  lineHeight: 1.1,
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                }}
              >
                Your complete{" "}
                <span
                  style={{
                    background: "var(--landing-hero-accent)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  learning workspace
                </span>{" "}
                for tech careers.
              </h1>

              <p
                style={{
                  marginTop: 16,
                  maxWidth: 600,
                  fontSize: "clamp(14px, 1.8vw, 17px)",
                  lineHeight: 1.75,
                  color: "var(--muted)",
                }}
              >
                Courses, interview prep, and CBT content - all in one fast, offline-ready app.
                Find the right subject, save it, and learn at your pace.
              </p>

              <div className="landing-hero-actions" style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 10 }}>
                <button className="btn btn-primary btn-lg" onClick={() => router.push(primaryHref)} type="button">
                  {primaryLabel} <FaArrowRight />
                </button>
                <button className="btn btn-outline btn-lg" onClick={() => router.push(secondaryHref)} type="button">
                  {secondaryLabel}
                </button>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div
              className="landing-feature-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 14,
              }}
            >
              {featureCards.map((feature) => {
                const tone = featureTones![feature.key];

                return (
                <div
                  key={feature.title}
                  className="feature-card-hover landing-feature-card"
                  style={{
                    padding: "20px 18px",
                    borderRadius: 20,
                    border: "1px solid var(--border)",
                    background: tone.gradient,
                    transition: "transform 200ms ease, box-shadow 200ms ease",
                    cursor: "default",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: tone.iconBg,
                      color: tone.iconColor,
                      fontSize: 18,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <div style={{ marginTop: 14, fontSize: 17, fontWeight: 800 }}>{feature.title}</div>
                  <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.65, color: "var(--muted)" }}>
                    {feature.description}
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="page-main" style={{ paddingTop: 0, paddingBottom: 28 }}>
        <div className="card page-hero-card landing-footer-card" style={{ padding: "clamp(16px, 3vw, 24px)", borderRadius: 28 }}>
          <div
            className="landing-footer-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 24,
            }}
          >
            <div>
              <Image
                src={logoSrc}
                alt="Tinitiate"
                width={1720}
                height={181}
                style={{ width: 180, height: "auto", objectFit: "contain" }}
              />
              <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.75, color: "var(--muted)" }}>
                Tinitiate AI Solutions helps learners grow with practical training, project-backed
                learning, and curated material that is easier to revisit across devices.
              </div>
            </div>

            <div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>Explore</div>
              <div style={{ marginTop: 12, display: "grid", gap: 10, fontSize: 14 }}>
                <Link href={isAuthenticated ? "/dashboard" : "/signup"} style={{ color: "inherit", textDecoration: "none" }}>
                  Learning Dashboard
                </Link>
                <Link href={isAuthenticated ? "/cbt" : "/login"} style={{ color: "inherit", textDecoration: "none" }}>
                  CBT Hub
                </Link>
                <a
                  href="https://tinitiate.com/about"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  About Tinitiate
                </a>
                <a
                  href="https://tinitiate.com/privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Privacy Policy
                </a>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>Contact</div>
              <div style={{ marginTop: 12, display: "grid", gap: 10, fontSize: 14, color: "var(--muted)" }}>
                <a
                  href="mailto:contact@tinitiateai.com"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  <FaEnvelope />
                  contact@tinitiateai.com
                </a>
                <div>USA: +1 (973) 653-6870, +1 (206) 802-4102</div>
                <div>India: +91 9848092083</div>
                <div>Telangana, India</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>Follow</div>
              <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  {
                    href: "https://www.linkedin.com/company/tinitiate/",
                    label: "LinkedIn",
                    icon: <FaLinkedinIn />,
                  },
                  {
                    href: "https://www.youtube.com/channel/UCXVm8lbVkHOxEJ4XzggTeJw",
                    label: "YouTube",
                    icon: <FaYoutube />,
                  },
                  {
                    href: "https://x.com/TinitiateAI",
                    label: "X / Twitter",
                    icon: <FaXTwitter />,
                  },
                  {
                    href: "https://www.facebook.com/profile.php?id=61589182754060",
                    label: "Facebook",
                    icon: <FaFacebookF />,
                  },
                  {
                    href: "https://www.instagram.com/tinitiate.ai/",
                    label: "Instagram",
                    icon: <FaInstagram />,
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="btn btn-outline"
                    style={{ width: 40, height: 40, padding: 0, borderRadius: 12 }}
                    title={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid var(--border)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              fontSize: 12,
              color: "var(--muted)",
            }}
          >
            <div>&copy; {new Date().getFullYear()} Tinitiate AI Solutions. All rights reserved.</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <FaStar />
              Learning, practice, and offline access in one PWA.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
