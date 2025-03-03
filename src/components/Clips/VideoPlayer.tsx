import React, { useState } from "react";
import { Skeleton } from "../ui/skeleton";

interface Clip {
  id: string;
  thumbnail_url: string;
  creator_name: string;
}

interface Props {
  currentClip?: Clip;
}

function getCustomThumbnailUrl(
  thumbnailUrl: string,
  width: string,
  height: string
) {
  if (!thumbnailUrl) return "";
  // Regulärer Ausdruck, der nach 'preview-' gefolgt von Zahlen und 'x' sucht
  const regex = /preview-\d+x\d+\.jpg$/;

  // Ersetzungsstring mit den gewünschten Breiten- und Höhenwerten
  const replacement = `preview-${width}x${height}.jpg`;

  // Überprüfen, ob die URL dem erwarteten Muster entspricht
  if (regex.test(thumbnailUrl)) {
    // Ersetzen des vorhandenen 'preview-' Teils durch den neuen mit den gewünschten Abmessungen
    return thumbnailUrl.replace(regex, replacement);
  } else {
    // Wenn die URL nicht dem erwarteten Muster entspricht, die gewünschten Abmessungen anhängen
    return `${thumbnailUrl.split(".jpg")[0]}-${replacement}`;
  }
}

const VideoPlayer: React.FC<Props> = ({ currentClip }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  if (!currentClip) {
    return (
      <div className="relative w-full max-w-5xl">
        <div className="w-full aspect-video ">
          <Skeleton className="w-full h-full bg-slate-700 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-5xl">
      {isPlaying ? (
        <iframe
          src={`https://clips.twitch.tv/embed?clip=${currentClip.id}&parent=${
            import.meta.env.VITE_BASE_DOMAIN
          }&autoplay=true`}
          className="w-full aspect-video rounded-md"
          allowFullScreen
        />
      ) : (
        <div className="relative">
          <img
            className="w-full aspect-video rounded-md"
            src={getCustomThumbnailUrl(currentClip.thumbnail_url, "480", "272")}
            alt={`${currentClip.creator_name}'s Clip Thumbnail`}
          />
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="bg-white text-black px-4 py-4 rounded-full shadow-md">
              Play
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
