import toast from "react-hot-toast";
// import { useError } from "../contexts/ErrorContext";

interface AppError extends Error {
  isOperational: boolean;
  statusCode: number;
  status: string;
}

export default function useCatchAsync<T>(
  fn: (e: React.BaseSyntheticEvent) => Promise<T>,
  setIsLoading?: (value: boolean) => void
): (e: React.BaseSyntheticEvent) => void {
  // sluzice da hvata asinhrone greske
  // const { dispatch } = useError();
  return (e: React.BaseSyntheticEvent) => {
    fn(e)
      .catch((err: Error | AppError) => {
        if ("isOperational" in err) {
          console.error(err);
          toast.error(err.message);
        } else {
          toast.error("Something went wrong,please contact developer");
        }
      })
      .finally(() => {
        if (setIsLoading) {
          setIsLoading(false);
        }
      });
  };
}
