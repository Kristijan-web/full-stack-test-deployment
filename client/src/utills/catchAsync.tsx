import { useError } from "../contexts/ErrorContext";

export default function useCatchAsync<T>(
  fn: (e: React.BaseSyntheticEvent) => Promise<T>,
  setIsLoading?: (value: boolean) => void
): (e: React.BaseSyntheticEvent) => void {
  // sluzice da hvata asinhrone greske
  const { dispatch } = useError();
  return (e: React.BaseSyntheticEvent) => {
    fn(e)
      .catch((err: Error) => {
        // salji error u Context API
        dispatch({
          type: "setErrorProgrammatic",
          payload: { errorMessage: err },
        });
      })
      .finally(() => {
        if (setIsLoading) {
          setIsLoading(false);
        }
      });
  };
}
