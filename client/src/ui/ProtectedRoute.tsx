import type { ReactNode } from "react";
import { useUser } from "../contexts/UserContext";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
  allowedRoles: [string];
  redirectTo: string;
};
export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo,
}: Props) {
  const { user, isLoading } = useUser();
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (user === null) {
    return <Navigate to="/signup" replace />;
  }
  if (allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }
  return <Navigate to={redirectTo} replace />;
}

// ima stranice gde korisnik mora biti ulogovan da bi pristupio
// ima stranice gde korisnik mora imati dozvolu da bi pristupio
// U cemu je problem?
// Problem je u tome sto ne radim pravilno redirect, redirect treba da se radi u zavinosti akcije korisnika
