import { Challenge } from "@/types/challangeTypes";
import ChallengeHeader from "./ChallengeHeader";
import ChallengeSection from "./ChallengeSection";

interface ChallengeCardProps {
  challenge: Challenge;
}
const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
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
        // onClick={() => addSection(challenge.id)}
        className="text-blue-500 hover:text-blue-700 mt-2"
      >
        + Sektion hinzufügen
      </button>
    </div>
  );
};

export default ChallengeCard;
