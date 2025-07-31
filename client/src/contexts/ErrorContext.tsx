import { createContext, useContext, useReducer } from "react";
import type { ReactNode, Dispatch } from "react";

type Props = {
  children: ReactNode;
};

type Action =
  | {
      type: "setErrorOperational";
      payload: {
        errorMessage: { message: string };
      };
    }
  | { type: "setErrorProgrammatic"; payload: { errorMessage: Error } };

type State = {
  errorMessage: { message: string } | Error;
  isOperational: boolean;
};

type contextTypes = {
  errorMessage: { message: string } | Error;
  isOperational: boolean;
  dispatch: Dispatch<Action>;
};
const initialState: State = {
  errorMessage: { message: "" },
  isOperational: false,
};
// u createContext mora da se navedu vrednosti koje on nudi
const ErrorContext = createContext<contextTypes | undefined>(undefined);

// Napravi clear error u reduceru i reseno
function reducer(state: State, action: Action) {
  switch (action.type) {
    case "setErrorOperational": {
      return {
        ...state,
        errorMessage: action.payload.errorMessage,
        isOperational: true,
      };
    }
    case "setErrorProgrammatic": {
      return { ...state, errorMessage: action.payload.errorMessage };
    }
    default: {
      return state;
    }
  }
}

export default function ErrorProvider({ children }: Props) {
  const [{ errorMessage, isOperational }, dispatch] = useReducer(
    reducer,
    initialState
  );

  return (
    <ErrorContext.Provider value={{ errorMessage, dispatch, isOperational }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);

  if (context === undefined) {
    throw new Error("Component is not subscribed to the context");
  }

  return context;
}
