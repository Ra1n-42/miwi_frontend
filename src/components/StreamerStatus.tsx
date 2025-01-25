import useWebSocket from "@/hooks/useWebSocket";

const StreamerStatus = ({ streamerName }: { streamerName: string }) => {
  const { status } = useWebSocket(streamerName);


  return (
    <>
      {status === "online" ? (
        <div
          className="flex justify-center font-semibold items-center bg-red-500 cursor-pointer w-[2.5rem] h-[1.5rem] text-white rounded-sm"
          title="ist Live!"
        >
          LIVE
        </div>
      ) : (
        <div
          className="flex justify-center font-semibold items-center bg-gray-500 cursor-pointer w-[2.5rem] h-[1.5rem] text-white rounded-sm"
          title="ist nicht Live!"
        >
          LIVE
        </div>
      )}
    </>
  );
  
};

export default StreamerStatus;
