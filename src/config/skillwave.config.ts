export const skillwaveConfig = {
  /*
   * ============================================================
   * APPLICATION / COMPANY BRANDING
   * ============================================================
   *
   * This section contains information that belongs to the
   * company using the universal shell.
   *
   * When creating an application for another company,
   * these values can be changed without changing the
   * application architecture.
   */
  company: {
    name: "Tinitiate",
    legalName: "TINITIATE Technologies Pvt Ltd.",
    shortName: "Tinitiate",

    description:
      "Tinitiate AI Solutions helps learners grow with practical technology learning.",

    website: "https://tinitiate.com",

    contactEmail: "contact@tinitiateai.com",

    logo: "/branding/logo.png",
    logoLight: "/branding/logo-light.png",
    logoMark: "/branding/logo-mark.png",

    social: {
      linkedin:
        "https://www.linkedin.com/company/tinitiate/",
      x: "https://x.com/TinitiateAI",
      instagram:
        "https://www.instagram.com/tinitiate.ai/",
    },
  },

  /*
   * ============================================================
   * CONTENT REPOSITORY
   * ============================================================
   *
   * This tells the shell where the company's learning
   * content is stored.
   *
   * For another company, change only these values to point
   * to that company's content repository.
   */
  contentRepository: {
    owner: "Akhila232004",
    repository: "tinitiateai-skillwave",
    branch: "main",
  },

  /*
   * ============================================================
   * CONTENT STRUCTURE
   * ============================================================
   *
   * These paths describe the structure inside the company's
   * content repository.
   *
   * The shell reads content using these paths instead of
   * hardcoding company-specific repository folders.
   */
  contentPaths: {
    interview: "interview",
    courses: "courses",
    slideshow: "slideshow",
    videos: "videos",
    audio: "audio",
  },

  /*
   * ============================================================
   * APPLICATION FEATURES
   * ============================================================
   *
   * These switches determine which modules are available
   * for the current company application.
   *
   * Example:
   *
   * Company A:
   * courses = true
   * interview = true
   * videos = true
   *
   * Company B:
   * courses = true
   * interview = false
   * videos = false
   */
  features: {
    interview: true,
    courses: true,
    slideshow: true,
    videos: true,
    audio: true,
  },
} as const;

export type SkillWaveConfig =
  typeof skillwaveConfig;