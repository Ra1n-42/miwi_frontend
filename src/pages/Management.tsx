// import ChallengesManagement from "@/components/ChallengesManagement";
import ClipManagement from "@/components/ClipManagement";
import UserManagement from "@/components/UserManagement";
import React, { useState } from "react";
import ChallengeManagement from "@/components/Challenges2/ChallengeManagement";

const Management: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const renderContent = () => {
    switch (selectedOption) {
      case "User Management":
        return <UserManagement />;
      case "Challenges":
        return <ChallengeManagement />;
      // return <ChallengesManagement />;
      case "Vote Event":
        return <div>Details about the Vote Event.</div>;
      case "Clip Management":
        return <ClipManagement />;
      case "Giveaways":
        return <div>Noch nicht vorhanden.</div>;
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  return (
    <div>
      <div className="flex min-h-[84dvh] bg-gray-800 border bg-opacity-35 backdrop-blur-md rounded-lg">
        {/* Sidebar */}
        <div className="sidebar flex flex-col justify-between text-white">
          <ul className="flex flex-col items-center justify-center space-y-1 font-semibold w-80 py-5">
            {[
              "User Management",
              "Challenges",
              "Vote Event",
              "Clip Management",
              "Giveaways",
            ].map((option) => (
              <li
                key={option}
                className={`flex justify-center cursor-pointer w-full py-2 ${
                  selectedOption === option
                    ? "bg-blue-500 text-white font-bold" // Aktiv
                    : "hover:bg-gray-400"
                }`}
                onClick={() => setSelectedOption(option)}
              >
                {option}
              </li>
            ))}
          </ul>
          <div className="footer flex items-center justify-center p-2 text-gray-300 text-2xl mb-2">
            Sidebar
          </div>
        </div>

        {/* Main Content */}
        <div className="box w-full border-l-2 p-5 text-white overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Management;
