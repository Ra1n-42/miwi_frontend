// import { Button } from "@/components/ui/button";
// import { useUser } from "@/context/UserContext";
import  DatePickerWithRange  from "../components/DatePickerWithRange"
// import { Input } from "@/components/ui/input";
import { Sparkles } from 'lucide-react';
export default function Giveaway() {
  document.title = "Giveaway - MiwiTV";
  const handleLogin = () => {
    // API-Endpunkt aufrufen, der Twitch-OAuth einleitet
    window.location.href = "https://dev.miwi.tv/login";
  };
  const bild = ""//"https://miwi.tv/gw/1.webp"
  // const { user } = useUser();
    return (
        <div className="py-6 sm:py-10">
          <div className="flex flex-col items-center space-y-10 lg:space-y-20">
            <section className="Hero">
              <div>
                {bild?<img className="rounded-lg min-w-[22rem]" src={bild} alt="" />:null}
              </div>
              <div className="introduction flex flex-col text-white space-y-5">
                <div className="flex flex-col justify-center items-center">
                  <p>Hey zusammen! 👋</p>
                  <p>Am 1. Februar verlosen wir die Unheard Edition von Escape from Tarkov! 🥳</p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <h3 className="text-xl font-semibold text-green-500 border-b-2 border-green-500">Wie funktioniert das?</h3>
                  <p>Um am Giveaway teilzunehmen, benötigt ihr 20.000 BTC (Stream Elements Punkte).</p>
                  <p>Damit ihr diese Punkte schneller sammeln könnt, gibt es drei zusätzliche Möglichkeiten, BTC zu verdienen:</p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <h3 className="text-xl font-semibold text-red-500 ">🥇 Marbles on Stream</h3>
                  <p>🎲 Wir spielen regelmäßig Marbles, bei denen ihr extra Punkte gewinnen könnt.</p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <h3 className="text-xl font-semibold text-red-500">📹 Clip der Woche</h3>
                  <p>Erstellt Clips waehrend meiner Streams! Alle Clips landen automatisch in unserem Discord, wo die Community abstimmt.</p>
                  <p>Die drei Clips mit den meisten Stimmen bekommen:</p>
                  <div className="mt-2">
                    <div className="flex">
                      <Sparkles  className="text-yellow-500"/>🥇 1. Platz: 500 BTC
                    </div>
                    <div className="flex">
                      <Sparkles  className="text-yellow-500"/>🥈 2. Platz: 250 BTC
                    </div>
                    <div className="flex">
                      <Sparkles  className="text-yellow-500"/>🥉 3. Platz: 75 BTC
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <h3 className="text-xl font-semibold text-red-500">🔮 Predictions im Stream</h3>
                  <p>Unsere Mods starten während des Streams Predictions. Wenn ihr richtig tippt, verdient eure Gruppe 250 BTC.</p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <h3 className="text-xl font-semibold text-green-500 border-b-2 border-green-500">Wichtige Infos zum Giveaway</h3>
                  <p>📅 Das Giveaway endet am 1. Februar um 19:00 Uhr (MEZ).</p>
                  <p>🎥 Der Gewinner wird live im Stream gezogen.</p>
                </div>
              </div>
            </section>     
            <DatePickerWithRange />
            <section className="Rules text-white flex flex-col items-center lg:items-start">
              <div className="lg:text-xl pb-3">Teilnahmebedingungen:</div>
              <ul className={`lg:text-lg list-outside list-image-[url(data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxNCAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSIjMzhiZGY4Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMy42ODUuMTUzYS43NTIuNzUyIDAgMCAxIC4xNDMgMS4wNTJsLTggMTAuNWEuNzUuNzUgMCAwIDEtMS4xMjcuMDc1bC00LjUtNC41YS43NS43NSAwIDAgMSAxLjA2LTEuMDZsMy44OTQgMy44OTMgNy40OC05LjgxN2EuNzUuNzUgMCAwIDEgMS4wNS0uMTQzWiIgLz48L3N2Zz4=)]`}>
                <li>Folgt mich auf Twitch.</li>
                <li>Sammelt Stream Elements Punkte (checkt eure Punkte mit !points im Chat).</li>
                <li>Register <span className="cursor-pointer text-blue-500" onClick={handleLogin}>hier</span>.</li>
                <li>Seid in Discord: <a className="text-blue-500" href="https://discord.com/invite/4ejPUVxB2U">Hier beitreten</a> (Gewinner wird per DM benachrichtigt).</li>
              </ul>
            </section>
            {/* <div className="newsletter pt-5 col-span-2 space-y-4 flex flex-col items-center">
              <div className="text-white text-xl sm:text-3xl font-bold items-center">
                Subscribe to our Newsletter!
              </div>
              <form className="grid gap-4">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input className="text-white" type="email" placeholder="Email" name="email" />
                  <Button type="submit">Subscribe</Button>
                </div>
                <p className="text-sm text-gray-400">
                  Sent out weekly on Mondays. Always free.
                </p>
              </form>
            </div> */}
          </div>
        </div>
      )
}
