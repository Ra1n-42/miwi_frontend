import { API_BASE_URL, API_ENDPOINTS  } from "@/constants/api";
import { Clip } from '@/types/ClipTypes'

interface ApiResponse<T> {
    data: T;
    error?: string;
}

interface LikeResponse {
    id: string;
    likes: number;
}

export const clipService = {
    async getAllClips(): Promise<ApiResponse<Clip[]>> {
      try {
        // const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CLIPS.ALL}`);
        const response = await fetch(`/clips_data.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch clips');
        }
        const data = await response.json();
        return { data };
      } catch (error) {
        return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
  
    async getLikedClips(): Promise<ApiResponse<Clip[]>> {
      try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CLIPS.LIKED}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch liked clips');
        }
        const data = await response.json();
        return { data };
      } catch (error) {
        return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
  
    async likeClip(clipId: string): Promise<ApiResponse<LikeResponse>> {
      try {
        const response = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.CLIPS.LIKE(clipId)}`,
          {
            method: 'POST',
            credentials: 'include',
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail?.message || 'Failed to like clip');
        }
        const data = await response.json();
        return { data };
      } catch (error) {
        return { 
          data: { id: clipId, likes: 0 }, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    },
  };