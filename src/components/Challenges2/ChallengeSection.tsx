import React from "react";
import { Section as SectionType } from "@/types/challangeTypes";
import { Input } from "@/components/ui/input";
import ChallangeTask from "./ChallengeTask";

import { useChallengeStore } from "@/store/useChallengeStore";


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
  const { addTask, deleteSection, updateSectionTitle } = useChallengeStore();

  return (
    <div className="mb-6 p-3 border rounded bg-neutral-700">
      <div className="flex justify-end">
        <button
          className="deletesektion p-1 bg-red-500 hover:bg-red-400 rounded-sm flex justify-center items-center"
          onClick={() => challengeId && deleteSection(challengeId, sectionIndex)}
        >
          Section löschen
        </button>
      </div>
      <div className="flex justify-between items-center mb-3 flex-col">
        {"ID: " + section.id}
        <div className="flex items-center space-x-2 w-full">
          <label htmlFor="titel">Titel</label>
          <Input
            type="text"
            id="titel"
            className="Sectiontitle"
            onChange={(e) => challengeId && updateSectionTitle(challengeId, sectionIndex, e.target.value)}
            value={section.title}
            placeholder=""
          />
        </div>
      </div>
      {/* Aufgaben */}
      {section.items.map((item, itemIndex) => (
        <div>

          {"ID: " + item.id}
          <ChallangeTask
            key={itemIndex}
            challengeId={challengeId}
            sectionIndex={sectionIndex}
            task={item}
            taskIndex={itemIndex}
          />
        </div>
      ))}

      <button className="text-green-500 hover:text-green-700 mt-2"
        onClick={() => challengeId && addTask(challengeId, sectionIndex)}
      >
        + Aufgabe hinzufügen
      </button>
    </div>
  );
};

export default ChallengeSection;
