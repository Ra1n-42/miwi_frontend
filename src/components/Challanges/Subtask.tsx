import React from "react";
import { Subtask as SubtaskType } from "@/types/challangeTypes";

interface SubtaskProps {
  challengeId: string;
  sectionIndex: number;
  taskIndex: number;
  subtask: SubtaskType;
  subtaskIndex: number;
}

const Subtask: React.FC<SubtaskProps> = ({ subtask }) => {
  return (
    <div className="ml-8 flex items-center space-x-2">
      <input
        type="text"
        className="bg-transparent text-gray-300"
        value={subtask.text}
      />
      <button className="w-3 h-3 bg-red-500 hover:bg-red-400 rounded-sm flex justify-center items-center">
        x
      </button>
    </div>
  );
};

export default Subtask;
