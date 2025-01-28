import React from "react";
import { Subtask as SubtaskType } from "@/types/challangeTypes";
import { Input } from "@/components/ui/input";
import { useChallengeStore } from "@/store/useChallengeStore";

interface SubtaskProps {
  challengeId: string | undefined;
  sectionIndex: number;
  taskIndex: number;
  subtask: SubtaskType;
  subtaskIndex: number;
}

const ChallengeSubtask: React.FC<SubtaskProps> = ({ subtask, challengeId, sectionIndex, taskIndex, subtaskIndex }) => {
  const { updateSubchallengeText, deleteSubchallenge } = useChallengeStore();
  return (
    <div className="ml-8 flex items-center space-x-2">
      <Input
        type="text"
        onChange={(e) => challengeId && updateSubchallengeText(
          challengeId,
          sectionIndex,
          taskIndex,
          subtaskIndex,
          e.target.value)}
        value={subtask.text}
        placeholder=""
      />
      <button className="w-3.5 h-3.5 bg-red-500 hover:bg-red-400 rounded-sm flex justify-center items-center pb-1"
        onClick={() => challengeId && deleteSubchallenge(challengeId, sectionIndex, taskIndex, subtaskIndex)}
      >
        x
      </button>
    </div>
  );
};

export default ChallengeSubtask;
