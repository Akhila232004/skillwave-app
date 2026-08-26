import Head from "next/head";
import Link from "next/link";
import type { AppProps } from "next/app";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { FaBookOpen, FaHome, FaLayerGroup, FaUserTie } from "react-icons/fa";
import "../styles/globals.css";

import { SessionProvider, useSession } from "next-auth/react";
import { DesignContext } from "../context/DesignContext";
import { ThemeContext, Theme } from "../context/ThemeContext";
import { markBrowserSessionActive } from "../lib/browserSession";
import { useAppSession, writeCachedSessionUser } from "../lib/app-session";
import { fetchDesignConfig, warmCoreContent } from "../lib/content-client";
import type { DesignSystem } from "../lib/content-types";
import {
  readPersistedDesignConfig,
  writePersistedDesignConfig,
} from "../lib/design-cache";
import { recordAppRoute } from "../lib/navigation";
import { syncCoreOfflineSections, syncOfflineWorkspace } from "../lib/offline-sync";
import { registerPwaServiceWorker, teardownDisabledPwa } from "../lib/pwa";

const enablePwaInDev = process.env.NEXT_PUBLIC_ENABLE_PWA_DEV === "true";
const shouldRunPwaBackgroundTasks = process.env.NODE_ENV === "production" || enablePwaInDev;
const PWA_DEV_TEARDOWN_RELOAD_KEY = "tinitiate.pwa.dev-teardown-reloaded.v2";

const markDevPwaTeardownReload = () => {
  try {
    if (window.localStorage.getItem(PWA_DEV_TEARDOWN_RELOAD_KEY) === "1") {
      return false;
    }

    window.localStorage.setItem(PWA_DEV_TEARDOWN_RELOAD_KEY, "1");
    return true;
  } catch {
    try {
      if (window.sessionStorage.getItem(PWA_DEV_TEARDOWN_RELOAD_KEY) === "1") {
        return false;
      }

      window.sessionStorage.setItem(PWA_DEV_TEARDOWN_RELOAD_KEY, "1");
      return true;
    } catch {
      return false;
    }
  }
};

const toCssVarKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const applyCssVariables = (design: DesignSystem, theme: Theme) => {
  const root = document.documentElement;
  const themeTokens = design.theme[theme];

  const variables: Record<string, string> = {
    "--bg": themeTokens.bg,
    "--surface": themeTokens.surface,
    "--surface-2": themeTokens.surfaceAlt,
    "--border": themeTokens.border,
    "--text": themeTokens.text,
    "--muted": themeTokens.muted,
    "--brand": themeTokens.brand,
    "--brand-strong": themeTokens.brandStrong,
    "--brand-2": themeTokens.primary,
    "--primary-strong": themeTokens.primaryStrong,
    "--primary-text": themeTokens.primaryText,
    "--focus": themeTokens.focus,
    "--selection": themeTokens.selection,
    "--outline-hover-bg": themeTokens.outlineHoverBg,
    "--outline-hover-border": themeTokens.outlineHoverBorder,
    "--badge-bg": themeTokens.badgeBg,
    "--chip-bg": themeTokens.chipBg,
    "--ticker-bg-start": themeTokens.tickerBgStart,
    "--ticker-bg-end": themeTokens.tickerBgEnd,
    "--code-bg": themeTokens.codeBg,
    "--scrollbar": themeTokens.scrollbar,
    "--shadow-card": themeTokens.shadowCard,
    "--shadow-feature": themeTokens.shadowFeature,
    "--shadow-primary": themeTokens.shadowPrimary,
    "--shadow-primary-hover": themeTokens.shadowPrimaryHover,
    "--search-focus-shadow": themeTokens.searchFocusShadow,
    "--search-focus-border": themeTokens.searchFocusBorder,
    "--page-bg-default":
      theme === "dark"
        ? design.pageBackgrounds.defaultDark
        : design.pageBackgrounds.defaultLight,
    "--page-bg-home":
      theme === "dark" ? design.pageBackgrounds.homeDark : design.pageBackgrounds.homeLight,
    "--page-bg-dashboard":
      theme === "dark"
        ? design.pageBackgrounds.dashboardDark
        : design.pageBackgrounds.dashboardLight,
    "--dashboard-header-bg":
      theme === "dark" ? design.dashboard.headerDark : design.dashboard.headerLight,
    "--dashboard-header-border":
      theme === "dark"
        ? design.dashboard.headerBorderDark
        : design.dashboard.headerBorderLight,
    "--status-online-color": design.dashboard.online.color,
    "--status-online-background": design.dashboard.online.background,
    "--status-online-border": design.dashboard.online.border,
    "--status-offline-color": design.dashboard.offline.color,
    "--status-offline-background": design.dashboard.offline.background,
    "--status-offline-border": design.dashboard.offline.border,
    "--dashboard-avatar-bg": design.dashboard.profile.avatarBackground,
    "--dashboard-avatar-text": design.dashboard.profile.avatarText,
    "--dashboard-overlay": design.dashboard.overlay,
    "--dashboard-library-favorites-color": design.dashboard.libraryFavorites.color,
    "--dashboard-library-favorites-background":
      theme === "dark"
        ? design.dashboard.libraryFavorites.backgroundDark
        : design.dashboard.libraryFavorites.backgroundLight,
    "--dashboard-library-favorites-border": design.dashboard.libraryFavorites.border,
    "--dashboard-library-offline-color": design.dashboard.libraryOffline.color,
    "--dashboard-library-offline-background":
      theme === "dark"
        ? design.dashboard.libraryOffline.backgroundDark
        : design.dashboard.libraryOffline.backgroundLight,
    "--dashboard-library-offline-border": design.dashboard.libraryOffline.border,
    "--dashboard-section-interview-accent": design.dashboard.sections.interview.accent,
    "--dashboard-section-interview-surface":
      theme === "dark"
        ? design.dashboard.sections.interview.surfaceDark
        : design.dashboard.sections.interview.surfaceLight,
    "--dashboard-section-courses-accent": design.dashboard.sections.courses.accent,
    "--dashboard-section-courses-surface":
      theme === "dark"
        ? design.dashboard.sections.courses.surfaceDark
        : design.dashboard.sections.courses.surfaceLight,
    "--dashboard-section-cbt-accent": design.dashboard.sections.cbt.accent,
    "--dashboard-section-cbt-surface":
      theme === "dark"
        ? design.dashboard.sections.cbt.surfaceDark
        : design.dashboard.sections.cbt.surfaceLight,
    "--course-card-bg":
      theme === "dark"
        ? design.courses.cardBackgroundDark
        : design.courses.cardBackgroundLight,
    "--landing-hero-accent": design.landing.heroAccentGradient,
  };

  Object.entries(design.courses.categoryTones).forEach(([key, tone]) => {
    const varKey = toCssVarKey(key);
    variables[`--course-tone-${varKey}-background`] = tone.background;
    variables[`--course-tone-${varKey}-border`] = tone.border;
    variables[`--course-tone-${varKey}-color`] = tone.color;
  });

  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

function ScrollProgressIndicator() {
  const [pageProgress, setPageProgress] = useState(0);
  const [pageScrollable, setPageScrollable] = useState(false);
  const [pageAtEnd, setPageAtEnd] = useState(false);

  useEffect(() => {
    const END_THRESHOLD = 1;

    const isElementScrollable = (element: HTMLElement) => {
      const style = window.getComputedStyle(element);
      const overflowY = style.overflowY;

      return (
        element.scrollHeight > element.clientHeight + END_THRESHOLD &&
        (overflowY === "auto" ||
          overflowY === "scroll" ||
          overflowY === "overlay")
      );
    };

    const updateElementState = (element: HTMLElement) => {
      if (!isElementScrollable(element)) {
        element.classList.remove(
          "tinitiate-scrollable",
          "tinitiate-scroll-at-end"
        );
        return;
      }

      const maxScroll = element.scrollHeight - element.clientHeight;
      const scrollTop = element.scrollTop;

      /*
       * The side scrollbar is considered
       * to be at an endpoint when it reaches
       * either the top OR the bottom.
       */
      const atTop = scrollTop <= END_THRESHOLD;

      const atBottom =
        maxScroll <= END_THRESHOLD ||
        scrollTop >= maxScroll - END_THRESHOLD;

      const atEndpoint = atTop || atBottom;

      element.classList.add("tinitiate-scrollable");

      element.classList.toggle(
        "tinitiate-scroll-at-end",
        atEndpoint
      );
    };

    const updatePageState = () => {
      const root = document.documentElement;
      const maxScroll = root.scrollHeight - window.innerHeight;

      if (maxScroll <= END_THRESHOLD) {
        setPageScrollable(false);
        setPageProgress(0);
        setPageAtEnd(false);

        root.classList.remove(
          "tinitiate-page-scrollable",
          "tinitiate-page-scroll-at-end"
        );
        return;
      }

      const scrollTop = window.scrollY || root.scrollTop;

      const progress = Math.min(
        100,
        Math.max(
          0,
          (scrollTop / maxScroll) * 100
        )
      );

      /*
       * Keep the existing top progress
       * indicator behavior: it becomes
       * an end state only at the bottom.
       */
      const atEnd =
        scrollTop >=
        maxScroll - END_THRESHOLD;

      setPageScrollable(true);
      setPageProgress(progress);
      setPageAtEnd(atEnd);

      root.classList.add(
        "tinitiate-page-scrollable"
      );

      root.classList.toggle(
        "tinitiate-page-scroll-at-end",
        atEnd
      );
    };

    const scanElements = () => {
      document
        .querySelectorAll<HTMLElement>("*")
        .forEach(updateElementState);

      updatePageState();
    };

    let frameId: number | null = null;

    const scheduleUpdate = () => {
      if (frameId !== null) {
        return;
      }

      frameId =
        window.requestAnimationFrame(() => {
          frameId = null;
          scanElements();
        });
    };

    const handleScroll = (event: Event) => {
      const target = event.target;

      if (target instanceof HTMLElement) {
        updateElementState(target);
      }

      updatePageState();
    };

    scanElements();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
        capture: true,
      }
    );

    window.addEventListener(
      "resize",
      scheduleUpdate
    );

    const mutationObserver =
      new MutationObserver(
        scheduleUpdate
      );

    mutationObserver.observe(
      document.body,
      {
        childList: true,
        subtree: true,
      }
    );

    const resizeObserver =
      new ResizeObserver(
        scheduleUpdate
      );

    resizeObserver.observe(
      document.documentElement
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
        true
      );

      window.removeEventListener(
        "resize",
        scheduleUpdate
      );

      if (frameId !== null) {
        window.cancelAnimationFrame(
          frameId
        );
      }

      mutationObserver.disconnect();
      resizeObserver.disconnect();

      document.documentElement.classList.remove(
        "tinitiate-page-scrollable",
        "tinitiate-page-scroll-at-end"
      );

      document
        .querySelectorAll<HTMLElement>(
          ".tinitiate-scrollable"
        )
        .forEach((element) => {
          element.classList.remove(
            "tinitiate-scrollable",
            "tinitiate-scroll-at-end"
          );
        });
    };
  }, []);

  return pageScrollable ? (
    <div
      className={`tinitiate-top-scroll-progress${
        pageAtEnd
          ? " tinitiate-top-scroll-progress--end"
          : ""
      }`}
      aria-hidden="true"
    >
      <div
        className="tinitiate-top-scroll-progress__fill"
        style={{
          width: `${pageProgress}%`,
        }}
      />
    </div>
  ) : null;
}

