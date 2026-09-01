/*
 * ============================================================
 * SKILLWAVE UNIVERSAL SHELL CONFIGURATION
 * ============================================================
 *
 * This file is the central configuration for the application
 * running on the SkillWave universal shell.
 *
 * Company-specific information belongs here.
 *
 * The application shell should use this configuration instead
 * of hardcoding company names, repositories, branding assets,
 * or content paths.
 *
 * When creating an application for another company, the goal is
 * to change this configuration rather than the application
 * architecture.
 */

export const skillwaveConfig = {
  /*
   * ============================================================
   * APPLICATION / COMPANY BRANDING
   * ============================================================
   *
   * All branding-related information for the current company
   * is defined here.
   *
   * IMPORTANT:
   *
   * These paths are relative to the Next.js `public` directory.
   *
   * Current Tinitiate files:
   *
   * public/
   * ├── TinitiateLogo.png
   * ├── TinitiateLogoLight.png
   * └── TinitiateLogoMark.png
   *
   * Therefore the browser paths are:
   *
   * /TinitiateLogo.png
   * /TinitiateLogoLight.png
   * /TinitiateLogoMark.png
   *
   * When creating another company's application, these values
   * can be changed to that company's branding files.
   */

  company: {
    /*
     * Company display name.
     */
    name: "Tinitiate",

    /*
     * Full legal/company name.
     */
    legalName:
      "TINITIATE Technologies Pvt Ltd.",

    /*
     * Short company name.
     */
    shortName: "Tinitiate",

    /*
     * Company/application description.
     */
    description:
      "Tinitiate AI Solutions helps learners grow with practical technology learning.",

    /*
     * Company website.
     */
    website:
      "https://tinitiate.com",

    /*
     * Company contact email.
     */
    contactEmail:
      "contact@tinitiateai.com",

    /*
     * Main company logo.
     *
     * This file exists at:
     *
     * public/TinitiateLogo.png
     */
    logo:
      "/TinitiateLogo.png",

    /*
     * Light-theme / alternate logo.
     *
     * This file exists at:
     *
     * public/TinitiateLogoLight.png
     */
    logoLight:
      "/TinitiateLogoLight.png",

    /*
     * Compact logo / logo mark.
     *
     * This file exists at:
     *
     * public/TinitiateLogoMark.png
     */
    logoMark:
      "/TinitiateLogoMark.png",

    /*
     * Company social-media links.
     */
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
   *
   * This defines where the company's application content lives.
   *
   * The shell should not hardcode the repository in individual
   * pages or content components.
   *
   * For another company, these values can point to that
   * company's content repository.
   */

  contentRepository: {
    /*
     * GitHub repository owner.
     */
    owner:
      "Akhila232004",

    /*
     * GitHub repository containing the current company's
     * SkillWave content.
     */
    repository:
      "tinitiateai-skillwave",

    /*
     * Branch containing the application content.
     */
    branch:
      "main",
  },

  /*
   * ============================================================
   * CONTENT PATHS
   * ============================================================
   *
   * These paths describe the content structure inside the
   * configured content repository.
   *
   * Pages and server-side content loaders should use these
   * configuration values instead of hardcoding company-specific
   * repository paths.
   *
   * The current Tinitiate repository uses the following
   * structure:
   *
   * courses/
   * interview/
   * cbt/
   * training-videos/
   * audio-books/
   * slideshow/
   * design/
   * dashboard/
   * news-ticker/
   */

  contentPaths: {
    /*
     * ----------------------------------------------------------
     * COURSES
     * ----------------------------------------------------------
     */

    /*
     * Root directory containing course content.
     */
    courses:
      "courses",

    /*
     * Course catalog.
     */
    coursesCatalog:
      "courses/catalog.yaml",

    /*
     * ----------------------------------------------------------
     * INTERVIEW
     * ----------------------------------------------------------
     */

    /*
     * Root directory containing interview content.
     */
    interview:
      "interview",

    /*
     * ----------------------------------------------------------
     * SLIDESHOW
     * ----------------------------------------------------------
     */

    /*
     * Slideshow directory.
     */
    slideshow:
      "slideshow",

    /*
     * Slideshow metadata file.
     */
    slideshowMetadata:
      "slideshow/av-metadata.yaml",

    /*
     * ----------------------------------------------------------
     * TRAINING VIDEOS
     * ----------------------------------------------------------
     */

    /*
     * Training-video directory.
     */
    videos:
      "training-videos",

    /*
     * Training-video metadata.
     */
    videosMetadata:
      "training-videos/av-metadata.yaml",

    /*
     * ----------------------------------------------------------
     * AUDIO
     * ----------------------------------------------------------
     */

    /*
     * Audio-book/audio directory.
     */
    audio:
      "audio-books",

    /*
     * Audio metadata.
     */
    audioMetadata:
      "audio-books/av-metadata.yaml",

    /*
     * ----------------------------------------------------------
     * DESIGN
     * ----------------------------------------------------------
     */

    /*
     * Design configuration directory.
     */
    design:
      "design",

    /*
     * Colour configuration.
     */
    designColors:
      "design/colour.yaml",

    /*
     * Icon configuration.
     */
    designIcons:
      "design/icon.yaml",

    /*
     * ----------------------------------------------------------
     * DASHBOARD
     * ----------------------------------------------------------
     */

    /*
     * Dashboard directory.
     */
    dashboard:
      "dashboard",

    /*
     * Dashboard cards directory.
     */
    dashboardCards:
      "dashboard/cards",

    /*
     * ----------------------------------------------------------
     * NEWS TICKER
     * ----------------------------------------------------------
     */

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
     * ----------------------------------------------------------
     * CBT
     * ----------------------------------------------------------
     */

    /*
     * CBT root directory.
     */
    cbt:
      "cbt",
  },

  /*
   * ============================================================
   * APPLICATION FEATURES
   * ============================================================
   *
   * These feature flags control which modules are enabled for
   * the current company application.
   *
   * This allows the same shell to support companies with
   * different content requirements.
   *
   * Example:
   *
   * Company A:
   *
   * courses  = true
   * interview = true
   * cbt      = true
   * videos   = true
   *
   * Company B:
   *
   * courses  = true
   * interview = false
   * cbt      = false
   * videos   = true
   */

  features: {
    /*
     * Interview question module.
     */
    interview:
      true,

    /*
     * Courses module.
     */
    courses:
      true,

    /*
     * Slideshow module.
     */
    slideshow:
      true,

    /*
     * Training-video module.
     */
    videos:
      true,

    /*
     * Audio module.
     */
    audio:
      true,

    /*
     * Dashboard module.
     */
    dashboard:
      true,

    /*
     * News ticker.
     */
    ticker:
      true,

    /*
     * CBT module.
     */
    cbt:
      true,
  },
} as const;

/*
 * ============================================================
 * TYPE
 * ============================================================
 *
 * Provides a TypeScript type representing the complete
 * SkillWave configuration.
 */

export type SkillWaveConfig =
  typeof skillwaveConfig;