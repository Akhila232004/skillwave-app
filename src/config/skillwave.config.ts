export const skillwaveConfig = {
  contentRepository: {
    owner: "Akhila232004",
    repository: "tinitiateai-skillwave",
    branch: "main",
  },

  contentPaths: {
    interview: "interview",
    courses: "courses",
    slideshow: "slideshow",
    videos: "videos",
    audio: "audio",
  },

  features: {
    interview: true,
    courses: true,
    slideshow: true,
    videos: true,
    audio: true,
  },
} as const;

export type SkillWaveConfig = typeof skillwaveConfig;