export interface ContentInput {
  website: string;
  websiteUrl?: string;
  ica: string; // Ideal Customer Avatar
  services: string;
  keyTransformation: string;
  topPerformingBlogs: string;
  additionalContext?: string;
}

export interface WebsiteData {
  title?: string;
  description?: string;
  image?: string;
  author?: string;
  publisher?: string;
  date?: string;
  lang?: string;
  logo?: string;
  url?: string;
  contentText?: string;
}

export interface ContentIdea {
  id: string;
  title: string;
  description?: string;
  category?: string;
  isBookmarked: boolean;
}

export interface BookmarkGroup {
  id: string;
  name: string;
  ideas: ContentIdea[];
  createdAt: Date;
}

export interface ApiResponse {
  success: boolean;
  ideas?: ContentIdea[];
  error?: string;
}
