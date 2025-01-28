// src/store/useChallengeStore.tsx
import { create } from "zustand";
import { Challenge } from "@/types/challangeTypes";
import { immer } from "zustand/middleware/immer";
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { formatDate } from "@/utils/dateUtils";

interface ChallengeStore {
  challenges: Challenge[]; // die interface von Challange
  fetchChallenges: () => Promise<void>; // Wird automatisch aufgerufen
  addChallenge: () => void;
  deleteChallenge: (id: string) => void;
  updateChallenge: (challengeId: string, key: keyof Challenge["header"], value: string) => void;
  addSection: (challengeId: string) => void;
  addTask: (challengeId: string, sectionId: number) => void;
  deleteSection: (challengeId: string, sectionIndex: number) => void;
  deleteTask: (challengeId: string, sectionIndex: number, taskIndex: number) => void;
  toggleItemCompletion: (challengeId: string, sectionIndex: number, itemIndex: number) => void;
  updateSectionTitle: (challengeId: string, sectionIndex: number, newTitle: string) => void;
  updateTaskText: (challengeId: string, sectionIndex: number, itemIndex: number, newText: string) => void;
  addSubchallenge: (challengeId: string, sectionIndex: number, taskIndex: number) => void;
  updateSubchallengeText: (
    challengeId: string,
    sectionIndex: number,
    itemIndex: number,
    subIndex: number,
    newText: string
  ) => void;
  deleteSubchallenge: ( challengeId: string, sectionIndex: number, taskIndex: number, subtaskIndex: number ) => void;

}

