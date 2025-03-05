export default function Home() {
  document.title = "Home - MiwiTV";
  return (
    <div className="h-[86dvh]">
      <div className="Hero flex pt-16 sm:pt-24 flex-col items-center">
        <div className="flex flex-col items-center">
          <h1 className="text-white text-2xl lg:text-6xl sm:text-4xl font-bold text-nowrap">
            Tritt unserer Community bei!
          </h1>
          <div className="subtext mt-6 sm:mt-10 text-xl sm:text-2xl lg:text-4xl text-white italic flex flex-col items-center">
            <p>Check meine Social-Media-Accounts</p>
            <p>und bleib auf dem neusten Stand.</p>
          </div>
          {/* überlegung ob eigenes component hierfür */}
          <div className="socials flex justify-center space-x-2 mt-16 sm:mt-16 text-gray-400 sm:text-lg">
            <a
              href="https://www.twitch.tv/miwitv"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="hover:bg-violet-500 hover:text-white p-2 rounded-lg text-lg font-bold border-b-2 border-violet-500 cursor-pointer">
                Twitch
              </div>
            </a>
            <a
              href="https://discord.com/invite/4ejPUVxB2U"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="hover:bg-indigo-500 hover:text-white p-2 rounded-lg text-lg font-bold border-b-2 border-indigo-500 cursor-pointer">
                Discord
              </div>
            </a>
            <a
              href="https://www.youtube.com/@miwitv"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="hover:bg-red-500 hover:text-white order-r-2 p-2 rounded-lg text-lg font-bold border-b-2 border-red-500 cursor-pointer">
                YouTube
              </div>
            </a>
            <a
              href="https://www.tiktok.com/@miwittv"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="hover:bg-gray-800 hover:text-white order-r-2 p-2 rounded-lg text-lg font-bold border-b-2 border-gray-800 cursor-pointer">
                TikTok
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
