import { useEffect } from "react";
import { useError } from "../contexts/ErrorContext";
import toast from "react-hot-toast";

export default function ErrorDisplay() {
  const { errorMessage, isOperational } = useError();

  useEffect(
    function displayMessage() {
      if (errorMessage.message !== "") {
        if (isOperational) {
          console.log("Greska je operational ", errorMessage);
          toast.error(errorMessage.message);
        }
        if (!isOperational) {
          console.log("Greska je programmatic", errorMessage);
          console.log(errorMessage);
          toast.error("Something went wrong, please report this issue.");
        }
      }
    },
    [errorMessage, isOperational]
  );

  return null;
}
