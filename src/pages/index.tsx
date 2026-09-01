"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  useContext,
  useEffect,
  useState,
} from "react";
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

/*
 * ============================================================
 * COMPANY CONFIGURATION
 * ============================================================
 */

type CompanyConfig = {
  name?: string;
  legalName?: string;
  shortName?: string;
  description?: string;
  website?: string;
  contactEmail?: string;

  branding?: {
    logo?: string;
    logoLight?: string;
    logoMark?: string;
  };

  social?: {
    linkedin?: string;
    x?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
};

/*
 * ============================================================
 * REPOSITORY CONFIGURATION
 * ============================================================
 */

type RepositoryConfig = {
  name?: string;
  version?: number;

  company?: CompanyConfig;

  /*
   * Repository information is supplied by the server
   * configuration endpoint when available.
   */
  repository?: {
    owner?: string;
    name?: string;
    repository?: string;
    branch?: string;
  };

  contentRepository?: {
    owner?: string;
    repository?: string;
    branch?: string;
  };

  content?: {
    interview?: {
      enabled?: boolean;
      path?: string;
    };

    courses?: {
      enabled?: boolean;
      path?: string;
    };

    slideshow?: {
      enabled?: boolean;
      path?: string;
    };

    videos?: {
      enabled?: boolean;
      path?: string;
    };

    audio?: {
      enabled?: boolean;
      path?: string;
    };

    cbt?: {
      enabled?: boolean;
      path?: string;
    };

    dashboard?: {
      enabled?: boolean;
      path?: string;
    };

    ticker?: {
      enabled?: boolean;
      path?: string;
    };
  };

  design?: {
    enabled?: boolean;
    colour?: string;
    icons?: string;
  };
};

/*
 * ============================================================
 * LANDING FEATURE KEY
 * ============================================================
 */

type LandingFeatureKey =
  | "structuredCourses"
  | "interviewPractice"
  | "offlineReady"
  | "cbtHub";

/*
 * ============================================================
 * FEATURE CARD TYPE
 * ============================================================
 */

type FeatureCard = {
  key: LandingFeatureKey;
  title: string;
  description: string;
  icon: React.ReactElement;
};

/*
 * ============================================================
 * SHELL FEATURE CARDS
 * ============================================================
 *
 * These are universal SkillWave shell features.
 *
 * They do not contain company-specific information.
 */

const featureCards: FeatureCard[] = [
  {
    key: "structuredCourses",
    title: "Structured Courses",
    description:
      "Subject-led learning paths with searchable topics and organized reading flow.",
    icon: <FaBookOpen />,
  },

  {
    key: "interviewPractice",
    title: "Interview Practice",
    description:
      "Curated Q&A sets for focused interview preparation across tech domains.",
    icon: <FaUserTie />,
  },

  {
    key: "offlineReady",
    title: "Offline-Ready",
    description:
      "Installable PWA with cached content available even without internet.",
    icon: <FaWifi />,
  },

  {
    key: "cbtHub",
    title: "CBT Hub",
    description:
      "Slides, videos, and audio content gathered into one consistent experience.",
    icon: <FaLayerGroup />,
  },
];

/*
 * ============================================================
 * NORMALIZE REPOSITORY PATH
 * ============================================================
 */

const normalizePath = (
  value: string
): string =>
  String(value || "")
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "");

/*
 * ============================================================
 * BUILD RAW REPOSITORY URL
 * ============================================================
 */

const buildRawRepositoryUrl = (
  owner: string,
  repository: string,
  branch: string,
  path: string
): string => {
  return (
    `https://raw.githubusercontent.com/` +
    `${encodeURIComponent(owner)}/` +
    `${encodeURIComponent(repository)}/` +
    `${encodeURIComponent(branch)}/` +
    `${path
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/")}`
  );
};

/*
 * ============================================================
 * BRANDING URL
 * ============================================================
 *
 * Company branding remains in the external content repository.
 *
 * The browser accesses it through the SkillWave proxy.
 *
 * IMPORTANT:
 *
 * The proxy expects:
 *
 *   /api/proxy?url=<external-url>
 *
 * not:
 *
 *   /api/proxy?path=<path>
 */

