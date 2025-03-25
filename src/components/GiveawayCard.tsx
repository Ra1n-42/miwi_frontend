import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

interface GiveawayProps {
    title: string;
    description: string;
    preview?: string;
    subscriberOnly: boolean;
    maxTickets: number;
    state: string;
    winners: { username: string }[];
}

export default function GiveawayCard({ giveaway }: { giveaway: GiveawayProps }) {
    return (
        <Card className="bg-gradient-to-br from-transparent to-neutral-950 p-4 shadow-md">
            {/* Falls ein Bild vorhanden ist, anzeigen */}
            {giveaway.preview ? (
                <img
                    src={giveaway.preview}
                    alt={giveaway.title}
                    className="w-full h-44 object-cover rounded-t-lg"
                />
            ) : null}

            <CardHeader>
                <CardTitle className="text-lg font-bold">{giveaway.title}</CardTitle>
                <CardDescription className="text-sm text-neutral-400">
                    {giveaway.description || "Kein Beschreibungstext verfügbar"}
                </CardDescription>
            </CardHeader>

            <CardContent className="text-sm space-y-2">
                {/* Statusanzeige */}
                <p className={`text-sm font-semibold ${giveaway.state === "running" ? "text-green-400" : "text-red-400"}`}>
                    {giveaway.state === "running" ? "✅ Läuft noch!" : "❌ Beendet"}
                </p>

                {/* Subscriber-Only Hinweis */}
                {giveaway.subscriberOnly && (
                    <p className="text-yellow-400 font-medium">🔒 Nur für Abonnenten</p>
                )}

                {/* Gewinner-Anzeige */}
                {giveaway.winners.length > 0 ? (
                    <p className="text-blue-400">
                        🎉 Gewinner: <span className="font-bold">{giveaway.winners[0].username}</span>
                    </p>
                ) : (
                    <p className="text-gray-400">Noch kein Gewinner</p>
                )}
            </CardContent>

            <CardFooter className="text-xs text-neutral-400">
                🎟️ Maximale Tickets: {giveaway.maxTickets}
            </CardFooter>
        </Card>
    );
}
