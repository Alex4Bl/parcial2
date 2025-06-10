import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import UserProfile from "../pages/dashboard/components/UserProfile";
import Room from "../pages/room/Room";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
    children: [
      {
        path: "perfil",
        element: <UserProfile />,
      },
    ],
  },
  {
    path: "room/:roomId",
    element: <ProtectedRoute><Room /></ProtectedRoute>,
  }
]);

export default router;
