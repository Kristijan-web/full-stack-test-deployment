import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./pages/AppLayout";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { ErrorBoundary } from "react-error-boundary";
import ErrorBoundaryDisplay from "./ui/ErrorBoundaryDisplay";

const router = createBrowserRouter([
  {
    path: "/signup",
    element: (
      <ErrorBoundary FallbackComponent={ErrorBoundaryDisplay}>
        <SignupPage />
      </ErrorBoundary>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/shop",
        element: <ShopPage />,
      },
    ],
  },
]);

export default router;
