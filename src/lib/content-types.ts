import type { ParsedTopic } from "./readme-utils";

export type TickerItem = {
  id: string;
  kind: "jobs" | "trending-technologies" | "events";
  label: string;
  title: string;
  href: string;
  priority: number;
};

export type InterviewQuestionSummary = {
  slug: string;
  title: string;
  category: string;
  level: string;
  question: string;
  tags: string[];
  excerpt: string;
  questionCount?: number;
};

export type InterviewCourseQuestion = {
  slug: string;
  title: string;
  level: string;
  question: string;
  tags: string[];
  excerpt: string;
  markdown: string;
  markdown_url?: string;
};

export type InterviewQuestionDetail = InterviewQuestionSummary & {
  markdown: string;
  markdown_url?: string;
  questions?: InterviewCourseQuestion[];
};

export type CourseCatalogEntry = {
  slug: string;
  title: string;
  category: string;
  level: string;
  summary: string;
  readmePath: string;
};

export type CourseSubject = CourseCatalogEntry & {
  subject: string;
  readme_url: string;
  icon_url?: string;
  topics: ParsedTopic[];
};

export type DesignThemeTokens = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  muted: string;
  brand: string;
  brandStrong: string;
  primary: string;
  primaryStrong: string;
  primaryText: string;
  focus: string;
  selection: string;
  outlineHoverBg: string;
  outlineHoverBorder: string;
  badgeBg: string;
  chipBg: string;
  tickerBgStart: string;
  tickerBgEnd: string;
  codeBg: string;
  scrollbar: string;
  shadowCard: string;
  shadowFeature: string;
  shadowPrimary: string;
  shadowPrimaryHover: string;
  searchFocusShadow: string;
  searchFocusBorder: string;
};

export type PageBackgrounds = {
  defaultLight: string;
  defaultDark: string;
  homeLight: string;
  homeDark: string;
  dashboardLight: string;
  dashboardDark: string;
};

export type DashboardStatusTone = {
  color: string;
  background: string;
  border: string;
};

export type DashboardSectionTone = {
  accent: string;
  surfaceLight: string;
  surfaceDark: string;
};

export type DashboardDesignConfig = {
  headerLight: string;
  headerDark: string;
  headerBorderLight: string;
  headerBorderDark: string;
  online: DashboardStatusTone;
  offline: DashboardStatusTone;
  profile: {
    avatarBackground: string;
    avatarText: string;
  };
  overlay: string;
  libraryFavorites: {
    color: string;
    backgroundLight: string;
    backgroundDark: string;
    border: string;
  };
  libraryOffline: {
    color: string;
    backgroundLight: string;
    backgroundDark: string;
    border: string;
  };
  sections: {
    interview: DashboardSectionTone;
    courses: DashboardSectionTone;
    cbt: DashboardSectionTone;
  };
};

export type CategoryTone = {
  background: string;
  border: string;
  color: string;
};

export type CoursesDesignConfig = {
  cardBackgroundLight: string;
  cardBackgroundDark: string;
  categoryTones: Record<string, CategoryTone>;
};

export type LandingFeatureTone = {
  gradient: string;
  iconBg: string;
  iconColor: string;
};

export type LandingDesignConfig = {
  heroAccentGradient: string;
  features: {
    structuredCourses: LandingFeatureTone;
    interviewPractice: LandingFeatureTone;
    offlineReady: LandingFeatureTone;
    cbtHub: LandingFeatureTone;
  };
};

export type MobileDesignConfig = {
  quickNavSurfaceLight: string;
  quickNavSurfaceDark: string;
  quickNavBorderLight: string;
  quickNavBorderDark: string;
  quickNavShadowLight: string;
  quickNavShadowDark: string;
};

export type CourseIconEntry = {
  label: string;
  iconPath: string;
  iconUrl: string;
};

export type ContentRepoStatus = {
  repoName: string;
  branch: string;
  source: string;
  updatedAt: string | null;
  commitSha: string | null;
};

export type DashboardSlideTemplate = "text" | "imageText" | "image";
export type DashboardImagePosition = "left" | "right" | "top" | "bottom";
export type DashboardTextAlign = "left" | "center" | "right";

export type DashboardSlideStyle = {
  imagePosition: DashboardImagePosition;
  textAlign: DashboardTextAlign;
  titleSize?: string;
  bodySize?: string;
  eyebrowSize?: string;
  imageSize?: string;
  mobileImageSize?: string;
};

export type DashboardCardSlide = {
  template: DashboardSlideTemplate;
  eyebrow: string;
  title: string;
  body: string;
  imageAlt: string;
  imageUrl?: string;
  style: DashboardSlideStyle;
};

export type DashboardCardTopic = {
  id: string;
  title: string;
  label: string;
  accent: string;
  imageSurface: string;
  slides: DashboardCardSlide[];
};

export type DesignSystem = {
  repoName: string;
  theme: {
    light: DesignThemeTokens;
    dark: DesignThemeTokens;
  };
  pageBackgrounds: PageBackgrounds;
  dashboard: DashboardDesignConfig;
  courses: CoursesDesignConfig;
  landing: LandingDesignConfig;
  ticker: Record<TickerItem["kind"], { borderColor: string; color: string }>;
  mobile: MobileDesignConfig;
  courseIcons: Record<string, CourseIconEntry>;
};

export type SlideshowSummary = {
  slug: string;
  title: string;
  summary: string;
  audience: string;
  tags: string[];
};

export type SlideshowSlide = {
  index: number;
  title: string;
  markdown: string;
};

export type SlideshowDeck = SlideshowSummary & {
  markdown: string;
  markdown_url?: string;
  slides: SlideshowSlide[];
};

export type MediaCollectionItem = {
  slug: string;
  title: string;
  summary: string;
  speaker: string;
  playlistUrl?: string;
  embedUrl?: string;
  mediaUrl?: string;
  posterUrl?: string;
  mimeType?: string;
  tags: string[];
  notesMarkdown?: string;
  notesMarkdownUrl?: string;
};

export type CbtCollections = {
  slideshows: SlideshowSummary[];
  trainingVideos: MediaCollectionItem[];
  audioBooks: MediaCollectionItem[];
};
