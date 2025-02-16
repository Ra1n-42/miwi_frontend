import { useState, useEffect } from "react";
import { ThumbsUp, Eye, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Clip } from "@/types/ClipTypes";
import VideoPlayer from "@/components/Clips/VideoPlayer";
import LinkedClipsCard from "@/components/Clips/LinkedClipsCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { clipService } from "@/services/api";

// Typdefinition für LikeResponse
type LikeResponse = {
  id: string;
  likes: number;
};

const Shorts: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [ratedClips, setRatedClips] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("trending");
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  // Für Lazy Loading: Anzahl aktuell sichtbarer liked Clips
  const [visibleLikedClips, setVisibleLikedClips] = useState(7);

  const LOCAL_STORAGE_KEY = "shorts_currentClipIndex";
  const LOCAL_STORAGE_TAB_KEY = "shorts_activeTab";

  // Gespeicherte Werte laden
  useEffect(() => {
    const savedIndex = localStorage.getItem(LOCAL_STORAGE_KEY);
    const savedTab = localStorage.getItem(LOCAL_STORAGE_TAB_KEY);
    if (savedIndex) setCurrentClipIndex(Number(savedIndex));
    if (savedTab) setActiveTab(savedTab);
  }, []);

  // Änderungen speichern
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, currentClipIndex.toString());
  }, [currentClipIndex]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_TAB_KEY, activeTab);
  }, [activeTab]);

  // Alle Clips laden
  const { data: clips = [], isLoading } = useQuery<Clip[]>({
    queryKey: ["clips"],
    queryFn: async () => {
      const response = await clipService.getAllClips();
      if (response.error) throw new Error(response.error);
      return response.data;
    },
  });

  // Gelikete Clips laden (nur wenn User eingeloggt)
  const { data: likedClips = [], isLoading: isLoadingLikedClips } = useQuery<
    Clip[]
  >({
    queryKey: ["likedClips"],
    queryFn: async () => {
      const response = await clipService.getLikedClips();
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    enabled: !!user,
    staleTime: 0,
  });

  // Berechnung eines Popularity-Scores
  const calculatePopularityScore = (clip: Clip) => {
    const daysSinceCreation =
      (new Date().getTime() - new Date(clip.created_at).getTime()) /
      (1000 * 3600 * 24);
    const viewWeight = 0.5;
    const likeWeight = 0.4;
    const freshnessWeight = 0.1;
    return (
      (clip.view_count * viewWeight + clip.likes * likeWeight) /
      (daysSinceCreation + freshnessWeight)
    );
  };

  // Clips sortieren basierend auf dem aktiven Tab
  const getSortedClips = () => {
    if (activeTab === "best") {
      return [...clips].sort((a, b) => b.likes - a.likes);
    }
    return [...clips].sort(
      (a, b) => calculatePopularityScore(b) - calculatePopularityScore(a)
    );
  };

  const nextClip = () => {
    setSelectedClip(null);
    if (currentClipIndex < getSortedClips().length - 1) {
      setCurrentClipIndex((prev) => prev + 1);
    }
  };

  const prevClip = () => {
    setSelectedClip(null);
    if (currentClipIndex > 0) {
      setCurrentClipIndex((prev) => prev - 1);
    }
  };

  const handleClipSelect = (clip: Clip) => {
    setSelectedClip(clip);
  };

  // Flag, um zwischen Mock und echtem API-Aufruf zu wechseln
  const isMock = false;

  // Mock-Funktion, die einen Like simuliert
  const mockLikeClip = async (
    clipId: string
  ): Promise<{ data: LikeResponse; error?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Hole den aktuellen Clip aus dem Query-Cache (oder setze default = 0)
        const cachedClips = queryClient.getQueryData<Clip[]>(["clips"]) || [];
        const clip = cachedClips.find((c) => c.id === clipId);
        const newLikes = clip ? clip.likes + 1 : 1;
        resolve({ data: { id: clipId, likes: newLikes } });
      }, 500); // 500ms Verzögerung simuliert einen Netzwerkaufruf
    });
  };

  const likeMutation = useMutation<LikeResponse, Error, string>({
    mutationFn: async (clipId: string) => {
      if (likedClips.some((clip) => clip.id === clipId)) {
        throw new Error("Du hast diesen Clip bereits geliked!");
      }
      // Entscheide, ob der echte API-Aufruf oder der Mock verwendet werden soll
      const response = isMock
        ? await mockLikeClip(clipId)
        : await clipService.likeClip(clipId);

      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: (updatedClip) => {
      // Aktualisiere den Clips-Cache
      queryClient.setQueryData<Clip[]>(["clips"], (oldClips) =>
        oldClips?.map((clip) =>
          clip.id === updatedClip.id
            ? { ...clip, likes: updatedClip.likes }
            : clip
        )
      );
      // Falls der aktuelle Clip selektiert ist, update diesen Zustand ebenfalls
      if (selectedClip && selectedClip.id === updatedClip.id) {
        setSelectedClip({ ...selectedClip, likes: updatedClip.likes });
      }
      // Füge den geliketen Clip zum likedClips-Cache hinzu, sofern vorhanden
      const completeClip = queryClient
        .getQueryData<Clip[]>(["clips"])
        ?.find((clip) => clip.id === updatedClip.id);
      if (completeClip) {
        queryClient.setQueryData<Clip[]>(
          ["likedClips"],
          (oldLikedClips = []) => [...oldLikedClips, completeClip]
        );
      }
      // Aktualisiere den lokalen ratedClips-State
      setRatedClips((prev) => new Set(prev).add(updatedClip.id));
      toast({ description: "Clip erfolgreich geliked!" });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", description: error.message });
    },
  });

  const handleThumbsUp = (clipId: string) => {
    if (!user) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    likeMutation.mutate(clipId);
  };

  const sortedClips = getSortedClips();
  const currentClip = selectedClip || sortedClips[currentClipIndex];

  // onScroll-Handler für die ScrollArea (Lazy Loading der likedClips)
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      setVisibleLikedClips((prev) => Math.min(prev + 7, likedClips.length));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row pb-10">
      {/* Hauptbereich: Tabs & VideoPlayer */}
      <div className="flex-1 flex flex-col space-y-10">
        <div className="flex items-center justify-center">
          <Tabs
            defaultValue="trending"
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val);
              setCurrentClipIndex(0);
            }}
            className="flex flex-col justify-center items-center text-white w-full max-w-5xl"
          >
            <TabsList className="w-full">
              <TabsTrigger value="trending" className="w-full">
                Trending Videos
              </TabsTrigger>
              <TabsTrigger value="best" className="w-full">
                Best Videos
              </TabsTrigger>
            </TabsList>

            {["trending", "best"].map((tab) => (
              <TabsContent
                key={tab}
                value={tab}
                className="w-full flex flex-col items-center data-[state=inactive]:!mt-0"
              >
                {currentClip ? (
                  <div className="flex justify-center items-center w-full max-w-5xl">
                    <VideoPlayer currentClip={currentClip} />
                  </div>
                ) : (
                  <p className="text-lg font-semibold">
                    Keine Clips verfügbar.
                  </p>
                )}
              </TabsContent>
            ))}
          </Tabs>

          {currentClip && (
            <div className="space-y-3 flex flex-col items-center justify-center text-white mx-5">
              <div className="items-center text-sm space-y-3">
                <div className="likes flex flex-col items-center">
                  <Button
                    variant="secondary"
                    className="w-9 h-9 rounded-full bg-white hover:bg-green-500"
                    onClick={() => handleThumbsUp(currentClip.id)}
                    disabled={ratedClips.has(currentClip.id)}
                  >
                    <ThumbsUp />
                  </Button>
                  <div className="mt-1">{currentClip.likes || 0}</div>
                </div>
                <div className="viewer flex flex-col items-center">
                  <button
                    disabled
                    className="flex w-9 h-9 bg-white rounded-full items-center justify-center"
                  >
                    <Eye className="text-black" />
                  </button>
                  <div className="mt-1">{currentClip.view_count || 0}</div>
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={prevClip}
                  disabled={currentClipIndex === 0}
                  className={`w-9 h-9 flex justify-center items-center rounded-full text-black font-semibold ${currentClipIndex === 0
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-white hover:bg-blue-600"
                    }`}
                >
                  <ChevronUp />
                </button>
                <button
                  onClick={nextClip}
                  disabled={currentClipIndex === sortedClips.length - 1}
                  className={`w-9 h-9 flex justify-center items-center pt-1 rounded-full text-black font-semibold ${currentClipIndex === sortedClips.length - 1
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-white hover:bg-blue-600"
                    }`}
                >
                  <ChevronDown />
                </button>
              </div>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="mt-4 text-center text-white">
            <p className="text-lg font-semibold">Clips werden geladen...</p>
          </div>
        )}
      </div>

      {/* Sidebar: Gelikete Clips (nur bei eingeloggtem User) */}
      {user && (
        <div className="space-y-3">
          <div className="text-white text-xl font-semibold">Liked Clips</div>
          <ScrollArea
            className="flex flex-col overflow-y-auto xl:h-[35.3rem] lg:h-[26rem]"
            onScroll={handleScroll}
          >
            {isLoadingLikedClips ? (
              <div className="text-white text-center">
                <div className="relative w-[200px] lg:w-[290px] h-[90px] flex">
                  <Loader2 className="animate-spin" />
                  Lade geliked Clips
                </div>
              </div>
            ) : likedClips.length > 0 ? (
              likedClips.slice(0, visibleLikedClips).map((clip) => (
                <div className="relative w-[200px] lg:w-[290px] h-[90px] my-1" key={clip.id}>
                  <LinkedClipsCard
                    clip={clip}
                    onClick={() => handleClipSelect(clip)}
                  />
                </div>
              ))
            ) : (
              <div className="relative w-[200px] lg:w-[290px] h-[90px]">
                <p className="absolute inset-0 flex items-center justify-center text-center text-white">
                  Noch Keine Clips geliked.
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default Shorts;
