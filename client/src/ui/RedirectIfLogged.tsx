import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function RedirectIfLogged({ children }: Props) {
  const { user } = useUser();

  if (user) {
    return <Navigate to="/" replace={true} />;
  }
  return <>{children}</>;
}
