import { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";

// sve guraj ovde

type Props = {
  children: ReactNode;
};

type State = {
  message: string | null;
  isOperational: boolean | null;
  error: Error | null;
};

type Action = {
  type: "setError";
  payload: {
    message: string | null;
    error: Error | null;
    isOperational: boolean | null;
  };
};

type ContextTypes = {
  message: string | null;
  isOperational: boolean | null;
  error: Error | null;
  dispatch: React.Dispatch<Action>;
};

// ovde cu hvatati sve greske i opeartional i programatic
// handlujem programtaic i operational greske na svoj nacin

// Recimo desi se da je koristinik uneo id koji ne postoji, u tom slucaju pozivam ovaj context sa dispatch i saljem error message
//

const initialState: State = {
  message: "",
  isOperational: null,
  error: null,
};

const ErrorContext = createContext<ContextTypes | null>(null);

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "setError": {
      return {
        ...state,
        message: action.payload.message,
        error: action.payload.error,
        isOperational: action.payload.isOperational,
      };
    }
    default: {
      return state;
    }
  }
}

export default function ErrorProvider({ children }: Props) {
  const [{ message, isOperational, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  return (
    <ErrorContext.Provider value={{ message, isOperational, dispatch, error }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const errorContext = useContext(ErrorContext);
  if (errorContext === null) {
    // ovo je operational greska
    throw new Error("Component is not wrapped in <ErrorProvider>");
  }
  return errorContext;
}
