import { Challenge } from "@/types/challangeTypes";
import ChallangeHeader from "./ChallangeHeader";

interface ChallengeCardProps {
  challenge: Challenge;
}
const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  return (
    <div className="mb-10 p-4 border rounded bg-gray-800 ">
      <ChallangeHeader challenge={challenge} />
      {/* Sektionen */}
      {/* {challenge.sections.map((section, index) => (
        <Section
          key={index}
          challengeId={challenge.id}
          section={section}
          sectionIndex={index}
        />
      ))} */}
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
