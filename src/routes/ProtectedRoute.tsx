import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

export default function ProtectedRoute({
  isAuthenticated,
  children,
}: {
  isAuthenticated: boolean;
  children: JSX.Element;
}) {
  const { isLoading } = useUser();

  console.log("ProtectedRoute", { isAuthenticated, isLoading });

  // Show loading indicator while authentication state is being determined
  if (isLoading) {
    return <div>Loading User...</div>; // Or a proper loading component
  }

  // Only redirect when we're sure the user isn't authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
