import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/ui/Spinner";

export const ProtectedRoute = ({ children }: { children: JSX.Element }): JSX.Element => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner label="Checking session" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
