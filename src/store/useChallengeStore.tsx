// src/store/useChallengeStore.js
import { create } from "zustand";
import { Challenge } from "@/types/challangeTypes";
import { immer } from "zustand/middleware/immer";

interface ChallengeStore {
  challenges: Challenge[]; // die interface von Challange
  fetchChallenges: () => Promise<void>; // Wird automatisch aufgerufen
}

export const useChallengeStore = create<ChallengeStore>()(
  immer((set) => ({
    challenges: [],
    fetchChallenges: async () => {
      const response = await fetch("/challanges.json");
      const data = await response.json();
      set((state) => {
        state.challenges = data;
      });
    },
  }))
);
