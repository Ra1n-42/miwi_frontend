import { useState } from "react";
import { Challenge } from "@/types/challangeTypes";
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { formatDate } from "@/utils/dateUtils";


export const useChallenges = () => {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const { toast } = useToast();

    const fetchChallenges = async () => {
        try {
            // const response = await fetch("/challanges.json");
            const response = await fetch("https://dev.miwi.tv/api/challange/all");
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn("Keine Challenges gefunden");
                    setChallenges([]);
                    return;
                }
                console.error(`Fehler: ${response.status} ${response.statusText}`);
                return;
            }
            const data = await response.json();
            if (!Array.isArray(data)) {
                console.error("Fehler: Erwartet wurde ein Array");
                return;
            }
            const sortedData = data.sort((a, b) =>
                new Date(b.header.created_at).getTime() - new Date(a.header.created_at).getTime()
            );
            setChallenges(sortedData);
        } catch (error) {
            console.error("Fehler beim Laden der Challenges:", error);
        }
    };

    // ➕ Neue Challenge hinzufügen
    const addChallenge = () => {
        const newChallenge: Challenge = {
            id: "",
            header: {
                title: "Neue Challenge",
                description: "Beschreibung",
                created_at: "DD.MM.YYYY",
                challange_end: "DD.MM.YYYY",
            },
            sections: [],
        };
        setChallenges((prev) => [newChallenge, ...prev]);
    };

    const saveChallenge = async (challenge: Challenge) => {
        const isEditMode = !!challenge.id;
     
        const url = isEditMode
          ? `https://dev.miwi.tv/api/challange/update/${challenge.id}`  // Bearbeiten
          : "https://dev.miwi.tv/api/challange/create";   
     
        const method = isEditMode ? "PUT" : "POST";
     
        const requestBody = {
          header: {
            title: challenge.header.title,
            description: challenge.header.description,
            created_at: formatDate(challenge.header.created_at),
            challange_end: formatDate(challenge.header.challange_end),
          },
          sections: challenge.sections.map(section => ({
            title: section.title,
            items: section.items.map(item => ({
              id: item.id,  // Stelle sicher, dass die id vorhanden ist
              text: item.text,
              completed: item.completed,
              subchallenges: item.subchallenges.map(sub => ({
                id: sub.id,  // Stelle sicher, dass die id vorhanden ist
                text: sub.text,
              })),
            })),
          })),
        };
        console.log(JSON.stringify(requestBody))
        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
            credentials: "include", // jwt auth
          });
     
          if (response.ok) {
            const data = await response.json();
            console.log(data); // Erfolgsmeldung vom Server
            toast({
              description: data.message, // Zeigt die Nachricht aus der API-Antwort an
            });
          } else {
            const errorData = await response.json().catch(() => null);
            console.error("Failed to save challenge", errorData);
            if (errorData && errorData.detail) {
              toast({
                variant: "destructive",
                description: errorData.detail.message || "Fehler beim Aktualisieren der Task.",
                action: <ToastAction altText="Ok">Ok</ToastAction>,
              });
            } else {
              console.error("Status:", response.status, response.statusText);
            }
          }
        } catch (error) {
          console.error("Error saving challenge:", error);
        }
    };

    // ❌ Challenge löschen
    const deleteChallenge = async (id: string) => {
        if (id !==""){
          // Challenge ist in der Datenbank gespeichert → API-Call zum Löschen
          const confirmDelete = window.confirm("Möchtest du diese Challenge wirklich löschen?");
          if (!confirmDelete) return;
    
          try {
            const response = await fetch(`https://dev.miwi.tv/api/challange/delete/${id}`, {
              method: "DELETE",
              credentials: "include",  // JWT Auth
            });
    
            if (response.ok) {
              console.log(`Challenge mit ID ${id} erfolgreich gelöscht.`);
              // alert(`Challenge mit ID ${id} erfolgreich gelöscht.`);
              setChallenges((prev) => prev.filter((challenge) => challenge.id !== id));
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
        }
        setChallenges((prev) => prev.filter((challenge) => challenge.id !== id));
    };

    // 📝 Challenge aktualisieren
    const updateChallenge = (
        challengeId: string,
        key: keyof Challenge["header"],
        value: string
        ) => {
        setChallenges((prev) =>
          prev.map((challenge) =>
            challenge.id === challengeId
              ? { ...challenge, header: { ...challenge.header, [key]: value } }
              : challenge
          )
        );
    };

    // ➕ Neue Sektion hinzufügen
    const addSection = (challengeId: string) => {
        setChallenges((prev) =>
          prev.map((challenge) =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  sections: [
                    ...challenge.sections,
                    { 
                      id: `${Date.now()}`, // Neue Section mit Zeitstempel als ID
                      title: "Neue Sektion", 
                      items: [] 
                    },
                  ],
                }
              : challenge
          )
        );
    };
    const updateSectionTitle = (challengeId: string, sectionIndex: number, newTitle: string) => {
        setChallenges((prev) =>
          prev.map((challenge) =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  sections: challenge.sections.map((section, idx) =>
                    idx === sectionIndex ? { ...section, title: newTitle } : section
                  ),
                }
              : challenge
          )
        );
    };

    // ❌ Sektion löschen
    const deleteSection = (challengeId: string, sectionIndex: number) => {
        setChallenges((prev) =>
          prev.map((challenge) =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  sections: challenge.sections.filter(
                    (_, idx) => idx !== sectionIndex
                  ),
                }
              : challenge
          )
        );
      };

    // ➕ Aufgabe hinzufügen
    const addItem = (challengeId: string, sectionIndex: number) => {
        setChallenges((prev) =>
            prev.map((challenge) =>
            challenge.id === challengeId
                ? {
                    ...challenge,
                    sections: challenge.sections.map((section, idx) =>
                        idx === sectionIndex
                        ? {
                            ...section,
                            items: [
                            ...section.items,
                            {
                              id: ``, // ID für das neue Item
                              text: "Neue Aufgabe",
                              completed: false,
                              subchallenges: [],
                            },
                          ],
                        }
                        : section
                    ),
                }
              : challenge
            )
        );
    };
    const toggleItemCompletion = (challengeId: string, sectionIndex: number, itemIndex: number) => {
        setChallenges((prev) =>
          prev.map((challenge) =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  sections: challenge.sections.map((section, sIdx) =>
                    sIdx === sectionIndex
                      ? {
                          ...section,
                          items: section.items.map((item, iIdx) =>
                            iIdx === itemIndex
                              ? { ...item, completed: !item.completed }
                              : item
                          ),
                        }
                      : section
                  ),
                }
              : challenge
          )
        );
    };
    const updateItemText = (challengeId: string, sectionIndex: number, itemIndex: number, newText: string) => {
        setChallenges((prev) =>
          prev.map((challenge) =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  sections: challenge.sections.map((section, sIdx) =>
                    sIdx === sectionIndex
                      ? {
                          ...section,
                          items: section.items.map((item, iIdx) =>
                            iIdx === itemIndex ? { ...item, text: newText } : item
                          ),
                        }
                      : section
                  ),
                }
              : challenge
          )
        );
    };
      
    // ❌ Aufgabe löschen
    const deleteTask = (
        challengeId: string,
        sectionIndex: number,
        taskIndex: number
    ) => {
        setChallenges((prev) =>
        prev.map((challenge) =>
            challenge.id === challengeId
            ? {
                ...challenge,
                sections: challenge.sections.map((section, idx) =>
                    idx === sectionIndex
                    ? {
                        ...section,
                        items: section.items.filter((_, iIdx) => iIdx !== taskIndex),
                        }
                    : section
                ),
                }
            : challenge
        )
        );
    };

    // ➕ Subtask hinzufügen
    const addSubchallenge = (challengeId: string, sectionIndex: number, taskIndex: number) => {
        setChallenges((prev) =>
            prev.map((challenge) =>
            challenge.id === challengeId
                ? {
                    ...challenge,
                    sections: challenge.sections.map((section, sIdx) =>
                    sIdx === sectionIndex
                        ? {
                            ...section,
                            items: section.items.map((item, iIdx) =>
                            iIdx === taskIndex
                                ? {
                                    ...item,
                                    subchallenges: [
                                    ...item.subchallenges,
                                    { id: `${Date.now()}`, text: "Neue Subaufgabe", completed: false } // ID wird hier erzeugt
                                    ],
                                }
                                : item
                            ),
                        }
                        : section
                    ),
                }
                : challenge
            )
        );
    };
    const updateSubchallengeText = (
        challengeId: string,
        sectionIndex: number,
        itemIndex: number,
        subIndex: number,
        newText: string
      ) => {
        setChallenges((prev) =>
          prev.map((challenge) =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  sections: challenge.sections.map((section, sIdx) =>
                    sIdx === sectionIndex
                      ? {
                          ...section,
                          items: section.items.map((item, iIdx) =>
                            iIdx === itemIndex
                              ? {
                                  ...item,
                                  subchallenges: item.subchallenges.map((sub, subIdx) =>
                                    subIdx === subIndex ? { ...sub, text: newText } : sub
                                  ),
                                }
                              : item
                          ),
                        }
                      : section
                  ),
                }
              : challenge
          )
        );
    };
      

    // ❌ Subtask löschen
    const deleteSubchallenge = (
        challengeId: string,
        sectionIndex: number,
        taskIndex: number,
        subtaskIndex: number
        ) => {
        setChallenges((prev) =>
            prev.map((challenge) =>
            challenge.id === challengeId
                ? {
                    ...challenge,
                    sections: challenge.sections.map((section, sIdx) =>
                    sIdx === sectionIndex
                        ? {
                            ...section,
                            items: section.items.map((item, iIdx) =>
                            iIdx === taskIndex
                                ? {
                                    ...item,
                                    subchallenges: item.subchallenges.filter((_, idx) => idx !== subtaskIndex),
                                }
                                : item
                            ),
                        }
                        : section
                    ),
                }
                : challenge
            )
        );
        };

    return {
        challenges,
        updateSectionTitle,
        toggleItemCompletion,
        updateItemText,
        updateSubchallengeText,
        setChallenges,
        fetchChallenges,
        addChallenge,
        saveChallenge,
        deleteChallenge,
        updateChallenge,
        addSection,
        deleteSection,
        addItem,
        deleteTask,
        addSubchallenge,
        deleteSubchallenge,
    };
};
