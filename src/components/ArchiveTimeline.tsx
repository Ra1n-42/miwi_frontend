import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { API_BASE_URL } from "@/constants/api";
import "react-vertical-timeline-component/style.min.css";

// Typen definieren
interface Winner {
  username: string;
  placeholder?: string; // Für mögliche zukünftige Felder
}

interface Giveaway {
  title: string;
  description: string;
  preview: string;
  subscriberOnly: boolean;
  maxTickets: number;
  state: string;
  startedAt: string;
  endedAt: string;
  createdAt: string;
  winners: Winner[];
}

// API-Datenstruktur
interface GiveawaysResponse {
  total: number;
  giveaways: Giveaway[];
}
export function SkeletonDemo() {
  return (
    <div className="h-[81dvh] flex flex-col space-y-10 justify-center">
      <div className="flex items-center space-x-8 justify-center ">
        <Skeleton className="h-[125px] w-[250px] rounded-xl bg-slate-300" />
        <Skeleton className="h-12 w-12 rounded-full bg-slate-300" />
        <Skeleton className="h-4 w-[200px] bg-slate-300" />
      </div>
      <div className="flex items-center space-x-8 justify-center ">
        <Skeleton className="h-4 w-[200px] bg-slate-300" />
        <Skeleton className="h-12 w-12 rounded-full bg-slate-300" />
        <Skeleton className="h-[125px] w-[250px] rounded-xl bg-slate-300" />
      </div>
      <div className="flex items-center space-x-8 justify-center ">
        <Skeleton className="h-[125px] w-[250px] rounded-xl bg-slate-300" />
        <Skeleton className="h-12 w-12 rounded-full bg-slate-300" />
        <Skeleton className="h-4 w-[200px] bg-slate-300" />
      </div>
    </div>
  );
}
function ArchiveTimeline() {
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGiveaways = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/giveaways`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch giveaways");
        }

        const data: GiveawaysResponse = await response.json();

        // Sortieren nach `createdAt`, neueste zuerst
        const sortedGiveaways = data.giveaways.sort((a: any, b: any) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        setGiveaways(sortedGiveaways);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchGiveaways();
  }, []);

  if (isLoading) return <SkeletonDemo />;

  if (error) {
    return (
      <div>
        <p className="text-white">Error: {error}</p>
        <button
          className="bg-white p-2 rounded-md"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case "completed":
        return "gray"; // Grau für abgeschlossen
      case "running":
        return "green"; // Grün für aktiv
      case "cancelled":
        return "#F44336"; // Rot für abgebrochen
      default:
        return "yellow"; // Gelb für unbekannte Zustände
    }
  };
  return (
    <VerticalTimeline>
      {giveaways.map((giveaway, index) => (
        <VerticalTimelineElement
          key={index}
          dateClassName={
            index % 2 === 0
              ? "timeline-xl:ml-4 timeline-xl:text-left"
              : "timeline-xl:mr-4 timeline-xl:text-right"
          }
          contentStyle={{
            background:
              giveaway.state === "running" ? "rgb(76, 175, 80)" : "gray", // Grün für aktiv
            color: "#fff",
          }}
          contentArrowStyle={{
            borderRight:
              giveaway.state === "running"
                ? "7px solid rgb(76, 175, 80)" // Grün für aktiv
                : "7px solid gray",
          }}
          date={`${format(new Date(giveaway.createdAt), "dd.MM.yyyy")}${
            giveaway.state === "running" ? " - bis jetzt" : ""
          }`}
          iconStyle={{ background: getStateColor(giveaway.state) }}
        >
          <h3 className="text-xl font-bold">
            {giveaway.title}{" "}
            {giveaway.state === "running" && (
              <span className="text-sm text-yellow-300">(running)</span>
            )}
          </h3>
          <p>{giveaway.description}</p>
          {/* <p>{giveaway.state}</p> */}
          <p>
            <img src={`${giveaway.preview}`} alt="" />
          </p>
          <p>
            <strong>Winner:</strong>{" "}
            {giveaway.winners.length > 0
              ? giveaway.winners.map((winner) => winner.username).join(", ")
              : giveaway.state === "running"
              ? "wird noch entschieden"
              : "noch kein gewinner"}
          </p>
          <p>
            {giveaway.state === "running" && (
              <span>
                Startete am{" "}
                {format(new Date(giveaway.startedAt), "dd.MM.yyyy - HH:mm")} Uhr
              </span>
            )}
            {giveaway.state === "completed" && (
              <span>
                Endete am{" "}
                {format(new Date(giveaway.endedAt), "dd.MM.yyyy - HH:mm")} Uhr
              </span>
            )}
            {giveaway.state === "cancelled" && (
              <span>
                Abbruch am{" "}
                {format(new Date(giveaway.endedAt), "dd.MM.yyyy - HH:mm")} Uhr
              </span>
            )}
            {/* Option freihalten */}
            {giveaway.state === "upcoming" && (
              <span>
                Startet am{" "}
                {format(new Date(giveaway.startedAt), "dd.MM.yyyy - HH:mm")} Uhr
              </span>
            )}
          </p>
        </VerticalTimelineElement>
      ))}
    </VerticalTimeline>
  );
}

export default ArchiveTimeline;
