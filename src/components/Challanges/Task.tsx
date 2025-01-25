import React from "react";
import { Task as TaskType } from "@/types/challangeTypes";
import Subtask from "./Subtask";

interface TaskProps {
  challengeId: string;
  sectionIndex: number;
  task: TaskType;
  taskIndex: number;
}

const Task: React.FC<TaskProps> = ({ challengeId, sectionIndex, task, taskIndex }) => {
  return (
    <div className="flex items-center space-x-2 mb-2">
      <input type="checkbox" checked={task.completed} />

      <input
        className={`bg-transparent text-white ${
          task.completed ? "line-through text-gray-400" : ""
        }`}
        value={task.text}
      />

      <button className="deletetask w-3 h-3 bg-red-500 hover:bg-red-400 rounded-sm flex justify-center items-center">
        x
      </button>

      {/* Subtasks */}
      {task.subchallenges.map((sub, subIndex) => (
        <Subtask
          key={subIndex}
          challengeId={challengeId}
          sectionIndex={sectionIndex}
          taskIndex={taskIndex}
          subtask={sub}
          subtaskIndex={subIndex}
        />
      ))}

      <button className="text-green-500 hover:text-green-700 ml-2">+ Subtask</button>
    </div>
  );
};

export default Task;
