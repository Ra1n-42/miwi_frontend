import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaDiscord } from "react-icons/fa";
import { BellRing } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/UserContext";
import { getRoleName } from "@/types/User";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/constants/api";

function Me() {
  const { user } = useUser();
  const roleName = getRoleName(user?.role ?? 3);
  async function logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include", // Sendet Cookies mit
      });

      if (response.ok) {
        window.location.href = "/login"; // Weiterleitung nach erfolgreichem Logout
      } else {
        console.error("Logout fehlgeschlagen");
      }
    } catch (error) {
      console.error("Fehler beim Logout:", error);
    }
  }
  return (
    <div className="flex flex-col justify-center items-center h-[80dvh]">
      {/* <div className="text-white text-2xl font-bold">Mockup</div> */}
      <Card className="flex flex-col items-center ">
        <CardHeader className="flex justify-center items-center">
          <CardTitle className="text-2xl">{user?.display_name}</CardTitle>
          <CardDescription>{roleName}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {/* Button wird nur angezeigt, wenn die Rolle unter 3 ist */}
          {user?.role !== undefined && user.role < 3 && (
            <a href="/management" className="flex justify-center items-center">
              <Button variant="outline">Management Panel</Button>
            </a>
          )}
          <div className=" flex items-center space-x-4 rounded-md border p-4">
            <BellRing />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                Push Notifications
              </p>
              <p className="text-sm text-muted-foreground">
                Send Giveaway notifications to email.
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
        <Separator className="w-[15rem]" />
        <CardFooter className="flex flex-col mt-5 space-y-4 ">
          <div className="Links space-y-1">
            <Button variant="outline">
              <p>Link to Discord</p>
              <FaDiscord />
            </Button>
          </div>
          <Button onClick={logout} variant="destructive">
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Me;
