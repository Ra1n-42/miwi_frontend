import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Challenge as ChallengeData, Subtask } from "@/types/challangeTypes";

// Separate API function
const fetchChallenges = async (): Promise<ChallengeData[]> => {
  console.log("Fetching challenges from backend...");
  const response = await fetch("https://dev.miwi.tv/api/challange/all");
  if (!response.ok) {
    throw new Error("Failed to fetch challenges");
  }
  const data: ChallengeData[] = await response.json();
  return data.sort(
    (a, b) =>
      new Date(b.header.created_at).getTime() - new Date(a.header.created_at).getTime()
  );
};

function AccordionDemo({
  challenges,
  onSelectChallenge,
}: {
  challenges: ChallengeData[];
  onSelectChallenge: (challenge: ChallengeData) => void;
}) {
  const groupedByYear = challenges.reduce((acc: Record<string, ChallengeData[]>, challenge) => {
    const year = new Date(challenge.header.created_at).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(challenge);
    return acc;
  }, {});

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
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeData | null>(null);

  const { data: challenges = [], isLoading, error } = useQuery({
    queryKey: ["challenges"],
    queryFn: fetchChallenges,
    staleTime: 5 * 60 * 1000, // Data wird als "fresh" für 5 Minuten betrachtet
    gcTime: 30 * 60 * 1000,   // Cache wird für 30 Minuten behalten

  });

  useEffect(() => {
    if (challenges.length > 0 && !selectedChallenge) {
      setSelectedChallenge(challenges[0]);
    }
  }, [challenges, selectedChallenge]);

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
        <p className="text-red-500 text-lg">Error: {(error as Error).message}</p>
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

  const renderSubchallenges = (subchallenges: Subtask[]) => (
    <ul className="list-disc space-y-2">
      {subchallenges.map((sub, idx) => (
        <li
          key={idx}
          className={`flex items-start ${sub.completed ? "text-green-400" : "text-gray-300"}`}
        >
          {sub.completed ? <span className="mr-2">&#10003;</span> : <span className="mr-2">&#9679;</span>}
          {sub.text}
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
      <AccordionDemo challenges={challenges} onSelectChallenge={setSelectedChallenge} />

      <section className="flex flex-col space-y-8 w-full justify-center items-center lg:pl-10">
        {selectedChallenge ? (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">{selectedChallenge.header.title}</h1>
              <p
                dangerouslySetInnerHTML={{
                  __html: selectedChallenge.header.description,
                }}
              ></p>
              <p className="my-2 text-gray-400">
                {formatDateToDisplay(selectedChallenge.header.created_at)} - {formatDateToDisplay(selectedChallenge.header.challange_end)}
              </p>
            </div>

            <div className="space-y-6 max-w-4xl">
              {selectedChallenge.sections.map((section, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
                  <h3 className={`text-lg font-medium mb-2`}>{section.title}</h3>
                  <ul className="list-disc space-y-4 pl-6">
                    {section.items.map((item, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start ${item.completed ? "text-green-500" : "text-white"}`}
                      >
                        <div>
                          {item.completed ? (<span className="mr-2">&#10003;</span>) : (<span className="mr-2">&#9679;</span>)}
                          {item.text}
                          {item.subchallenges && item.subchallenges.length > 0 && (
                            <div className="ml-6 mt-2">{renderSubchallenges(item.subchallenges)}</div>
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
          <p className="text-gray-400">Bitte wähle eine Challenge aus der Liste aus.</p>
        )}
      </section>
    </div>
  );
}

export default Challenge;