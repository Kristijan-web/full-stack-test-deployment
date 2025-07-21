import { RouterProvider } from "react-router-dom";
import router from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import ErrorProvider from "./contexts/ErrorContext";
import ErrorDisplay from "./ui/ErrorDisplay";

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: { backgroundColor: "red", border: "1px solid black" },
        }}
      />
      <ErrorProvider>
        <ErrorDisplay />
        <RouterProvider router={router} />
      </ErrorProvider>
    </QueryClientProvider>
  );
}
