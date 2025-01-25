import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ isAuthenticated, children }: { isAuthenticated: boolean, children: JSX.Element }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