const buildBrandingUrl = (
  path: string | undefined,
  config: RepositoryConfig | null
): string | null => {
  if (!path) {
    return null;
  }

  const normalizedPath = normalizePath(path);

  if (!normalizedPath) {
    return null;
  }

  /*
   * Prefer the explicit contentRepository structure.
   */
  const explicitOwner =
    config?.contentRepository?.owner;

  const explicitRepository =
    config?.contentRepository?.repository;

  const explicitBranch =
    config?.contentRepository?.branch;

  /*
   * Also support a repository structure if the API
   * exposes it in that form.
   */
  const repositoryOwner =
    config?.repository?.owner;

  const repositoryName =
    config?.repository?.repository ||
    config?.repository?.name;

  const repositoryBranch =
    config?.repository?.branch;

  const owner =
    explicitOwner ||
    repositoryOwner;

  const repository =
    explicitRepository ||
    repositoryName;

  const branch =
    explicitBranch ||
    repositoryBranch ||
    "main";

  /*
   * If repository information isn't available yet,
   * don't create an invalid URL.
   *
   * The component will render the company name
   * temporarily until configuration is loaded.
   */
  if (!owner || !repository) {
    return null;
  }

  const rawUrl = buildRawRepositoryUrl(
    owner,
    repository,
    branch,
    normalizedPath
  );

  return `/api/proxy?url=${encodeURIComponent(
    rawUrl
  )}`;
};

/*
 * ============================================================
 * COMPANY WEBSITE PAGE URL
 * ============================================================
 */

const buildCompanyPageUrl = (
  website: string | undefined,
  page: string
): string | null => {
  if (!website) {
    return null;
  }

  try {
    const url = new URL(website);

    url.pathname =
      `${url.pathname.replace(/\/+$/, "")}/${page}`;

    return url.toString();
  } catch {
    return null;
  }
};

/*
 * ============================================================
 * HOME PAGE
 * ============================================================
 */

