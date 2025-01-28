import { Challenge } from "@/types/challangeTypes";
import ChallengeHeader from "./ChallengeHeader";
import ChallengeSection from "./ChallengeSection";

import { useChallengeStore } from "@/store/useChallengeStore";

interface ChallengeCardProps {
  challenge: Challenge;
}
const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {

  const { addSection } = useChallengeStore();
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
          className="bg-slate-500 px-5 py-1 hover:bg-slate-400"
          onClick={() => console.log(challenge)}
        >
          Speichern
        </button>
      </div>
    </div>
  );
};

export default ChallengeCard;
