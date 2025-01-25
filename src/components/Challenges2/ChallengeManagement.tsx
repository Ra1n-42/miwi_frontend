import { useChallengeStore } from "@/store/useChallengeStore";
import ChallengeCard from "./ChallengeCard";
import { useEffect } from "react";

const ChallengeManagement = () => {
  const { challenges, fetchChallenges } = useChallengeStore();

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  return (
    <div>
      <button
        // onClick={addChallenge} (kann später hinzugefügt werden)
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-5"
      >
        Neue Challenge hinzufügen
      </button>
      {/* Anzeige der Challenges */}

      {challenges.length > 0 ? (
        challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))
      ) : (
        <p className="text-gray-500">Keine Challenges verfügbar.</p>
      )}
    </div>
  );
};

export default ChallengeManagement;