function SessionLifetimeGuard() {
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      markBrowserSessionActive();
    }
  }, [status]);

  return null;
}

function RouteHistoryController() {
  const router = useRouter();

  useEffect(() => {
    recordAppRoute(router.asPath);

    const handleRouteComplete = (
      url: string
    ) => {
      recordAppRoute(url);
    };

    router.events.on(
      "routeChangeComplete",
      handleRouteComplete
    );

    return () => {
      router.events.off(
        "routeChangeComplete",
        handleRouteComplete
      );
    };
  }, [router]);

  return null;
}

function OfflineWorkspaceController() {
  const router = useRouter();
  const {
    data: session,
    status,
  } = useSession();

  const syncStartedRef =
    useRef(false);

  const initialSyncCompletedRef =
    useRef(false);

  const initialSyncAttemptedRef =
    useRef(false);

  useEffect(() => {
    if (status === "authenticated") {
      writeCachedSessionUser(
        session?.user
      );
    }
  }, [session?.user, status]);

  useEffect(() => {
    if (!shouldRunPwaBackgroundTasks) {
      syncStartedRef.current = false;
      initialSyncCompletedRef.current =
        false;
      initialSyncAttemptedRef.current =
        false;

      return;
    }

    if (status !== "authenticated") {
      if (
        typeof navigator ===
          "undefined" ||
        navigator.onLine
      ) {
        syncStartedRef.current =
          false;

        initialSyncCompletedRef.current =
          false;

        initialSyncAttemptedRef.current =
          false;
      }

      return;
    }

    let idleCallbackId:
      | number
      | null = null;

    let timeoutId:
      | number
      | null = null;

    let retryTimeoutId:
      | number
      | null = null;

    let scheduleSync: (
      force?: boolean
    ) => void = () => undefined;

    const runSync = (
      force = false
    ) => {
      if (
        !navigator.onLine ||
        syncStartedRef.current
      ) {
        return;
      }

      if (
        !force &&
        initialSyncCompletedRef.current
      ) {
        return;
      }

      if (
        !force &&
        initialSyncAttemptedRef.current
      ) {
        return;
      }

      syncStartedRef.current = true;
      initialSyncAttemptedRef.current =
        true;

      Promise.all([
        syncCoreOfflineSections(
          router
        ).catch(() => undefined),

        syncOfflineWorkspace(
          router
        ),
      ])
        .then(() => {
          initialSyncCompletedRef.current =
            true;
        })
        .catch(() => {
          initialSyncCompletedRef.current =
            false;

          initialSyncAttemptedRef.current =
            false;

          if (navigator.onLine) {
            if (
              retryTimeoutId !== null
            ) {
              window.clearTimeout(
                retryTimeoutId
              );
            }

            retryTimeoutId =
              window.setTimeout(() => {
                retryTimeoutId = null;
                scheduleSync(true);
              }, 2500);
          }
        })
        .finally(() => {
          syncStartedRef.current =
            false;
        });
    };

    const clearScheduledSync = () => {
      if (
        idleCallbackId !== null &&
        typeof window.cancelIdleCallback ===
          "function"
      ) {
        window.cancelIdleCallback(
          idleCallbackId
        );

        idleCallbackId = null;
      }

      if (timeoutId !== null) {
        window.clearTimeout(
          timeoutId
        );

        timeoutId = null;
      }

      if (
        retryTimeoutId !== null
      ) {
        window.clearTimeout(
          retryTimeoutId
        );

        retryTimeoutId = null;
      }
    };

    scheduleSync = (
      force = false
    ) => {
      clearScheduledSync();

      const delay = force
        ? 600
        : 900;

      const startSync = () => {
        idleCallbackId = null;
        timeoutId = null;
        runSync(force);
      };

      if (
        typeof window.requestIdleCallback ===
        "function"
      ) {
        idleCallbackId =
          window.requestIdleCallback(
            startSync,
            {
              timeout: delay,
            }
          );

        return;
      }

      timeoutId =
        window.setTimeout(
          startSync,
          delay
        );
    };

    scheduleSync();

    const handleOnline = () => {
      initialSyncAttemptedRef.current =
        false;

      scheduleSync(true);
    };

    window.addEventListener(
      "online",
      handleOnline
    );

    return () => {
      clearScheduledSync();

      window.removeEventListener(
        "online",
        handleOnline
      );
    };
  }, [
    router,
    router.pathname,
    status,
  ]);

  return null;
}

