import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Challenge as ChallengeData,
  Subtask,
  Task,
} from "@/types/challangeTypes";
import { API_BASE_URL, API_ENDPOINTS, IS_DEV, IS_LOCAL } from "@/constants/api";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/context/UserContext";

// Separate API function
const fetchChallenges = async (): Promise<ChallengeData[]> => {
  // console.log("Fetching challenges from backend...");
  if (IS_DEV && IS_LOCAL) {
    const response = await fetch(`/data/challanges.json`);
    const data: ChallengeData[] = await response.json();
    return data.sort(
      (a, b) =>
        new Date(b.header.created_at).getTime() -
        new Date(a.header.created_at).getTime()
    );
  } else {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.CHALLENGE.ALL}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch challenges");
    }
    const data: ChallengeData[] = await response.json();
    console.log(data);
    return data.sort(
      (a, b) =>
        new Date(b.header.created_at).getTime() -
        new Date(a.header.created_at).getTime()
    );
  }
};

function AccordionDemo({
  challenges,
  onSelectChallenge,
}: {
  challenges: ChallengeData[];
  onSelectChallenge: (challenge: ChallengeData) => void;
}) {
  const groupedByYear = challenges.reduce(
    (acc: Record<string, ChallengeData[]>, challenge) => {
      const year = new Date(challenge.header.created_at)
        .getFullYear()
        .toString();
      if (!acc[year]) acc[year] = [];
      acc[year].push(challenge);
      return acc;
    },
    {}
  );

  return (
    <Accordion type="single" collapsible className="min-w-[305px]">
      {Object.entries(groupedByYear)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, challengesInYear]) => (
          <AccordionItem key={year} value={`year-${year}`}>
            <AccordionTrigger>{year}</AccordionTrigger>
            <AccordionContent className="space-y-2">
              {challengesInYear.map((challenge) => (
                <div
                  key={challenge.id}
                  className="cursor-pointer hover:underline hover:underline-offset-3"
                  onClick={() => onSelectChallenge(challenge)}
                >
                  {challenge.header.title}
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
}

function Challenge() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const {
    data: challenges = [],
    isLoading: challengesLoading,
    error,
  } = useQuery({
    queryKey: ["challenges"],
    queryFn: fetchChallenges,
    staleTime: 1000,
    gcTime: 6000,
  });

  // Memoized state to prevent unnecessary re-renders
  const [selectedChallenge, setSelectedChallenge] =
    useState<ChallengeData | null>(null);

  useEffect(() => {
    if (!selectedChallenge && challenges.length > 0) {
      setSelectedChallenge(challenges[0]);
    }
  }, [challenges, selectedChallenge]);

  const updateTaskMutation = useMutation({
    mutationFn: async ({
      id,
      completed,
    }: {
      id: Task["id"];
      completed: boolean;
    }) => {
      // Uncomment this section when ready to connect to backend
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.CHALLENGE.BASE
        }${API_ENDPOINTS.CHALLENGE.TASK(id)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      console.log("fetch to Task", id, completed);
      return { id, completed };
    },
    onSuccess: ({ id, completed }) => {
      queryClient.setQueryData(
        ["challenges"],
        (oldChallenges: ChallengeData[] | undefined) => {
          if (!oldChallenges) return oldChallenges;

          return oldChallenges.map((challenge) => ({
            ...challenge,
            sections: challenge.sections.map((section) => ({
              ...section,
              items: section.items.map((item) =>
                item.id === id ? { ...item, completed } : item
              ),
            })),
          }));
        }
      );
    },
  });

  const updateSubtaskMutation = useMutation({
    mutationFn: async ({
      id,
      completed,
    }: {
      id: Subtask["id"];
      completed: boolean;
    }) => {
      // API call to update subtask
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.CHALLENGE.BASE
        }${API_ENDPOINTS.CHALLENGE.SUB(id)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update subtask");
      }

      console.log("fetch to subtask/", id, completed);
      return { id, completed };
    },
    onSuccess: ({ id, completed }) => {
      queryClient.setQueryData(
        ["challenges"],
        (oldChallenges: ChallengeData[] | undefined) => {
          if (!oldChallenges) return oldChallenges;

          return oldChallenges.map((challenge) => ({
            ...challenge,
            sections: challenge.sections.map((section) => ({
              ...section,
              items: section.items.map((item) => ({
                ...item,
                subchallenges: item.subchallenges?.map((subtask) =>
                  subtask.id === id ? { ...subtask, completed } : subtask
                ),
              })),
            })),
          }));
        }
      );
    },
  });

  const isLoading = challengesLoading;
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">
          Error: {(error as Error).message}
        </p>
      </div>
    );
  }

  if (!challenges.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">Keine Challenges gefunden!</p>
      </div>
    );
  }

  const handleToggleTask = (id: Task["id"], checked: boolean) => {
    if (!selectedChallenge) return;

    // Update local state first for immediate UI feedback
    const updatedChallenge = {
      ...selectedChallenge,
      sections: selectedChallenge.sections.map((section) => ({
        ...section,
        items: section.items.map((item) => {
          if (item.id === id) {
            return { ...item, completed: checked };
          }
          return item;
        }),
      })),
    };

    setSelectedChallenge(updatedChallenge);

    // Then send mutation to backend
    updateTaskMutation.mutate({ id, completed: checked });
    console.log("Task toggled", id, checked);
  };

  const handleToggleSubchallenge = (id: Subtask["id"], checked: boolean) => {
    if (!selectedChallenge) return;

    // Update local state first for immediate UI feedback
    const updatedChallenge = {
      ...selectedChallenge,
      sections: selectedChallenge.sections.map((section) => ({
        ...section,
        items: section.items.map((item) => ({
          ...item,
          subchallenges: item.subchallenges?.map((subtask) => {
            if (subtask.id === id) {
              return { ...subtask, completed: checked };
            }
            return subtask;
          }),
        })),
      })),
    };

    setSelectedChallenge(updatedChallenge);

    // Then send mutation to backend
    updateSubtaskMutation.mutate({ id, completed: checked });
    console.log("Subchallenge toggled", id, checked);
  };

  const renderSubchallenges = (subchallenges: Subtask[]) => (
    <ul className="list-disc space-y-2">
      {subchallenges.map((sub, idx) => (
        <li
          key={idx}
          className={`flex items-start ${sub.completed ? "text-green-400" : "text-gray-300"
            }`}
        >
          {sub.completed ? (
            <span className="mr-2">&#10003;</span>
          ) : (
            <span className="mr-2">&#9679;</span>
          )}
          {sub.text}
          {[0, 1, 2].includes(user?.role ?? 3) && (
            <Switch
              className="ml-auto"
              checked={sub.completed}
              onCheckedChange={(checked) =>
                handleToggleSubchallenge(sub.id, checked)
              }
            />
          )}
        </li>
      ))}
    </ul>
  );

  const formatDateToDisplay = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="flex flex-col lg:flex-row py-10 px-4 sm:px-8 lg:px-16 text-white">
      <AccordionDemo
        challenges={challenges}
        onSelectChallenge={setSelectedChallenge}
      />

      <section className="flex flex-col space-y-8 w-full justify-center items-center lg:pl-10 px-2">
        {selectedChallenge ? (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">
                {selectedChallenge.header.title}
              </h1>
              <p
                dangerouslySetInnerHTML={{
                  __html: selectedChallenge.header.description,
                }}
              ></p>
              <p className="my-2 text-gray-400">
                {formatDateToDisplay(selectedChallenge.header.created_at)} -{" "}
                {formatDateToDisplay(selectedChallenge.header.challange_end)}
              </p>
            </div>

            <div className="space-y-6 max-w-4xl">
              {selectedChallenge.sections.map((section, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-4 rounded-lg shadow-md"
                >
                  <h3 className={`text-lg font-medium mb-2`}>
                    {section.title}
                  </h3>
                  <ul className="list-disc space-y-4 pl-6">
                    {section.items.map((item, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start ${item.completed ? "text-green-500" : "text-white"
                          }`}
                      >
                        <div>
                          <div>
                            {item.completed ? (
                              <span className="mr-2">&#10003;</span>
                            ) : (
                              <span className="mr-2">&#9679;</span>
                            )}
                            {item.text}
                            {[0, 1, 2].includes(user?.role ?? 3) && (
                              <Switch
                                className="ml-auto"
                                checked={item.completed}
                                onCheckedChange={(checked) =>
                                  handleToggleTask(item.id, checked)
                                }
                              />
                            )}
                          </div>
                          {item.subchallenges &&
                            item.subchallenges.length > 0 && (
                              <div className="ml-6 mt-2">
                                {renderSubchallenges(item.subchallenges)}
                              </div>
                            )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-400">
            Bitte wähle eine Challenge aus der Liste aus.
          </p>
        )}
      </section>
    </div>
  );
}

export default Challenge;