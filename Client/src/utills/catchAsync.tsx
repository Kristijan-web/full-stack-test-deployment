// Ovo ne treba da vrati nista, samo da handluje gresku

import type { MouseEvent } from "react";
import { useError } from "../contexts/ErrorContext";

// sta treba da vratim
// Vracam funkciju
export default function useCatchAsync<T>(
  fn: (e: MouseEvent<HTMLButtonElement>) => Promise<T>
): (e: MouseEvent<HTMLButtonElement>) => void {
  // ovde idu programatic async greske
  // proveri da li se upada u use Error sa ovim dispatch-om
  const { dispatch } = useError();
  return (e) => {
    fn(e).catch((err) =>
      dispatch({
        type: "setError",
        payload: {
          message: "Something went wrong",
          isOperational: false,
          error: err,
        },
      })
    );
  };
}