function CoreContentWarmupController() {
  const router = useRouter();
  const { status } =
    useSession();

  const warmedRef =
    useRef(false);

  useEffect(() => {
    if (!shouldRunPwaBackgroundTasks) {
      warmedRef.current = false;
      return;
    }

    if (status !== "authenticated") {
      warmedRef.current = false;
      return;
    }

    if (
      !navigator.onLine ||
      warmedRef.current
    ) {
      return;
    }

    warmedRef.current = true;

    void warmCoreContent().catch(
      () => {
        warmedRef.current = false;
      }
    );
  }, [
    router.pathname,
    status,
  ]);

  useEffect(() => {
    if (!shouldRunPwaBackgroundTasks) {
      return;
    }

    if (status !== "authenticated") {
      return;
    }

    const handleOnline = () => {
      if (warmedRef.current) {
        return;
      }

      warmedRef.current = true;

      void warmCoreContent().catch(
        () => {
          warmedRef.current = false;
        }
      );
    };

    window.addEventListener(
      "online",
      handleOnline
    );

    return () => {
      window.removeEventListener(
        "online",
        handleOnline
      );
    };
  }, [status]);

  return null;
}

const mobileNavItems = [
  {
    href: "/dashboard",
    label: "Home",
    icon: FaHome,
    matches: [
      "/dashboard",
    ],
  },
  {
    href: "/courses",
    label: "Courses",
    icon: FaBookOpen,
    matches: [
      "/courses",
      "/subject/[subject]",
      "/topic/[topic]",
    ],
  },
  {
    href: "/interview",
    label: "Interview",
    icon: FaUserTie,
    matches: [
      "/interview",
      "/interview/[slug]",
    ],
  },
  {
    href: "/cbt",
    label: "CBT",
    icon: FaLayerGroup,
    matches: [
      "/cbt",
      "/cbt/slides/[slug]",
      "/cbt/media/[slug]",
    ],
  },
];

