import React from "react";
import { Section as SectionType } from "@/types/challangeTypes";
import Task from "./Task";

interface SectionProps {
  challengeId: string;
  section: SectionType;
  sectionIndex: number;
}

const Section: React.FC<SectionProps> = ({
  challengeId,
  section,
  sectionIndex,
}) => {
  return (
    <div className="mb-6 p-3 border rounded bg-gray-700">
      <div className="flex justify-between items-center mb-3">
        <input
          className="text-lg font-semibold bg-transparent text-white w-full"
          value={section.title}
        />
      </div>

      {/* Aufgaben */}
      {section.items.map((item, itemIndex) => (
        <Task
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

export default Section;
