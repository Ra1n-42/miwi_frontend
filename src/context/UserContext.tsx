import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { User } from "@/types/User";
import { API_BASE_URL, IS_DEV, IS_LOCAL } from "@/constants/api";

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
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
        console.log("Fetching user data...");

        if (IS_LOCAL && IS_DEV) {
          // Mock-Daten per fetch laden
          const mockResponse = await fetch("/data/mockUserData.json");

          if (mockResponse.ok) {
            const mockUserData = await mockResponse.json();
            console.log("Mock user data fetched:", mockUserData);
            setUser(mockUserData);
          } else {
            console.error(
              "Fehler beim Laden der Mock-Daten:",
              mockResponse.statusText
            );
            setUser(null);
          }
        } else {
          // Echte API-Anfrage
          const response = await fetch(`${API_BASE_URL}/user/me`, {
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          });

          console.log("User fetch response status:", response.status);

          if (response.ok) {
            const userData = await response.json();
            console.log("User data fetched:", userData);
            setUser(userData);
          } else if (response.status === 401) {
            console.log("Unauthorized: Keine aktive Sitzung");
            setUser(null);
          } else {
            console.log("Unerwartete Antwort:", response.statusText);
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Fehler beim Abrufen des Benutzers:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      isLoading,
    }),
    [user, isLoading]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
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
