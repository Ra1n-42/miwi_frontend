export const API_ENDPOINTS = {
  CLIPS: {
    ALL: "/clip/all",
    LIKED: "/clip/my_liked_clips",
    LIKE: (clipId: string) => `/clip/like/${clipId}`,
  },
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
