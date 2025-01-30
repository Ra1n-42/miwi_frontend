import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import { toBackendDateFormat, toInputDateFormat } from "@/utils/dateUtils";
import { Challenge } from "@/types/challangeTypes";

import { useChallengeStore } from "@/store/useChallengeStore";
import { useToast } from "@/hooks/use-toast";

interface ChallengeHeaderProps {
  challenge: Challenge;
}

function ChallengeHeader({ challenge }: ChallengeHeaderProps) {
  const { updateChallenge, deleteChallenge } = useChallengeStore();
  const { toast } = useToast();



  // Hilfsfunktion zur sicheren Datumkonvertierung
  const formatDateForInput = (dateString: string) => {
    try {
      if (!dateString) return "";

      // Check if date is already in yyyy-MM-dd format
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString;
      }

      // Split DD-MM-YYYY format
      const [day, month, year] = dateString.split("-").map(part => part.trim());

      if (!day || !month || !year) {
        console.error("Ungültiges Datumsformat:", dateString);
        return "";
      }

      // Ensure padding
      const paddedDay = day.padStart(2, "0");
      const paddedMonth = month.padStart(2, "0");

      // Return in YYYY-MM-DD format
      return `${year}-${paddedMonth}-${paddedDay}`;
    } catch (error) {
      console.error("Fehler bei der Datumsformatierung:", error);
      return "";
    }
  };

  // Diese Hilfsfunktion bleibt unverändert
  const handleDateChange = (key: "created_at" | "challange_end", value: string) => {
    if (!challenge.id) return;

    try {
      const [year, month, day] = value.split("-");
      const backendFormat = `${day}-${month}-${year}`;
      updateChallenge(challenge.id, key, backendFormat);
    } catch (error) {
      console.error("Fehler bei der Datumverarbeitung:", error);
      toast({
        variant: "destructive",
        description: "Ungültiges Datumsformat"
      });
    }
  };

  return (
    <div>
      {`Callange ID: ${challenge.id}`}
      <div className="border-b pb-4 mb-4">
        <div className="flex justify-end">
          <button
            className="text-white hover:bg-red-500 mt-2 bg-red-700 p-1 rounded-sm"
            onClick={() => challenge.id && deleteChallenge(challenge.id, toast)}
          >
            Challenge löschen
          </button>
        </div>
        <div className="grid w-full items-center gap-1.5 pb-1.5">
          <Label htmlFor="titel">Titel</Label>
          <Input
            type="text"
            id="titel"
            onChange={(e) =>
              challenge.id &&
              updateChallenge(challenge.id, "title", e.target.value)
            }
            value={challenge.header.title}
            placeholder="Titel"
          />
        </div>
        <div className="grid w-full gap-1.5 pb-1.5">
          <Label htmlFor="message">Challange Beschreibung</Label>
          <Textarea
            placeholder="Hier kommt die Beschreibung."
            onChange={(e) =>
              challenge.id &&
              updateChallenge(challenge.id, "description", e.target.value)
            }
            value={challenge.header.description}
            id="message"
          />
        </div>
        <div className="flex space-x-4">
          <div>
            <Label htmlFor="start_time">Die Startzeit</Label>

            <input
              type="date"
              onChange={(e) => handleDateChange("created_at", e.target.value)}
              value={formatDateForInput(challenge.header.created_at)}
              id="start_time"
              className="text-gray-500 bg-transparent bg-violet-50 w-full"
            />
          </div>
          <div>
            <Label htmlFor="end_time">Die Endzeit</Label>
            <input
              type="date"
              onChange={(e) => handleDateChange("challange_end", e.target.value)}
              value={formatDateForInput(challenge.header.challange_end)}
              id="end_time"
              className="text-gray-500 bg-transparent bg-violet-50 w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChallengeHeader;