export const useChallengeStore = create<ChallengeStore>()(
  immer<ChallengeStore>((set) => ({
    challenges: [],
    fetchChallenges: async () => {
      const response = await fetch("/challanges.json");
      const data = await response.json();
      set((state) => {
        state.challenges = data;
      });
    },
    addChallenge: () => {
      const newChallenge: Challenge = {
        id: `NEW-${Date.now()}`,
        header: {
          title: "Neue Challenge",
          description: "Beschreibung",
          created_at: "DD.MM.YYYY",
          challange_end: "DD.MM.YYYY",
        },
        sections: [],
      };
      set((state) => {
        state.challenges.unshift(newChallenge);
      });
    },

    deleteChallenge: async (id: string) => {
      if (id.startsWith("NEW-")) {
        // Lokale Challenge löschen (nicht in der Datenbank)
        set((state) => {
          state.challenges = state.challenges.filter((challenge) => challenge.id !== id);
        });
        console.log(`Lokale Challenge mit ID ${id} gelöscht.`);
        return;
      }

      const confirmDelete = window.confirm("Möchtest du diese Challenge wirklich löschen?");
      if (!confirmDelete) return;

      try {
        // const response = await fetch(`https://dev.miwi.tv/api/challange/delete/${id}`, {
        //   method: "DELETE",
        //   credentials: "include", // JWT Auth
        // });
        // Mock response für Testzwecke
        const response = {
          ok: true, // API-Antwort simulieren
          status: 200,
          statusText: "OK",
          json: async () => ({detail: "lol"}), // Dummy JSON-Antwort
        };
        if (response.ok) {
          console.log(`Challenge mit ID ${id} erfolgreich gelöscht.`);
          set((state) => {
            state.challenges = state.challenges.filter((challenge) => challenge.id !== id);
          });
        } else {
          const errorData = await response.json().catch(() => null);
          console.error("Fehler beim Löschen der Challenge");
          if (errorData && errorData.detail) {
            console.error("Fehlerdetail:", errorData.detail);
          } else {
            console.error("Status:", response.status, response.statusText);
          }
        }
      } catch (error) {
        console.error("Fehler beim Löschen der Challenge:", error);
      }
    },

    updateChallenge: (challengeId: string, key: keyof Challenge["header"], value: string) => {
      set((state) => {
        state.challenges = state.challenges.map((challenge) =>
          challenge.id === challengeId
            ? { ...challenge, header: { ...challenge.header, [key]: value } }
            : challenge
        );
      });
    },

    addSection: (challengeId: string) =>
      set((state) => {
        state.challenges = state.challenges.map((challenge) =>
          challenge.id === challengeId
            ? {
                ...challenge,
                sections: [
                  ...challenge.sections,
                  {
                    id: `NEW-${Date.now()}`,
                    title: "Neue Sektion",
                    items: [],
                  },
                ],
              }
            : challenge
        );
      }),
    
      addTask: (challengeId: string, sectionIndex: number) =>
        set((state) => {
          const challenge = state.challenges.find(
            (challenge) => challenge.id === challengeId
          );
  
          if (challenge) {
            const section = challenge.sections[sectionIndex];
            if (section) {
              section.items.push({
                id: "NEW-" + Date.now().toString(),
                text: "Neue Aufgabe",
                completed: false,
                subchallenges: [],
              });
            }
          }
        }),
      
        deleteSection: (challengeId: string, sectionIndex: number) =>
          set((state) => {
            const challenge = state.challenges.find(
              (challenge) => challenge.id === challengeId
            );
        
            if (challenge) {
              challenge.sections.splice(sectionIndex, 1); // Entfernt die Sektion an der gegebenen Position
            }
          }),
        
        deleteTask: (challengeId: string, sectionIndex: number, taskIndex: number) =>
          set((state) => {
            const challenge = state.challenges.find(
              (challenge) => challenge.id === challengeId
            );
        
            if (challenge) {
              const section = challenge.sections[sectionIndex];
              if (section) {
                section.items.splice(taskIndex, 1); // Entfernt die Aufgabe an der gegebenen Position
              }
            }
          }),
        

          toggleItemCompletion: (challengeId: string, sectionIndex: number, itemIndex: number) =>
            set((state) => {
              const challenge = state.challenges.find(
                (challenge) => challenge.id === challengeId
              );
          
              if (challenge) {
                const section = challenge.sections[sectionIndex];
                if (section) {
                  const item = section.items[itemIndex];
                  if (item) {
                    item.completed = !item.completed; // Toggle der `completed`-Eigenschaft
                  }
                }
              }
            }),
          
            updateSectionTitle: (challengeId: string, sectionIndex: number, newTitle: string) =>
              set((state) => {
                const challenge = state.challenges.find(
                  (challenge) => challenge.id === challengeId
                );
            
                if (challenge) {
                  const section = challenge.sections[sectionIndex];
                  if (section) {
                    section.title = newTitle; // Ändere den Titel der Section
                  }
                }
              }),

              updateTaskText: (challengeId: string, sectionIndex: number, itemIndex: number, newText: string) =>
                set((state) => {
                  const challenge = state.challenges.find(
                    (challenge) => challenge.id === challengeId
                  );
              
                  if (challenge) {
                    const section = challenge.sections[sectionIndex];
                    if (section) {
                      const item = section.items[itemIndex];
                      if (item) {
                        item.text = newText;
                      }
                    }
                  }
                }),
              
                addSubchallenge: (challengeId: string, sectionIndex: number, taskIndex: number) =>
                  set((state) => {
                    const challenge = state.challenges.find(
                      (challenge) => challenge.id === challengeId
                    );
                
                    if (challenge) {
                      const section = challenge.sections[sectionIndex];
                      if (section) {
                        const item = section.items[taskIndex];
                        if (item) {
                          item.subchallenges.push({
                            id: `NEW-${Date.now()}`, // ID wird hier erzeugt
                            text: "Neue Subaufgabe",
                            completed: false,
                          });
                        }
                      }
                    }
                  }),

                  updateSubchallengeText: (
                    challengeId: string,
                    sectionIndex: number,
                    itemIndex: number,
                    subIndex: number,
                    newText: string
                  ) =>
                    set((state) => {
                      const challenge = state.challenges.find(
                        (challenge) => challenge.id === challengeId
                      );
                  
                      if (challenge) {
                        const section = challenge.sections[sectionIndex];
                        if (section) {
                          const item = section.items[itemIndex];
                          if (item) {
                            const subchallenge = item.subchallenges[subIndex];
                            if (subchallenge) {
                              subchallenge.text = newText;
                            }
                          }
                        }
                      }
                    }),

                    deleteSubchallenge: (
                      challengeId: string,
                      sectionIndex: number,
                      taskIndex: number,
                      subtaskIndex: number
                    ) =>
                      set((state) => {
                        const challenge = state.challenges.find(
                          (challenge) => challenge.id === challengeId
                        );
                    
                        if (challenge) {
                          const section = challenge.sections[sectionIndex];
                          if (section) {
                            const item = section.items[taskIndex];
                            if (item) {
                              item.subchallenges = item.subchallenges.filter(
                                (_, idx) => idx !== subtaskIndex
                              );
                            }
                          }
                        }
                      }),
                    
                      saveChallenge : async (challenge: Challenge) => {
                        const { toast } = useToast();
                        const isEditMode = challenge.id ? !challenge.id.startsWith("NEW-") : false;
                      
                        const url = isEditMode
                          ? `https://dev.miwi.tv/api/challange/update/${challenge.id}` // Bearbeiten
                          : "https://dev.miwi.tv/api/challange/create";
                      
                        const method = isEditMode ? "PUT" : "POST";
                      
                        const requestBody = {
                          header: {
                            title: challenge.header.title,
                            description: challenge.header.description,
                            created_at: formatDate(challenge.header.created_at),
                            challange_end: formatDate(challenge.header.challange_end),
                          },
                          sections: challenge.sections.map((section) => ({
                            title: section.title,
                            items: section.items.map((item) => ({
                              id: item.id || `NEW-${Date.now()}`, // Falls keine ID vorhanden, generiere temporäre ID
                              text: item.text,
                              completed: item.completed,
                              subchallenges: item.subchallenges.map((sub) => ({
                                id: sub.id || `NEW-${Date.now()}`, // Sicherstellen, dass Subchallenges eine ID haben
                                text: sub.text,
                              })),
                            })),
                          })),
                        };
                      
                        console.log("Request Body:", JSON.stringify(requestBody, null, 2)); // Schön formatiertes Logging
                      
                        try {
                          const response = await fetch(url, {
                            method,
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(requestBody),
                            credentials: "include", // JWT Auth
                          });
                      
                          if (response.ok) {
                            const data = await response.json();
                            console.log("Success:", data); // Erfolgsmeldung vom Server
                            toast({
                              description: data.message || "Erfolgreich gespeichert!",
                            });
                          } else {
                            const errorData = await response.json().catch(() => null);
                            console.error("Failed to save challenge", errorData);
                      
                            const errorMessage =
                              errorData?.detail?.message ||
                              `Fehler beim ${isEditMode ? "Aktualisieren" : "Erstellen"} der Challenge.`;
                      
                            toast({
                              variant: "destructive",
                              description: errorMessage,
                              action: <ToastAction altText="Ok">Ok</ToastAction>,
                            });
                          }
                        } catch (error) {
                          console.error("Error saving challenge:", error);
                          toast({
                            variant: "destructive",
                            description: "Es gab ein Problem beim Speichern der Challenge.",
                            action: <ToastAction altText="Ok">Ok</ToastAction>,
                          });
                        }
                      },
                      
                  
                  
                  
                  
                  
                  
                  
            
  }))
);
