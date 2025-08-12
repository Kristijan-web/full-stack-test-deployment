import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import CartPage from "./pages/CartPage";
import ShopPage from "./pages/ShopPage";
import ProtectedRoute from "./ui/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RedirectIfLogged from "./ui/RedirectIfLogged";
import ProfilePage from "./pages/ProfilePage";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: (
          <RedirectIfLogged>
            <LoginPage />
          </RedirectIfLogged>
        ),
      },
      {
        path: "/signup",
        element: (
          <RedirectIfLogged>
            <SignupPage />
          </RedirectIfLogged>
        ),
      },
      {
        element: <CartPage />,
      },
      {
        path: "/shop",
        element: (
          <ProtectedRoute allowedRoles={["user"]} redirectTo="/">
            <ShopPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute allowedRoles={["user", "tourGuide"]} redirectTo="/">
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
