import React from "react";
import { Challenge } from "@/types/challangeTypes";
import Section from "./Section";

interface ChallengeCardProps {
  challenge: Challenge;
  updateChallenge: (
    id: string,
    key: keyof Challenge["header"],
    value: string
  ) => void;
  deleteChallenge: (id: string) => void;
  addSection: (challengeId: string) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  updateChallenge,
  deleteChallenge,
  addSection,
}) => {
  return (
    <div className="mb-10 p-4 border rounded bg-gray-800">
      {/* Header */}
      <div className="border-b pb-4 mb-4">
        <input
          className="text-xl font-semibold bg-transparent text-white mb-2 w-full"
          value={challenge.header.title}
          onChange={(e) =>
            updateChallenge(challenge.id, "title", e.target.value)
          }
        />
        <textarea
          className="text-gray-300 bg-transparent mb-2 w-full"
          value={challenge.header.description}
          onChange={(e) =>
            updateChallenge(challenge.id, "description", e.target.value)
          }
        />
        <div className="flex space-x-4">
          <input
            type="date"
            className="start_time text-gray-500 bg-transparent bg-violet-50 w-full"
            value={challenge.header.created_at}
            onChange={(e) =>
              updateChallenge(challenge.id, "created_at", e.target.value)
            }
          />
          <input
            type="date"
            className="end_time text-gray-500 bg-transparent bg-violet-50 w-full"
            value={challenge.header.challange_end}
            onChange={(e) =>
              updateChallenge(challenge.id, "challange_end", e.target.value)
            }
          />
        </div>
        <button
          onClick={() => deleteChallenge(challenge.id)}
          className="text-red-500 hover:text-red-700 mt-2"
        >
          Challenge löschen
        </button>
      </div>

      {/* Sektionen */}
      {challenge.sections.map((section, index) => (
        <Section
          key={index}
          challengeId={challenge.id}
          section={section}
          sectionIndex={index}
        />
      ))}

      <button
        onClick={() => addSection(challenge.id)}
        className="text-blue-500 hover:text-blue-700 mt-2"
      >
        + Sektion hinzufügen
      </button>
    </div>
  );
};

export default ChallengeCard;
