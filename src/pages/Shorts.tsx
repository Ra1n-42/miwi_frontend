import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

// Clip-Datenstruktur
interface Clip {
  creator_name: string;
  id: string;
  view_count: number;
  created_at: string;
  likes: number;
}

const Shorts: React.FC = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { user } = useUser();
  const [clips, setClips] = useState<Clip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [ratedClips] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("trending");
  const navigate = useNavigate();
  const { toast } = useToast();

  const LOCAL_STORAGE_KEY = "shorts_currentClipIndex";
  const LOCAL_STORAGE_TAB_KEY = "shorts_activeTab";

  // Clips abrufen
  const fetchClips = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/clip/all`);
      if (response.ok) {
        const data: Clip[] = await response.json();
        setClips(data);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Clips:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClips();
    const savedIndex = localStorage.getItem(LOCAL_STORAGE_KEY);
    const savedTab = localStorage.getItem(LOCAL_STORAGE_TAB_KEY);

    if (savedIndex) {
      setCurrentClipIndex(Number(savedIndex));
    }

    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, [fetchClips]);

  // Clip-Index speichern, wenn er sich ändert
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, currentClipIndex.toString());
  }, [currentClipIndex]);

  // Aktiven Tab speichern, wenn er sich ändert
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_TAB_KEY, activeTab);
  }, [activeTab]);

  // Clips nach Popularität sortieren
  const getSortedClips = () => {
    if (activeTab === "best") {
      return [...clips].sort((a, b) => b.likes - a.likes);
    }
    return [...clips].sort(
      (a, b) => calculatePopularityScore(b) - calculatePopularityScore(a)
    );
  };

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

  const nextClip = () => {
    if (currentClipIndex < getSortedClips().length - 1) {
      setCurrentClipIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevClip = () => {
    if (currentClipIndex > 0) {
      setCurrentClipIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleThumbsUp = async (clipId: string) => {
    if (!user) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    likeClip(clipId);
  };

  const likeClip = async (clipId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clip/like/${clipId}`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const updatedClip = await response.json();
        setClips((prevClips) =>
          prevClips.map((clip) =>
            clip.id === clipId ? { ...clip, likes: updatedClip.likes } : clip
          )
        );
      } else {
        const errorData = await response.json();
        toast({
          description: errorData.detail.message,
        });
        console.error("Fehler beim Liken:", errorData.detail);
      }
    } catch (error) {
      console.error("Netzwerkfehler:", error);
    }
  };

  const sortedClips = getSortedClips();
  const currentClip = sortedClips[currentClipIndex];

  return (
    <div>
      <Tabs
        defaultValue="trending"
        onValueChange={(val) => {
          setActiveTab(val);
          setCurrentClipIndex(0);
        }}
        className="flex flex-col justify-center items-center text-white"
      >
        <TabsList className="w-full max-w-5xl">
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
            className="w-full flex flex-col items-center"
          >
            {currentClip ? (
              <div className="flex flex-col justify-center items-center w-full max-w-5xl mb-5">
                <iframe
                  src={`https://clips.twitch.tv/embed?clip=${currentClip.id}&parent=dev.miwi.tv&autoplay=true`}
                  className="w-full aspect-video rounded-md"
                  allowFullScreen={true}
                />
                <div>
                  <div className="space-y-1 flex items-center justify-center mt-4">
                    <h4 className="text-xl font-medium leading-none">
                      {currentClip.creator_name}
                    </h4>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex h-5 items-center space-x-4 text-sm">
                    <div>Aufrufe: {currentClip.view_count}</div>
                    <Separator orientation="vertical" />
                    <div>Likes: {currentClip.likes}</div>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className={`mt-4 px-4 py-2 rounded-md  font-semibold `}
                  onClick={() => handleThumbsUp(currentClip.id)}
                  disabled={ratedClips.has(currentClip.id)}
                >
                  Daumen hoch 👍
                </Button>
              </div>
            ) : (
              <p className="text-lg font-semibold">Keine Clips verfügbar.</p>
            )}
            <div className="flex gap-4 mt-5">
              <button
                onClick={prevClip}
                disabled={currentClipIndex === 0}
                className={`px-4 py-2 rounded-md text-white font-semibold ${
                  currentClipIndex === 0
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                <ChevronLeft />
              </button>
              <button
                onClick={nextClip}
                disabled={currentClipIndex === sortedClips.length - 1}
                className={`px-4 py-2 rounded-md text-white font-semibold ${
                  currentClipIndex === sortedClips.length - 1
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                <ChevronRight />
              </button>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {isLoading && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">Clips werden geladen...</p>
        </div>
      )}
    </div>
  );
};

export default Shorts;
