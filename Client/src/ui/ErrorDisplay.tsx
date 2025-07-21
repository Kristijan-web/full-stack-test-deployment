import toast from "react-hot-toast";
import { useError } from "../contexts/ErrorContext";
import { useEffect } from "react";

export default function ErrorDisplay() {
  // u ovoj funkciji cu citati error greske iz ErrorContext-a i prikazivati ih
  const { message, isOperational, error } = useError();
  // ovde moram znaci da li je operatinal greske ili ne

  const NoErrorHappened = isOperational === null;

  useEffect(
    function displayError() {
      if (NoErrorHappened) {
        return;
      }
      if (!isOperational) {
        toast.error("Something went wrong, contact developer");
        console.log(error);
      }
      if (isOperational) {
        // ovde upada ako je operational
        // nema potrebe da log-ujem error kada ga nemam uhvacenog kada je operational greska
        console.log(message);
        toast.error(message);
      }
    },
    [isOperational]
  );
  return null;
}
