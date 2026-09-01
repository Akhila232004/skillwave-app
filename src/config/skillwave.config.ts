/*
 * ============================================================
 * SKILLWAVE UNIVERSAL SHELL CONFIGURATION
 * ============================================================
 *
 * This file is the central configuration for the company
 * application running on the SkillWave universal shell.
 *
 * Company-specific information belongs here.
 *
 * The application shell should use this configuration instead
 * of hardcoding company names, repositories, or content paths.
 */

export const skillwaveConfig = {
  /*
   * ============================================================
   * APPLICATION / COMPANY BRANDING
   * ============================================================
   */

  company: {
    name: "Tinitiate",

    legalName:
      "TINITIATE Technologies Pvt Ltd.",

    shortName: "Tinitiate",

    description:
      "Tinitiate AI Solutions helps learners grow with practical technology learning.",

    website:
      "https://tinitiate.com",

    contactEmail:
      "contact@tinitiateai.com",

    logo:
      "/branding/logo.png",

    logoLight:
      "/branding/logo-light.png",

    logoMark:
      "/branding/logo-mark.png",

    social: {
      linkedin:
        "https://www.linkedin.com/company/tinitiate/",

      x:
        "https://x.com/TinitiateAI",

      instagram:
        "https://www.instagram.com/tinitiate.ai/",
    },
  },

  /*
   * ============================================================
   * CONTENT REPOSITORY
   * ============================================================
   */

  contentRepository: {
    owner:
      "Akhila232004",

    repository:
      "tinitiateai-skillwave",

    branch:
      "main",
  },

  /*
   * ============================================================
   * CONTENT PATHS
   * ============================================================
   *
   * Keep these values as strings for compatibility with the
   * current content-loading layer.
   *
   * We will later update server-content.ts so these paths are
   * consumed centrally from this configuration.
   */

  contentPaths: {
    /*
     * Course root directory.
     */
    courses:
      "courses",

    /*
     * Course catalog file.
     */
    coursesCatalog:
      "courses/catalog.yaml",

    /*
     * Interview content directory.
     */
    interview:
      "interview",

    /*
     * Slideshow content directory.
     */
    slideshow:
      "slideshow",

    /*
     * Slideshow metadata file.
     */
    slideshowMetadata:
      "slideshow/av-metadata.yaml",

    /*
     * Training video content directory.
     */
    videos:
      "training-videos",

    /*
     * Training video metadata file.
     */
    videosMetadata:
      "training-videos/av-metadata.yaml",

    /*
     * Audio-book/audio content directory.
     */
    audio:
      "audio-books",

    /*
     * Audio metadata file.
     */
    audioMetadata:
      "audio-books/av-metadata.yaml",

    /*
     * Design directory.
     */
    design:
      "design",

    /*
     * Design colour configuration.
     */
    designColors:
      "design/colour.yaml",

    /*
     * Design icon configuration.
     */
    designIcons:
      "design/icon.yaml",

    /*
     * Dashboard directory.
     */
    dashboard:
      "dashboard",

    /*
     * Dashboard cards.
     */
    dashboardCards:
      "dashboard/cards.yaml",

    /*
     * News ticker directory.
     */
    ticker:
      "news-ticker",

    /*
     * News ticker feed.
     */
    tickerFeed:
      "news-ticker/feed.yaml",

    /*
     * CBT directory.
     */
    cbt:
      "cbt",
  },

  /*
   * ============================================================
   * APPLICATION FEATURES
   * ============================================================
   */

  features: {
    interview:
      true,

    courses:
      true,

    slideshow:
      true,

    videos:
      true,

    audio:
      true,

    dashboard:
      true,

    ticker:
      true,

    cbt:
      true,
  },
} as const;

/*
 * ============================================================
 * TYPE
 * ============================================================
 */

export type SkillWaveConfig =
  typeof skillwaveConfig;