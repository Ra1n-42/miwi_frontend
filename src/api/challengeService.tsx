import { API_BASE_URL, API_ENDPOINTS, IS_DEV, IS_LOCAL } from "@/constants/api";

export const challengeService = {
  async fetchChallenges() {

    if (IS_LOCAL && IS_DEV) {
      const response = await fetch("/data/challanges.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } else {

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.CHALLENGE.ALL}`
      );
      // const response = await fetch("/challanges.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    }
  },
  async deleteChallenge(id: string) {

    if (IS_LOCAL && IS_DEV) {
      // Mock response für Testzwecke
      const response = {
        ok: true, // API-Antwort simulieren
        status: 200,
        statusText: "OK",
        json: async () => ({ detail: "lol" }), // Dummy JSON-Antwort
      };

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || `Failed to delete challenge: ${response.status}`
        );
      }

      return data;
    } else {

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.CHALLENGE.DELETE(id)}`,
        {
          method: "DELETE",
          credentials: "include", // JWT Auth
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || `Failed to delete challenge: ${response.status}`
        );
      }

      return data;
    }
  },
};
