export const API_ENDPOINTS = {
  CLIPS: {
    ALL: "/clip/all",
    LIKED: "/clip/my_liked_clips",
    LIKE: (clipId: string) => `/clip/like/${clipId}`,
  },
  CHALLENGE: {
    BASE: "/challenge",
    ALL: "/challenge/all",
    DELETE: (id: string) =>`/challenge/delete/${id}`
  },
} as const;

export const API_BASE_URL = `https://${import.meta.env.VITE_BASE_DOMAIN}/api`;