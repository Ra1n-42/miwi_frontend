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
      {/* <Button onClick={handleLogin} className="bg-purple-600 text-white">
        <Twitch />
        Sign In
      </Button> */}
      <button onClick={handleLogin} className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
          <div className="flex items-center justify-center space-x-2">
            <Twitch />
            <span>Sign In</span>
          </div>
        </span>
      </button>
    </div>
  );
}
