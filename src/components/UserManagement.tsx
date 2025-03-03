import React, { useState, useEffect } from "react";
import { RoleNames, getRoleName } from "@/types/User";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { API_BASE_URL } from "@/constants/api";

interface User {
  id: number;
  twitch_id: string;
  email: string | null;
  display_name: string;
  role: number;
  is_active: boolean;
  created_at: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editedRole, setEditedRole] = useState<number | "">("");
  const [editedIsActive, setEditedIsActive] = useState<boolean>(false);

  const { toast } = useToast();

  // Laden der Mock-Daten
  useEffect(() => {
    // fetch("/usersDatabase.json")
    fetch(`${API_BASE_URL}/user/all`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load user data");
        }
        return response.json();
      })
      .then((data: User[]) => setUsers(data))
      .catch((error) => console.error("Error loading user data:", error));
  }, []);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setEditedRole(user.role);
    setEditedIsActive(user.is_active);
  };

  const handleSave = () => {
    if (!selectedUser) return;

    const updatedUser: User = {
      ...selectedUser,
      role: typeof editedRole === "number" ? editedRole : selectedUser.role,
      is_active: editedIsActive,
    };

    fetch(`${API_BASE_URL}/user/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // JWT-Auth oder Cookies
      body: JSON.stringify(updatedUser), // Alle benötigten Daten im Body
    })
      .then(async (response) => {
        if (!response.ok) {
          // Wenn die Antwort nicht ok ist, hole die Fehlermeldung aus der Antwort
          const data = await response.json();
          // Zeige den Fehler-Toast an
          console.log(data.detail.message);
          toast({
            variant: "destructive",
            description:
              data.detail.message || "Fehler beim Aktualisieren des Benutzers.",
            action: <ToastAction altText="Ok">Ok</ToastAction>,
          });
          return await Promise.reject(data.message);
        }
        return response.json(); // Weiterverarbeitung der erfolgreichen Antwort
      })
      .then((data) => {
        // Lokales Update der Benutzerliste
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === data.user.id ? data.user : user))
        );

        // Aktualisieren des ausgewählten Benutzers
        setSelectedUser(data.user);

        toast({
          description: data.message,
        });
      })
      .catch((error) => console.error("Error updating user:", error));
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {/* Linke Liste */}
      <div className="flex flex-1 border p-3 flex-col">
        <h3 className="self-center mb-2">Alle Registrierten User</h3>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {users.map((user) => (
            <li
              key={user.id}
              style={{
                padding: "5px",
                cursor: "pointer",
                background: selectedUser?.id === user.id ? "#e0e0e0" : "",
              }}
              onClick={() => handleUserSelect(user)}
            >
              {user.display_name}{" "}
              {user.role !== 3 ? " (" + getRoleName(user.role) + ")" : ""}
            </li>
          ))}
        </ul>
      </div>

      {/* Rechte Seite */}
      <div className="flex flex-1 border p-3 flex-col">
        <h3 className="self-center mb-2">Editierender User</h3>
        {selectedUser ? (
          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <label className="flex">
                Rolle:
                <select
                  value={editedRole}
                  onChange={(e) => setEditedRole(Number(e.target.value))}
                  style={{ marginLeft: "10px", width: "100%" }}
                  className="text-black"
                >
                  {Object.entries(RoleNames).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              <label>
                Active:
                <input
                  type="checkbox"
                  checked={editedIsActive}
                  onChange={(e) => setEditedIsActive(e.target.checked)}
                  style={{ marginLeft: "10px" }}
                />{" "}
                (noch keine funktion)
              </label>
            </div>
            <div className="flex justify-center">
              <button
                className="mb-5 bg-slate-800 hover:bg-slate-500"
                type="submit"
                style={{ padding: "5px 10px" }}
              >
                Speichern
              </button>
            </div>
          </form>
        ) : (
          <p>Wähle ein User aus um zu Editieren.</p>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
