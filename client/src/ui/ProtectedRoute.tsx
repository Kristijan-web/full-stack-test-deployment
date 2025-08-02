import type { ReactNode } from "react";
import { useUser } from "../contexts/UserContext";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
  allowedRoles: string;
};
export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (!user) {
    return <Navigate to="/signup" replace />;
  }
  if (allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }
  return <Navigate to="/signup" replace />;
}
