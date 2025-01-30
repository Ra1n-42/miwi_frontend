import { Challenge } from "@/types/challangeTypes";
import ChallengeHeader from "./ChallengeHeader";
import ChallengeSection from "./ChallengeSection";

import { useChallengeStore } from "@/store/useChallengeStore";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";


interface ChallengeCardProps {
  challenge: Challenge;
}
const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {

  const { addSection, saveChallenge } = useChallengeStore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!challenge.id) return;
    setIsSaving(true);
    try {
      await saveChallenge(challenge, toast);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mb-10 p-4 border rounded bg-neutral-950">
      <ChallengeHeader challenge={challenge} />
      {challenge.sections.map((section, index) => (
        <ChallengeSection
          key={index}
          challengeId={challenge.id}
          section={section}
          sectionIndex={index}
        />
      ))}
      <button
        onClick={() => challenge.id && addSection(challenge.id)}
        className="text-blue-500 hover:text-blue-700 mt-2"
      >
        + Sektion hinzufügen
      </button>
      <div className="flex justify-center">
        <button
          // className="bg-slate-500 px-5 py-1 hover:bg-slate-400"
          className={`bg-sky-500 rounded mt-3 px-5 py-1 ${isSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-sky-400"
            }`}
          onClick={handleSave}
          disabled={isSaving}
        >
          Speichern
        </button>
      </div>
    </div>
  );
};

export default ChallengeCard;
