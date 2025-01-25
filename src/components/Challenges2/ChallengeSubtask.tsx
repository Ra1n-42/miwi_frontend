import React from "react";
import { Subtask as SubtaskType } from "@/types/challangeTypes";
import { Input } from "@/components/ui/input";


interface SubtaskProps {
  challengeId: string | undefined;
  sectionIndex: number;
  taskIndex: number;
  subtask: SubtaskType;
  subtaskIndex: number;
}

const ChallengeSubtask: React.FC<SubtaskProps> = ({ subtask }) => {
  return (
    <div className="ml-8 flex items-center space-x-2">
      <Input
          type="text"
          onChange={() => console.log("first")}
          value={subtask.text}
          placeholder=""
        />
      <button className="w-3.5 h-3.5 bg-red-500 hover:bg-red-400 rounded-sm flex justify-center items-center pb-1">
        x
      </button>
    </div>
  );
};

export default ChallengeSubtask;
