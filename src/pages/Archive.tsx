import { useEffect, useState } from "react";
import { Timeline } from "@/components/Timeline";
import GiveawayCard from "@/components/GiveawayCard";

import { API_BASE_URL, IS_LOCAL } from "@/constants/api";

interface TimelineEntry {
    title: string;
    content: React.ReactNode;
}
type DateFormat = "year" | "month-year" | "day-month-year";

export default function TimelineDemo({ dateFormat = "day-month-year" }: { dateFormat?: DateFormat }) {
    const [timelineData, setTimelineData] = useState<TimelineEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const formatDate = (dateString: string, format: DateFormat): string => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            ...(format !== "year" && { month: "long" }),
            ...(format === "day-month-year" && { day: "numeric" }),
        };
        return date.toLocaleDateString("de-DE", options);
    };
    useEffect(() => {
        const fetchGiveaways = async () => {
            try {
                const url = IS_LOCAL
                    ? "/data/mockGiveaways.json" // Lokale Datei in Dev
                    : `${API_BASE_URL}/giveaways`; // API in Prod
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Failed to fetch giveaways");
                }
                const giveawaysData = await response.json();
                const formattedData = giveawaysData.giveaways.map((giveaway: any) => ({
                    title: formatDate(giveaway.startedAt, dateFormat),
                    content: (
                        <div>
                            {/* <p className="text-neutral-200 text-xs md:text-lg font-normal mb-8">
                                {giveaway.title}
                            </p> */}
                            <div className="grid grid-cols-1 gap-4">
                                {giveaway.preview ? (
                                    <img
                                        src={giveaway.preview}
                                        alt={giveaway.title}
                                        width={500}
                                        height={500}
                                        className="rounded-lg object-cover h-20 md:h-44 lg:h-40 w-full shadow-md"
                                    />
                                ) : (
                                    <GiveawayCard giveaway={giveaway} />

                                )}
                            </div>
                        </div>
                    )
                }));
                setTimelineData(formattedData);
            } catch (error) {
                console.error("Error fetching giveaways:", error);
            } finally {
                setLoading(false); // Nach dem Laden Ladezustand auf false setzen
            }
        };

        fetchGiveaways();
    }, []);

    return (
        <div className="items-center">
            {loading ? ( // Falls Daten noch geladen werden, Ladeanzeige anzeigen
                <p className="text-center text-neutral-400">Lädt...</p>
            ) : (
                <Timeline data={timelineData} />
            )}
        </div>
    );
}