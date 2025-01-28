import React, { useEffect, useState } from "react";
import { useChallenges } from "@/hooks/useChallanges";

const ChallengesManagement: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const {
    challenges,
    updateSectionTitle,
    fetchChallenges,
    updateSubchallengeText,
    toggleItemCompletion,
    updateItemText,
    addChallenge,
    saveChallenge,
    deleteChallenge,
    updateChallenge,
    addSection,
    deleteSection,
    addItem,
    deleteTask,
    addSubchallenge,
    deleteSubchallenge,
  } = useChallenges();
  // 📥 Challenges von der API laden
  useEffect(() => {
    const loadChallenges = async () => {
      setLoading(true);
      await fetchChallenges();
      setLoading(false);
    };
    loadChallenges();
  }, []);

  if (loading) {
    return <div>Loading challenges...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Challenges</h1>
      <button
        onClick={addChallenge}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-5"
      >
        Neue Challenge hinzufügen
      </button>

      {challenges.length === 0 ? (
        <div className="text-gray-400">
          Keine Challenges vorhanden. Klicke oben, um eine neue Challenge
          hinzuzufügen.
        </div>
      ) : (
        challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="mb-10 p-4 border rounded bg-gray-800"
          >
            {/* Header-Bereich */}
            <div className="border-b pb-4 mb-4">
              <input
                className="text-xl font-semibold bg-transparent text-white mb-2 w-full"
                value={challenge.header.title}
                onChange={(e) =>
                  updateChallenge(challenge.id, "title", e.target.value)
                }
              />
              <textarea
                className="text-gray-300 bg-transparent mb-2 w-full"
                value={challenge.header.description}
                onChange={(e) =>
                  updateChallenge(challenge.id, "description", e.target.value)
                }
              />
              <div className="flex ">
                <div>
                  Startzeit:
                  <input
                    className="start_time text-gray-500 bg-transparent mb-2 w-full bg-violet-50"
                    value={challenge.header.created_at}
                    onChange={(e) =>
                      updateChallenge(
                        challenge.id,
                        "created_at",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  Endzeit:
                  <input
                    className="end_time text-gray-500 bg-transparent mb-2 w-full bg-violet-50 ml-2"
                    value={challenge.header.challange_end}
                    onChange={(e) =>
                      updateChallenge(
                        challenge.id,
                        "challange_end",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              <button
                onClick={() => deleteChallenge(challenge.id)}
                className="text-red-500 hover:text-red-700"
              >
                Challenge löschen
              </button>
            </div>

            {/* Sektionen */}
            {challenge.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-4 broder">
                <div className="flex justify-between items-center">
                  <input
                    className="text-lg font-semibold bg-transparent text-white mb-2 w-full"
                    value={section.title}
                    onChange={(e) =>
                      updateSectionTitle(
                        challenge.id,
                        sectionIndex,
                        e.target.value
                      )
                    }
                  />
                  <button
                    className="deletesektion w-5 h-5 pb-1 bg-red-500 hover:bg-red-400 rounded-sm flex justify-center items-center"
                    onClick={() => deleteSection(challenge.id, sectionIndex)}
                  >
                    {" "}
                    x
                  </button>
                </div>

                {/* Aufgaben */}
                <ul className="list-disc pl-5 space-y-5">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center">
                      <div>
                        <div className="flex items-center space-y-1">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() =>
                              toggleItemCompletion(
                                challenge.id,
                                sectionIndex,
                                itemIndex
                              )
                            }
                            className="mr-2"
                          />

                          <input
                            className={`bg-transparent ${item.completed ? "line-through text-gray-400" : ""
                              }`}
                            value={item.text}
                            onChange={(e) =>
                              updateItemText(
                                challenge.id,
                                sectionIndex,
                                itemIndex,
                                e.target.value
                              )
                            }
                          />
                          <button
                            className="deletetask w-3 h-3 pb-1 bg-red-500 hover:bg-red-400 rounded-sm flex justify-center items-center ml-2"
                            onClick={() =>
                              deleteTask(challenge.id, sectionIndex, itemIndex)
                            }
                          >
                            x
                          </button>
                        </div>
                        {/* Sub-Aufgaben */}
                        {item.subchallenges &&
                          item.subchallenges.length > 0 && (
                            <div className="ml-5">
                              {item.subchallenges.map((sub, subIndex) => (
                                <div
                                  key={subIndex}
                                  className="flex items-center"
                                >
                                  <input
                                    type="text"
                                    className="bg-transparent w-full text-gray-300 ml-5"
                                    value={sub.text}
                                    onChange={(e) =>
                                      updateSubchallengeText(
                                        challenge.id,
                                        sectionIndex,
                                        itemIndex,
                                        subIndex,
                                        e.target.value
                                      )
                                    }
                                  />
                                  <button
                                    onClick={() =>
                                      deleteSubchallenge(
                                        challenge.id,
                                        sectionIndex,
                                        itemIndex,
                                        subIndex
                                      )
                                    }
                                    className="w-3.5 h-3.5 pb-1 bg-red-500 hover:bg-red-400 rounded-sm flex justify-center items-center ml-2"
                                  >
                                    x
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        <div
                          onClick={() =>
                            addSubchallenge(
                              challenge.id,
                              sectionIndex,
                              itemIndex
                            )
                          }
                          className="flex justify-end text-green-500 cursor-pointer hover:text-green-700"
                        >
                          + Subtask
                        </div>
                      </div>
                    </li>
                  ))}

                  <button
                    onClick={() => addItem(challenge.id, sectionIndex)}
                    className="text-green-500 hover:text-green-700"
                  >
                    + Aufgabe hinzufügen
                  </button>
                </ul>
              </div>
            ))}
            <button
              onClick={() => addSection(challenge.id)}
              className="text-blue-500 hover:text-blue-700"
            >
              + Sektion hinzufügen
            </button>
            <div className="flex justify-center">
              <button
                className="bg-slate-500 px-5 py-1 hover:bg-slate-400"
                onClick={() => saveChallenge(challenge)}
              >
                Speichern
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
export default ChallengesManagement;
