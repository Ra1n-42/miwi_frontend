export const challengeService = {
    async fetchChallenges() {
        const response = await fetch("/challanges.json");
        return response.json();
    },
    async deleteChallenge(id: string) {
        // const response = await fetch(`https://dev.miwi.tv/api/challange/delete/${id}`, {
        //   method: "DELETE",
        //   credentials: "include", // JWT Auth
        // });
        // Mock response für Testzwecke
        const response = {
            ok: true, // API-Antwort simulieren
            status: 200,
            statusText: "OK",
            json: async () => ({ detail: "lol" }), // Dummy JSON-Antwort
        };
        return response.json();
    }
};