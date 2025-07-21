// u ovoj componenti hvatam i operational i programatic(sinhrone) greske
// u catchAsync funkciji hvatam programatic i operational (sinhronous) greske

type Props = {
  error: Error;
};

export default function ErrorBoundaryDisplay({ error }: Props) {
  const { message } = error;
  return <div>{message}</div>;
}
