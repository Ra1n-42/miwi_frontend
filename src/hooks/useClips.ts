// src/hooks/useClips.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clipService } from '@/services/api';
import { Clip } from '@/types/ClipTypes';
import { useToast } from '@/hooks/use-toast';

export const QUERY_KEYS = {
  CLIPS: 'clips',
  LIKED_CLIPS: 'likedClips',
} as const;

export function useClips() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: clips = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.CLIPS],
    queryFn: async () => {
      const response = await clipService.getAllClips();
      if (response.error) throw new Error(response.error);
      return response.data;
    },
  });

  const {
    data: likedClips = [],
    isLoading: isLoadingLiked,
  } = useQuery({
    queryKey: [QUERY_KEYS.LIKED_CLIPS],
    queryFn: async () => {
      const response = await clipService.getLikedClips();
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    staleTime: 0,
  });

  const likeMutation = useMutation({
    mutationFn: async (clipId: string) => {
      const isAlreadyLiked = likedClips.some(clip => clip.id === clipId);
      if (isAlreadyLiked) {
        throw new Error('Du hast diesen Clip bereits geliked!');
      }
      
      const response = await clipService.likeClip(clipId);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: (updatedLike) => {
      // Update clips cache
      queryClient.setQueryData<Clip[]>([QUERY_KEYS.CLIPS], (oldClips = []) =>
        oldClips.map((clip) =>
          clip.id === updatedLike.id
            ? { ...clip, likes: updatedLike.likes }
            : clip
        )
      );

      // Get complete clip data
      const completeClip = queryClient
        .getQueryData<Clip[]>([QUERY_KEYS.CLIPS])
        ?.find(clip => clip.id === updatedLike.id);

      if (completeClip) {
        // Update liked clips cache
        queryClient.setQueryData<Clip[]>([QUERY_KEYS.LIKED_CLIPS], (oldLikedClips = []) => [
          ...oldLikedClips,
          completeClip,
        ]);
      }

      toast({
        description: 'Clip erfolgreich geliked!',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        description: error.message,
      });
    },
  });

  return {
    clips,
    likedClips,
    isLoading,
    isLoadingLiked,
    error,
    likeClip: likeMutation.mutate,
    isLiking: likeMutation.isPending,
  };
}