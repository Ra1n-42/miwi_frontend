export interface User {
    id: string;
    display_name: string;
    email: string | null;
    avatar_url: string;
    role: number;
}
export const RoleNames: { [key: number]: string } = {
    0: "Admin",        // Volle Kontrolle
    1: "Manager",      // Unterstützung des Admins
    2: "Moderator",    // Moderiert Inhalte und Chat
    3: "User",         // Standard-Benutzer
};
export function getRoleName(roleLevel: number): string {
    return RoleNames[roleLevel] || "Unbekannte Rolle";
}