function MobileAppNav() {
  const router =
    useRouter();

  const { status } =
    useAppSession();

  const publicRoute =
    router.pathname === "/" ||
    router.pathname === "/login" ||
    router.pathname === "/signup";

  if (
    status !== "authenticated" ||
    publicRoute
  ) {
    return null;
  }

  return (
    <nav
      className="mobile-app-nav"
      aria-label="Primary app navigation"
    >
      {mobileNavItems.map(
        (item) => {
          const Icon =
            item.icon;

          const isActive =
            item.matches.includes(
              router.pathname
            );

          return (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-app-nav__item"
              aria-current={
                isActive
                  ? "page"
                  : undefined
              }
            >
              <span className="mobile-app-nav__icon">
                <Icon />
              </span>

              <span className="mobile-app-nav__label">
                {item.label}
              </span>
            </Link>
          );
        }
      )}
    </nav>
  );
}

export default function App({
  Component,
  pageProps,
}: AppProps) {
  const [theme, setTheme] =
    useState<Theme>("light");

  const [design, setDesign] =
    useState<DesignSystem | null>(
      null
    );

  const [designError, setDesignError] =
    useState("");

  const [designHydrated, setDesignHydrated] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);

    const saved =
      localStorage.getItem(
        "theme"
      ) as Theme | null;

    if (saved) {
      setTheme(saved);
    } else {
      setTheme(
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches
          ? "dark"
          : "light"
      );
    }
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );

    localStorage.setItem(
      "theme",
      theme
    );

    if (design) {
      applyCssVariables(
        design,
        theme
      );
    }
  }, [
    design,
    theme,
    mounted,
  ]);

  useEffect(() => {
    const persistedDesign =
      readPersistedDesignConfig();

    if (persistedDesign) {
      setDesign(
        persistedDesign
      );
    }

    setDesignHydrated(
      true
    );
  }, []);

  useEffect(() => {
    const controller =
      new AbortController();

    let cancelled = false;

    fetchDesignConfig(
      controller.signal,
      {
        strategy:
          "network-first",
      }
    )
      .then(
        (nextDesign) => {
          if (cancelled) {
            return;
          }

          const currentTheme =
            document.documentElement.classList.contains(
              "dark"
            )
              ? "dark"
              : "light";

          applyCssVariables(
            nextDesign,
            currentTheme
          );

          writePersistedDesignConfig(
            nextDesign
          );

          setDesign(
            nextDesign
          );

          setDesignError("");
        }
      )
      .catch(
        (error: unknown) => {
          if (cancelled) {
            return;
          }

          if (
            readPersistedDesignConfig()
          ) {
            return;
          }

          setDesignError(
            error instanceof Error
              ? error.message
              : "Failed to load design configuration from GitHub."
          );
        }
      );

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  // SW registration unchanged
  useEffect(() => {
    if (
      !(
        "serviceWorker" in
        navigator
      )
    ) {
      return;
    }

    const shouldRegister =
      process.env.NODE_ENV ===
        "production" ||
      enablePwaInDev;

    if (!shouldRegister) {
      void teardownDisabledPwa()
        .then(
          ({
            shouldReload,
          }) => {
            if (
              !shouldReload
            ) {
              return;
            }

            if (
              markDevPwaTeardownReload()
            ) {
              window.location.reload();
            }
          }
        )
        .catch(
          console.error
        );

      return;
    }

    void registerPwaServiceWorker()
      .catch(
        console.error
      );
  }, []);

  const themeColor =
    design?.theme[theme].bg;

  const renderDesignState =
    () => {
      if (design) {
        return (
          <Component
            {...pageProps}
          />
        );
      }

      if (!designHydrated) {
        return (
          <div
            style={{
              minHeight:
                "100vh",
              display:
                "grid",
              placeItems:
                "center",
              padding: 24,
              textAlign:
                "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                Loading...
              </div>
            </div>
          </div>
        );
      }

      if (designError) {
        return (
          <div
            style={{
              minHeight:
                "100vh",
              display:
                "grid",
              placeItems:
                "center",
              padding: 24,
              textAlign:
                "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                Design config not available
              </div>

              <div
                style={{
                  marginTop: 10,
                  maxWidth: 620,
                  lineHeight: 1.6,
                }}
              >
                Push `design/colour.yaml`,
                `design/icon.yaml`,
                and
                `design/course-icons/*`
                to the content repo,
                then refresh the app.
              </div>

              <div
                style={{
                  marginTop: 10,
                  maxWidth: 760,
                  lineHeight: 1.6,
                }}
              >
                {designError}
              </div>
            </div>
          </div>
        );
      }

      return (
        <div
          style={{
            minHeight:
              "100vh",
            display:
              "grid",
            placeItems:
              "center",
            padding: 24,
            textAlign:
              "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Loading...
            </div>
          </div>
        </div>
      );
    };

  return (
    <SessionProvider
      session={
        (pageProps as any)
          .session
      }
      refetchWhenOffline={
        false
      }
      refetchOnWindowFocus={
        false
      }
    >
      <RouteHistoryController />

      <ScrollProgressIndicator />

      <SessionLifetimeGuard />

      <CoreContentWarmupController />

      <OfflineWorkspaceController />

      <ThemeContext.Provider
        value={{
          theme,
          toggleTheme: () =>
            setTheme(
              (p) =>
                p === "light"
                  ? "dark"
                  : "light"
            ),
        }}
      >
        <DesignContext.Provider
          value={{
            design,
          }}
        >
          <Head>
            <meta
              name="viewport"
              content="width=device-width,initial-scale=1"
            />

            <meta
              name="description"
              content="Tinitiate learning PWA for courses, interview preparation, CBT content, favorites, and offline-ready reading."
            />

            {themeColor ? (
              <meta
                name="theme-color"
                content={
                  themeColor
                }
              />
            ) : null}
          </Head>

          {renderDesignState()}

          <MobileAppNav />
        </DesignContext.Provider>
      </ThemeContext.Provider>
    </SessionProvider>
  );
}