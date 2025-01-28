import React from "react";
import { Task as TaskType } from "@/types/challangeTypes";
import { Input } from "@/components/ui/input";
import ChallengeSubtask from "./ChallengeSubtask";

import { useChallengeStore } from "@/store/useChallengeStore";

interface TaskProps {
  challengeId: string | undefined;
  sectionIndex: number;
  task: TaskType;
  taskIndex: number;
}


const ChallangeTask: React.FC<TaskProps> = ({ challengeId, sectionIndex, task, taskIndex }) => {
  const { deleteTask, toggleItemCompletion, updateTaskText, addSubchallenge } = useChallengeStore();
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">

        <input type="checkbox" className="w-5 h-5" checked={task.completed}
          onChange={() => challengeId &&
            toggleItemCompletion(
              challengeId,
              sectionIndex,
              taskIndex
            )
          }
        />

        <Input
          type="text"
          className="Tasktitel"
          onChange={(e) => challengeId &&
            updateTaskText(
              challengeId,
              sectionIndex,
              taskIndex,
              e.target.value
            )
          }
          value={task.text}
          placeholder=""
        />

        <button className="deletetask w-5 h-5 bg-red-500 hover:bg-red-400 rounded-sm flex items-center justify-center pb-1"
          onClick={() => challengeId && deleteTask(challengeId, sectionIndex, taskIndex)}
        >x</button>
      </div>
      <div className="ml-5 space-y-2 flex flex-col">
        {/* Subtasks */}
        {task.subchallenges.map((sub, subIndex) => (
          <div className="w-full">
            {"Subtask_id: " + sub.id}


            <ChallengeSubtask
              key={subIndex}
              challengeId={challengeId}
              sectionIndex={sectionIndex}
              taskIndex={taskIndex}
              subtask={sub}
              subtaskIndex={subIndex}
            />
          </div>
        ))}
        <div className="w-full flex justify-start">
          <button className="text-green-500 hover:text-green-700 pr-7 pb-5"
            onClick={() => challengeId &&
              addSubchallenge(
                challengeId,
                sectionIndex,
                taskIndex
              )
            }
          >+ Subtask</button>
        </div>
      </div>
    </div>
  )
}

export default ChallangeTask