export default function Home() {
  const router = useRouter();

  const {
    status,
  } = useSession();

  const {
    theme,
    toggleTheme,
  } = useContext(
    ThemeContext
  );

  const {
    design,
  } = useDesign();

  /*
   * ----------------------------------------------------------
   * Repository configuration state
   * ----------------------------------------------------------
   */

  const [
    repositoryConfig,
    setRepositoryConfig,
  ] = useState<RepositoryConfig | null>(
    null
  );

  /*
   * ----------------------------------------------------------
   * Authentication
   * ----------------------------------------------------------
   */

  const isAuthenticated =
    status === "authenticated";

  const sessionExpired =
    typeof router.query.reason ===
      "string" &&
    router.query.reason ===
      "session-ended";

  const callbackUrl =
    normalizeCallbackUrl(
      router.query.callbackUrl
    );

  const authParams =
    new URLSearchParams();

  if (callbackUrl) {
    authParams.set(
      "callbackUrl",
      callbackUrl
    );
  }

  const authQuery =
    authParams.toString();

  const primaryHref =
    authQuery
      ? `/signup?${authQuery}`
      : "/signup";

  const secondaryHref =
    authQuery
      ? `/login?${authQuery}`
      : "/login";

  /*
   * ----------------------------------------------------------
   * Load repository configuration
   * ----------------------------------------------------------
   *
   * /api/content/config reads the company's
   * skillwave.config.yaml from the external repository.
   */

  useEffect(() => {
    let cancelled = false;

    const loadRepositoryConfig =
      async () => {
        try {
          const response =
            await fetch(
              "/api/content/config",
              {
                cache: "no-store",
              }
            );

          if (!response.ok) {
            throw new Error(
              `Failed to load repository configuration (${response.status})`
            );
          }

          const data =
            (await response.json()) as RepositoryConfig;

          if (!cancelled) {
            setRepositoryConfig(
              data
            );
          }
        } catch (error) {
          console.error(
            "SKILLWAVE COMPANY CONFIG LOAD FAILED:",
            error
          );

          if (!cancelled) {
            setRepositoryConfig(
              null
            );
          }
        }
      };

    void loadRepositoryConfig();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * ----------------------------------------------------------
   * Company information
   * ----------------------------------------------------------
   */

  const company =
    repositoryConfig?.company;

  const companyName =
    company?.name ||
    "SkillWave";

  const companyShortName =
    company?.shortName ||
    companyName;

  const companyDescription =
    company?.description ||
    "A practical learning workspace for technology skills, interview preparation, and career development.";

  const companyWebsite =
    company?.website ||
    "";

  const companyEmail =
    company?.contactEmail ||
    "";

  /*
   * ----------------------------------------------------------
   * Company branding
   * ----------------------------------------------------------
   */

  const configuredLogo =
    theme === "dark"
      ? company?.branding?.logo
      : company?.branding?.logoLight;

  const fallbackLogo =
    theme === "dark"
      ? company?.branding?.logoLight
      : company?.branding?.logo;

  const logoSrc =
    buildBrandingUrl(
      configuredLogo,
      repositoryConfig
    ) ||
    buildBrandingUrl(
      fallbackLogo,
      repositoryConfig
    );

  /*
   * ----------------------------------------------------------
   * Company website pages
   * ----------------------------------------------------------
   */

  const aboutUrl =
    buildCompanyPageUrl(
      companyWebsite,
      "about"
    );

  const privacyUrl =
    buildCompanyPageUrl(
      companyWebsite,
      "privacy-policy"
    );

  /*
   * ----------------------------------------------------------
   * Social links
   * ----------------------------------------------------------
   */

  const socialLinks = [
    {
      href:
        company?.social?.linkedin ||
        "",
      label: "LinkedIn",
      icon: <FaLinkedinIn />,
    },

    {
      href:
        company?.social?.youtube ||
        "",
      label: "YouTube",
      icon: <FaYoutube />,
    },

    {
      href:
        company?.social?.x ||
        "",
      label: "X / Twitter",
      icon: <FaXTwitter />,
    },

    {
      href:
        company?.social?.facebook ||
        "",
      label: "Facebook",
      icon: <FaFacebookF />,
    },

    {
      href:
        company?.social?.instagram ||
        "",
      label: "Instagram",
      icon: <FaInstagram />,
    },
  ].filter(
    (
      social
    ) => Boolean(social.href)
  );

  /*
   * ----------------------------------------------------------
   * Landing page design
   * ----------------------------------------------------------
   */

  const featureTones =
    design?.landing?.features;

  /*
   * ----------------------------------------------------------
   * Router prefetch
   * ----------------------------------------------------------
   */

  useEffect(() => {
    const targets =
      isAuthenticated
        ? ["/dashboard"]
        : [
            primaryHref,
            secondaryHref,
          ];

    targets.forEach(
      (href) => {
        void router.prefetch(
          href
        );
      }
    );
  }, [
    isAuthenticated,
    primaryHref,
    router,
    secondaryHref,
  ]);

  /*
   * ==========================================================
   * RENDER
   * ==========================================================
   */

  return (
    <div className="app-shell app-shell--home">

      {/* ======================================================
          HEADER
          ====================================================== */}

      <header
        className="page-main"
        style={{
          paddingBottom: 0,
        }}
      >
        <div className="card page-hero-card">
          <div
            className="page-hero-top"
            style={{
              gap: 14,
            }}
          >
            {logoSrc ? (
              <Image
                src={logoSrc}
                alt={companyName}
                width={1720}
                height={181}
                unoptimized
                style={{
                  width: 180,
                  maxWidth: "50vw",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            ) : (
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                }}
              >
                {companyShortName}
              </div>
            )}

            <button
              className="btn btn-outline"
              onClick={
                toggleTheme
              }
              type="button"
              style={{
                minWidth: 42,
              }}
            >
              {theme === "dark" ? (
                <FaSun />
              ) : (
                <FaMoon />
              )}

              <span className="hide-mobile">
                {theme === "dark"
                  ? "Light"
                  : "Dark"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================
          MAIN
          ====================================================== */}

      <main
        className="page-main"
        style={{
          paddingTop: 20,
        }}
      >
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
              flexDirection:
                "column",
              gap: 28,
            }}
          >

            {/* ==================================================
                HERO CONTENT
                ================================================== */}

            <div>
              <div
                className="landing-hero-badges"
                style={{
                  display: "flex",
                  flexWrap:
                    "wrap",
                  gap: 8,
                  marginBottom:
                    20,
                }}
              >
                <span className="badge">
                  Installable PWA
                </span>

                <span className="badge">
                  Offline reading
                </span>
              </div>

              {sessionExpired ? (
                <div
                  className="card"
                  style={{
                    marginBottom:
                      18,
                    padding:
                      "12px 14px",
                    borderRadius:
                      18,
                    fontSize:
                      14,
                    lineHeight:
                      1.6,
                  }}
                >
                  Your previous session ended.
                  Continue from the landing page
                  and choose login or signup to open
                  your dashboard again.
                </div>
              ) : null}

              <h1
                style={{
                  margin: 0,
                  fontSize:
                    "clamp(28px, 5vw, 48px)",
                  lineHeight: 1.1,
                  fontWeight: 900,
                  letterSpacing:
                    "-0.02em",
                }}
              >
                Your complete{" "}
                <span
                  style={{
                    background:
                      "var(--landing-hero-accent)",
                    WebkitBackgroundClip:
                      "text",
                    WebkitTextFillColor:
                      "transparent",
                  }}
                >
                  learning workspace
                </span>{" "}
                for tech careers.
              </h1>

              <p
                style={{
                  marginTop:
                    16,
                  maxWidth:
                    600,
                  fontSize:
                    "clamp(14px, 1.8vw, 17px)",
                  lineHeight:
                    1.75,
                  color:
                    "var(--muted)",
                }}
              >
                {
                  companyDescription
                }
              </p>

              <div
                className="landing-hero-actions"
                style={{
                  marginTop:
                    24,
                  display:
                    "flex",
                  flexWrap:
                    "wrap",
                  gap: 10,
                }}
              >
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() =>
                    router.push(
                      primaryHref
                    )
                  }
                  type="button"
                >
                  Sign Up{" "}
                  <FaArrowRight />
                </button>

                <button
                  className="btn btn-outline btn-lg"
                  onClick={() =>
                    router.push(
                      secondaryHref
                    )
                  }
                  type="button"
                >
                  Login
                </button>
              </div>
            </div>

            {/* ==================================================
                FEATURE CARDS
                ================================================== */}

            <div
              className="landing-feature-grid"
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 14,
              }}
            >
              {featureCards.map(
                (feature) => {
                  const tone =
                    featureTones?.[
                      feature.key
                    ];

                  const gradient =
                    tone?.gradient ||
                    "var(--card-bg)";

                  const iconBg =
                    tone?.iconBg ||
                    "var(--surface)";

                  const iconColor =
                    tone?.iconColor ||
                    "var(--foreground)";

                  return (
                    <div
                      key={
                        feature.key
                      }
                      className="feature-card-hover landing-feature-card"
                      style={{
                        padding:
                          "20px 18px",
                        borderRadius:
                          20,
                        border:
                          "1px solid var(--border)",
                        background:
                          gradient,
                        transition:
                          "transform 200ms ease, box-shadow 200ms ease",
                        cursor:
                          "default",
                      }}
                    >
                      <div
                        style={{
                          width:
                            44,
                          height:
                            44,
                          borderRadius:
                            14,
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          background:
                            iconBg,
                          color:
                            iconColor,
                          fontSize:
                            18,
                        }}
                      >
                        {
                          feature.icon
                        }
                      </div>

                      <div
                        style={{
                          marginTop:
                            14,
                          fontSize:
                            17,
                          fontWeight:
                            800,
                        }}
                      >
                        {
                          feature.title
                        }
                      </div>

                      <div
                        style={{
                          marginTop:
                            8,
                          fontSize:
                            14,
                          lineHeight:
                            1.65,
                          color:
                            "var(--muted)",
                        }}
                      >
                        {
                          feature.description
                        }
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ======================================================
          FOOTER
          ====================================================== */}

      <footer
        className="page-main"
        style={{
          paddingTop: 0,
          paddingBottom:
            28,
        }}
      >
        <div
          className="card page-hero-card landing-footer-card"
          style={{
            padding:
              "clamp(16px, 3vw, 24px)",
            borderRadius:
              28,
          }}
        >
          <div
            className="landing-footer-grid"
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 24,
            }}
          >

            {/* ==================================================
                COMPANY
                ================================================== */}

            <div>
              {logoSrc ? (
                <Image
                  src={logoSrc}
                  alt={companyName}
                  width={1720}
                  height={181}
                  unoptimized
                  style={{
                    width:
                      180,
                    height:
                      "auto",
                    objectFit:
                      "contain",
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize:
                      24,
                    fontWeight:
                      900,
                  }}
                >
                  {
                    companyShortName
                  }
                </div>
              )}

              <div
                style={{
                  marginTop:
                    12,
                  fontSize:
                    14,
                  lineHeight:
                    1.75,
                  color:
                    "var(--muted)",
                }}
              >
                {
                  companyDescription
                }
              </div>
            </div>

            {/* ==================================================
                EXPLORE
                ================================================== */}

            <div>
              <div
                style={{
                  fontSize:
                    16,
                  fontWeight:
                    800,
                }}
              >
                Explore
              </div>

              <div
                style={{
                  marginTop:
                    12,
                  display:
                    "grid",
                  gap: 10,
                  fontSize:
                    14,
                }}
              >
                <Link
                  href={
                    isAuthenticated
                      ? "/dashboard"
                      : "/signup"
                  }
                  style={{
                    color:
                      "inherit",
                    textDecoration:
                      "none",
                  }}
                >
                  Learning Dashboard
                </Link>

                <Link
                  href={
                    isAuthenticated
                      ? "/cbt"
                      : "/login"
                  }
                  style={{
                    color:
                      "inherit",
                    textDecoration:
                      "none",
                  }}
                >
                  CBT Hub
                </Link>

                {aboutUrl ? (
                  <a
                    href={
                      aboutUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color:
                        "inherit",
                      textDecoration:
                        "none",
                    }}
                  >
                    About{" "}
                    {
                      companyShortName
                    }
                  </a>
                ) : null}

                {privacyUrl ? (
                  <a
                    href={
                      privacyUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color:
                        "inherit",
                      textDecoration:
                        "none",
                    }}
                  >
                    Privacy Policy
                  </a>
                ) : null}
              </div>
            </div>

            {/* ==================================================
                CONTACT
                ================================================== */}

            <div>
              <div
                style={{
                  fontSize:
                    16,
                  fontWeight:
                    800,
                }}
              >
                Contact
              </div>

              <div
                style={{
                  marginTop:
                    12,
                  display:
                    "grid",
                  gap: 10,
                  fontSize:
                    14,
                  color:
                    "var(--muted)",
                }}
              >
                {companyEmail ? (
                  <a
                    href={`mailto:${companyEmail}`}
                    style={{
                      display:
                        "inline-flex",
                      alignItems:
                        "center",
                      gap: 8,
                      color:
                        "inherit",
                      textDecoration:
                        "none",
                    }}
                  >
                    <FaEnvelope />
                    {
                      companyEmail
                    }
                  </a>
                ) : null}

                {companyWebsite ? (
                  <a
                    href={
                      companyWebsite
                    }
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color:
                        "inherit",
                      textDecoration:
                        "none",
                    }}
                  >
                    {
                      companyWebsite
                    }
                  </a>
                ) : null}

                {!companyEmail &&
                !companyWebsite ? (
                  <div>
                    Contact information
                    is not configured.
                  </div>
                ) : null}
              </div>
            </div>

            {/* ==================================================
                SOCIAL
                ================================================== */}

            <div>
              <div
                style={{
                  fontSize:
                    16,
                  fontWeight:
                    800,
                }}
              >
                Follow
              </div>

              <div
                style={{
                  marginTop:
                    12,
                  display:
                    "flex",
                  flexWrap:
                    "wrap",
                  gap: 8,
                }}
              >
                {socialLinks.map(
                  (social) => (
                    <a
                      key={
                        social.label
                      }
                      href={
                        social.href
                      }
                      target="_blank"
                      rel="noreferrer"
                      aria-label={
                        social.label
                      }
                      className="btn btn-outline"
                      style={{
                        width:
                          40,
                        height:
                          40,
                        padding: 0,
                        borderRadius:
                          12,
                      }}
                      title={
                        social.label
                      }
                    >
                      {
                        social.icon
                      }
                    </a>
                  )
                )}

                {socialLinks.length ===
                0 ? (
                  <span
                    style={{
                      fontSize:
                        14,
                      color:
                        "var(--muted)",
                    }}
                  >
                    Social links are
                    not configured.
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* ====================================================
              FOOTER BOTTOM
              ==================================================== */}

          <div
            style={{
              marginTop:
                20,
              paddingTop:
                16,
              borderTop:
                "1px solid var(--border)",
              display:
                "flex",
              flexWrap:
                "wrap",
              alignItems:
                "center",
              justifyContent:
                "space-between",
              gap: 10,
              fontSize:
                12,
              color:
                "var(--muted)",
            }}
          >
            <div>
              &copy;{" "}
              {new Date().getFullYear()}{" "}
              {companyName}. All rights
              reserved.
            </div>

            <div
              style={{
                display:
                  "inline-flex",
                alignItems:
                  "center",
                gap: 8,
              }}
            >
              <FaStar />
              Learning, practice, and
              offline access in one PWA.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}