// src/store/useChallengeStore.js
import { create } from "zustand";
import { Challenge } from "@/types/challangeTypes";
import { immer } from "zustand/middleware/immer";

interface ChallengeStore {
  challenges: Challenge[]; // die interface von Challange
  fetchChallenges: () => Promise<void>; // Wird automatisch aufgerufen
  addChallenge: () => void;
  deleteChallenge: (id: string) => void;
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
    }

  }))
);
