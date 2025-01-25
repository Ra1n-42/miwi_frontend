import { useEffect, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function AccordionDemo({
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
        .sort(([a], [b]) => Number(b) - Number(a)) // Nach Jahr absteigend sortieren
        .map(([year, challengesInYear]) => (
          <AccordionItem key={year} value={`year-${year}`}>
            <AccordionTrigger>{year}</AccordionTrigger>
            <AccordionContent className="space-y-2">
              {challengesInYear.map((challenge) => (
                <div
                  key={challenge.id}
                  className="cursor-pointer hover:underline hover:underline-offset-3"
                  onClick={() => onSelectChallenge(challenge)} // Setzt die ausgewählte Challenge
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


interface ChallengeData {
  id: string;
  header: {
    title: string;
    description: string;
    created_at: string;
    challange_end: string;
    timeframe: string;
  };
  sections: Section[];
  archived: boolean;
}

interface Section {
  title: string;
  items: Item[];
}

interface Item {
  text: string;
  completed: boolean;
  subchallenges: SubItem[];
}
interface SubItem {
  text: string;
  completed: boolean;
}

function Challenge() {
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    const fetchChallengeData = async () => {
      try {
        const response = await fetch("https://dev.miwi.tv/api/challange/all"); 
        // const response = await fetch("/challanges.json"); // Mockup
        if (response.ok) {
          const data: ChallengeData[] = await response.json();
          // Challenges nach Datum sortieren (neueste zuerst)
          const sortedData = data.sort(
            (a, b) =>
              new Date(b.header.created_at).getTime() - new Date(a.header.created_at).getTime()
          );
          setChallenges(sortedData);
          setSelectedChallenge(sortedData[0]);
        } else {
          console.error("Fehler beim Abrufen der Challenges.");
          setChallenges([]);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Challenges:", error);
        setChallenges([]);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchChallengeData();
  }, []);
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white text-lg">Loading...</p>
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
  const renderSubchallenges = (subchallenges:SubItem[]) => (
    <ul className="list-disc space-y-2">
      {subchallenges.map((sub, idx) => (
        <li
          key={idx}
          className={`flex items-start ${
            sub.completed ? "text-green-400" : "text-gray-300"
          }`}
          >
          {sub.completed ? <span className="mr-2">&#10003;</span> : <span className="mr-2">&#9679;</span>}
          {sub.text}
        </li>
      ))}
    </ul>
  );
  const formatDateToDisplay = (dateString: string) => { // YYYY-MM-DD -> DD.MM.YYYY 
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}.${month}.${year}`;
  };
  return (
    <div className="flex flex-col lg:flex-row py-10 px-4 sm:px-8 lg:px-16 text-white">
      {/* Accordion Section */}
      <AccordionDemo challenges={challenges} onSelectChallenge={setSelectedChallenge} />

      {/* Details Section */}
      <section className="flex flex-col space-y-8 w-full justify-center items-center lg:pl-10">
        {selectedChallenge ? (
          <>
            {/* Header */}
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

            {/* Sections */}
            <div className="space-y-6 max-w-4xl">
              {selectedChallenge.sections.map((section, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
                  <h3 className={`text-lg font-medium mb-2`}>{section.title}</h3>
                  <ul className="list-disc space-y-4 pl-6">
                    {section.items.map((item, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start ${
                          item.completed ? "text-green-500" : "text-white"
                        }`}
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
