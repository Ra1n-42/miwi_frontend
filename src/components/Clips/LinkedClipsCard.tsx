import React from "react";
import { isDirectThumbnail, getCustomThumbnailUrl } from "@/utils/clipsUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { Clip } from "@/types/ClipTypes";

interface LinkedClipsCardProps {
  clip: Clip;
  onClick?: () => void;
}
const LinkedClipsCard: React.FC<LinkedClipsCardProps> = ({ clip, onClick }) => {
  return (
    <div className="cursor-pointer hover:opacity-80" onClick={onClick}>
      <div className="text-white flex space-x-3">
        {isDirectThumbnail(clip.thumbnail_url) ? (
          <img
            src={getCustomThumbnailUrl(clip.thumbnail_url, "160", "90")}
            alt={`${clip.creator_name}'s Clip Thumbnail`}
            className="h-auto rounded-md"
          />
        ) : (
          <div className="relative w-[200px] lg:w-[290px] h-[90px] hover:opacity-80">
            <Skeleton className="w-[160px] h-[90px] bg-slate-700 rounded-md" />
            <p className="absolute inset-0 flex items-center justify-center text-center text-white">
              Kein Thumbnail
            </p>
          </div>
        )}
        <div className="w-full mt-2">
          <h4 className="font-semibold">{clip.creator_name}</h4>
          <div className="text-sm">
            <span>Aufrufe: {clip.view_count}</span>
            <br />
            <span>Likes: {clip.likes || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedClipsCard;
