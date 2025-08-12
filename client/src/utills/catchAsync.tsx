import toast from "react-hot-toast";
// import { useError } from "../contexts/ErrorContext";

// interface AppError extends Error {
//   isOperational: boolean;
//   statusCode: number;
//   status: string;
// }

export default function useCatchAsync<T>(
  fn: (e?: React.BaseSyntheticEvent) => Promise<T>,
  setIsLoading?: (value: boolean) => void
): (e?: React.BaseSyntheticEvent) => void {
  return (e?: React.BaseSyntheticEvent) => {
    fn(e)
      .catch((err: Error) => {
        if (err?.responseData?.isOperational) {
          toast.error(err.responseData.message);
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
