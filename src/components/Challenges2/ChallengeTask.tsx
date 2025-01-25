import React from "react";
import { Task as TaskType } from "@/types/challangeTypes";
import { Input } from "@/components/ui/input";
import ChallengeSubtask from "./ChallengeSubtask";

interface TaskProps {
  challengeId: string | undefined;
  sectionIndex: number;
  task: TaskType;
  taskIndex: number;
}


const ChallangeTask: React.FC<TaskProps> = ({ challengeId, sectionIndex, task, taskIndex }) =>{
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">

        <input type="checkbox" className="w-5 h-5" checked={task.completed} />

        <Input
          type="text"
          onChange={() => console.log("first")}
          value={task.text}
          placeholder=""
        />

        <button className="deletetask w-5 h-5 bg-red-500 hover:bg-red-400 rounded-sm flex items-center justify-center pb-1">x</button>
      </div>
      <div className="ml-5 space-y-2 flex flex-col"> 

        {/* Subtasks */}
        {task.subchallenges.map((sub, subIndex) => (
          <ChallengeSubtask
            key={subIndex}
            challengeId={challengeId}
            sectionIndex={sectionIndex}
            taskIndex={taskIndex}
            subtask={sub}
            subtaskIndex={subIndex}
          />
        ))}
        <div className="w-full flex justify-end">

          <button className="text-green-500 hover:text-green-700 pr-7 pb-5">+ Subtask</button>
        </div>
      </div>
    </div>
  )
}

export default ChallangeTask