import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import CartPage from "./pages/CartPage";
import ShopPage from "./pages/ShopPage";
import ProtectedRoute from "./ui/ProtectedRoute";
import LoginPage from "./pages/LoginPage";

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
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        element: <CartPage />,
      },
      {
        path: "/shop",
        element: (
          <ProtectedRoute allowedRoles="user">
            <ShopPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
