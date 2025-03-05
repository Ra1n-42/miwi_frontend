export const API_ENDPOINTS = {
  CLIPS: {
    ALL: "/clip/all",
    LIKED: "/clip/my_liked_clips",
    LIKE: (clipId: string) => `/clip/like/${clipId}`,
  },
  CHALLENGE: {
    BASE: "/challenge",
    ALL: "/challenge/all",
    SUB: (id: string) =>`/subchallenge/${id}`,
    TASK: (id: string) =>`/task/${id}`,
    DELETE: (id: string) =>`/challenge/delete/${id}`
  },
} as const;

export const IS_DEV = true;
export const API_BASE_URL = IS_DEV
  ? `https://dev.${import.meta.env.VITE_BASE_DOMAIN}/api` // falls IS_DEV true ist, verwende die Entwicklungs-API
  : `https://${import.meta.env.VITE_BASE_DOMAIN}/api`; // Verwende die Produktions-API