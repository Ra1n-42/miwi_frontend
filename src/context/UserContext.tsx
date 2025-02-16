import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/types/User";

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("https://dev.miwi.tv/api/user/me", {
          credentials: "include",
        }); // api call mit jwt auth
        // const response = await fetch("/mockUserData.json"); // mockup
        if (response.ok) {
          const userData: User = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Fehler beim Abrufen des Benutzers:", error);
        setUser(null);
      } finally {
        setIsLoading(false); // Ladezustand beenden
      }
    };

    fetchUser();
  }, []);
  if (isLoading) {
    return <div>Loading...</div>; // Oder ein passender Loader
  }
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(
      "useUser muss innerhalb eines UserProviders verwendet werden"
    );
  }
  return context;
};
