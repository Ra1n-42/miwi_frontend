import { Button } from "@/components/ui/button";
import { Twitch } from "lucide-react";
import { API_BASE_URL } from "@/constants/api";

export default function Login() {
  const handleLogin = () => {
    // API-Endpunkt aufrufen, der Twitch-OAuth einleitet
    window.location.href = `${API_BASE_URL}/login`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-[82dvh]">
      <h1 className="text-3xl font-bold text-white mb-6">
        Sign In with Twitch
      </h1>
      <Button onClick={handleLogin} className="bg-purple-600 text-white">
        <Twitch />
        Sign In
      </Button>
    </div>
  );
}
