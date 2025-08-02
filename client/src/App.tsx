import { RouterProvider } from "react-router-dom";
import router from "./router";
import ErrorProvider from "./contexts/ErrorContext";
import { Toaster } from "react-hot-toast";
import ErrorDisplay from "./ui/ErrorDisplay";

export default function App() {
  return (
    <ErrorProvider>
      <Toaster position="top-center" />
      <ErrorDisplay />
      <RouterProvider router={router} />
    </ErrorProvider>
  );
}
