import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type Props = {
  children: ReactNode;
};

type User = {
  email: string;
  role: string;
};

type ContextValues = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  isLoading: boolean;
};
const UserContext = createContext<ContextValues | undefined>(undefined);

export default function UserProvider({ children }: Props) {
  // koji ce mi sve state trebati?
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(function gettingUserData() {
    async function getData() {
      try {
        const fetchData = await fetch("http://127.0.0.1:api/v1/users/me");
        const userData = await fetchData.json();
        setUser(userData);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    getData();
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("Component is not subscribed to the context");
  }
  return context;
}
