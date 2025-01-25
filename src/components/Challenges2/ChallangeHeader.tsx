import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatDate2 } from "@/utils/dateUtils";
import { Challenge } from "@/types/challangeTypes";

interface ChallengeHeaderProps {
  challenge: Challenge;
}

function ChallangeHeader({ challenge }: ChallengeHeaderProps) {
  return (
    <div>
      {`Callange ID: ${challenge.id}`}
      <div className="border-b pb-4 mb-4">
        <div className="flex justify-end">
          <button className="text-red-500 hover:text-red-700 mt-2">
            Challenge löschen
          </button>
        </div>
        <div className="grid w-full items-center gap-1.5 pb-1.5">
          <Label htmlFor="titel">Titel</Label>
          <Input
            type="text"
            id="titel"
            onChange={() => console.log("first")}
            value={challenge.header.title}
            placeholder="Titel"
          />
        </div>
        <div className="grid w-full gap-1.5 pb-1.5">
          <Label htmlFor="message">Challange Beschreibung</Label>
          <Textarea
            placeholder="Hier kommt die Beschreibung."
            onChange={() => console.log("second")}
            value={challenge.header.description}
            id="message"
          />
        </div>
        <div className="flex space-x-4">
          <div>
            <Label htmlFor="start_time">Die Startzeit</Label>
            <input
              type="date"
              onChange={() => console.log("lol")}
              defaultValue={formatDate2(challenge.header.created_at)}
              id="start_time"
              className="text-gray-500 bg-transparent bg-violet-50 w-full"
            />
          </div>
          <div>
            <Label htmlFor="end_time">Die Endzeit</Label>
            <input
              type="date"
              onChange={() => console.log("lol2")}
              defaultValue={formatDate2(challenge.header.challange_end)}
              id="end_time"
              className="text-gray-500 bg-transparent bg-violet-50 w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChallangeHeader;
