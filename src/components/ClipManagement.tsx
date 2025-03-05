import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { API_BASE_URL } from "@/constants/api";
// Typdefinition für Clip-Daten
interface Clip {
  title: string;
  creator_name: string;
  id: string;
  url: string;
  view_count: number;
  created_at: string;
  blocked: boolean;
}

const ClipManagement: React.FC = () => {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clipsPerPage = 5; // Clips pro Seite
  const [currentPage, setCurrentPage] = useState<number>(1); // Aktuelle Seite
  const [tabValue, setTabValue] = useState<"allowed" | "blocked">("allowed"); // Aktueller Tab
  const { toast } = useToast();

  useEffect(() => {
    const fetchClips = async () => {
      try {
        // Fetch Clips von der API
        // const response = await fetch(`/clips_data.json`);
        const response = await fetch(
          `${API_BASE_URL}/clip/all?show_blocked=true`
        );
        if (!response.ok) {
          throw new Error("Fehler beim Laden der Clips");
        }
        const data: Clip[] = await response.json();
        setClips(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchClips();
  }, []);

  // Wenn sich der Tab ändert, setze die Seite zurück auf 1
  useEffect(() => {
    setCurrentPage(1);
  }, [tabValue]);

  if (loading) return <p>Lade Clips...</p>;
  if (error) return <p>Fehler: {error}</p>;

  // Clips nach Status filtern
  const allowedClips = clips.filter((clip) => !clip.blocked);
  const blockedClips = clips.filter((clip) => clip.blocked);

  // Berechnung der Clips, die auf der aktuellen Seite angezeigt werden sollen
  const getClipsForPage = (clipList: Clip[]) => {
    const indexOfLastClip = currentPage * clipsPerPage;
    const indexOfFirstClip = indexOfLastClip - clipsPerPage;
    return clipList.slice(indexOfFirstClip, indexOfLastClip);
  };

  // Gesamtzahl der Seiten berechnen für erlaubte und blockierte Clips
  const totalAllowedPages = Math.ceil(allowedClips.length / clipsPerPage);
  const totalBlockedPages = Math.ceil(blockedClips.length / clipsPerPage);

  // Funktion zum Wechseln der Seiten
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Funktion, um den Status eines Clips zu ändern
  const toggleBlockStatus = async (clipId: string, isBlocked: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clip/block/${clipId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: !isBlocked }),
      });

      if (!response.ok) {
        let errorMessage = "Fehler beim Aktualisieren des Status";
        try {
          const data = await response.json();
          errorMessage = data?.detail?.message || data?.message || errorMessage;
        } catch {
          // JSON-Fehler ignorieren, Standard-Fehlermeldung verwenden
        }

        toast({
          variant: "destructive",
          description: errorMessage,
          action: <ToastAction altText="Ok">Ok</ToastAction>,
        });
        throw new Error(errorMessage); // Besser als Promise.reject
      }

      // UI-Update nach erfolgreicher Änderung
      setClips((prevClips) =>
        prevClips.map((clip) =>
          clip.id === clipId ? { ...clip, blocked: !isBlocked } : clip
        )
      );

      // 🎉 Erfolgreiche Aktion mit Toast anzeigen
      toast({
        description: `Clip wurde erfolgreich ${
          isBlocked ? "freigegeben" : "blockiert"
        }.`,
        action: <ToastAction altText="Ok">Ok</ToastAction>,
      });
    } catch (error) {
      console.error("Fehler:", error);
      toast({
        variant: "destructive",
        description: "Unerwarteter Fehler. Bitte versuche es erneut.",
        action: <ToastAction altText="Ok">Ok</ToastAction>,
      });
    }
  };

  const renderClipList = (clipList: Clip[], isBlocked: boolean) => (
    <ul className="w-full">
      {clipList.length === 0 ? (
        <p className="text-center">Keine Clips verfügbar.</p>
      ) : (
        clipList.map((clip) => (
          <li
            key={clip.id}
            className="border flex items-center justify-evenly space-x-5 p-2 mb-4 rounded-md shadow-md"
          >
            <iframe
              src={`https://clips.twitch.tv/embed?clip=${clip.id}&parent=${
                import.meta.env.VITE_BASE_DOMAIN
              }`}
              className="w-80 aspect-video rounded-md"
              allowFullScreen
            />
            <div>
              <p>Erstellt von: {clip.creator_name}</p>
              <p>Aufrufe: {clip.view_count}</p>
              <p>Erstellt am: {new Date(clip.created_at).toLocaleString()}</p>
            </div>
            <Button
              className={
                isBlocked
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }
              onClick={() => toggleBlockStatus(clip.id, isBlocked)}
            >
              {isBlocked ? "Aktivieren" : "Blockieren"}
            </Button>
          </li>
        ))
      )}
    </ul>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <Tabs
        value={tabValue}
        onValueChange={(value) => setTabValue(value as "allowed" | "blocked")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="allowed">Erlaubte Clips</TabsTrigger>
          <TabsTrigger value="blocked">Blockierte Clips</TabsTrigger>
        </TabsList>

        <TabsContent value="allowed">
          {renderClipList(getClipsForPage(allowedClips), false)}{" "}
          {/* false bedeutet "nicht blockiert" */}
          {/* Pagination für erlaubte Clips */}
          <Pagination currentPage={currentPage} lastPage={totalAllowedPages}>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                />
              </PaginationItem>

              {/* Dynamische Seitenlinks */}
              {[...Array(totalAllowedPages).keys()].map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    onClick={() => handlePageChange(pageNumber + 1)}
                    isActive={currentPage === pageNumber + 1}
                  >
                    {pageNumber + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </TabsContent>

        <TabsContent value="blocked">
          {renderClipList(getClipsForPage(blockedClips), true)}{" "}
          {/* true bedeutet "blockiert" */}
          {/* Pagination für blockierte Clips */}
          <Pagination currentPage={currentPage} lastPage={totalBlockedPages}>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                />
              </PaginationItem>

              {/* Dynamische Seitenlinks */}
              {[...Array(totalBlockedPages).keys()].map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    onClick={() => handlePageChange(pageNumber + 1)}
                    isActive={currentPage === pageNumber + 1}
                  >
                    {pageNumber + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClipManagement;
