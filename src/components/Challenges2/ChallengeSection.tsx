import React from "react";
import { Section as SectionType } from "@/types/challangeTypes";
import { Input } from "@/components/ui/input";
import ChallangeTask from "./ChallengeTask";

interface SectionProps {
  challengeId: string | undefined;
  section: SectionType;
  sectionIndex: number;
}

const ChallengeSection: React.FC<SectionProps> = ({
  challengeId,
  section,
  sectionIndex,
}) => {
  return (
    <div className="mb-6 p-3 border rounded bg-neutral-700">
      <div className="flex justify-between items-center mb-3">

        <Input
          type="text"
          onChange={() => console.log("first")}
          value={section.title}
          placeholder=""
        />
      </div>

      {/* Aufgaben */}
      {section.items.map((item, itemIndex) => (
        <ChallangeTask
          key={itemIndex}
          challengeId={challengeId}
          sectionIndex={sectionIndex}
          task={item}
          taskIndex={itemIndex}
        />
      ))}

      <button className="text-green-500 hover:text-green-700 mt-2">
        + Aufgabe hinzufügen
      </button>
    </div>
  );
};

export default ChallengeSection;
