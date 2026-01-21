import { Navigate, Outlet } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/login"; 
import Register from "./pages/Register"; 
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/cart"; 
import MyOrders from "./pages/MyOrders"; 

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : <>{children}</>;
};

export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "product/:productId",
        element: <ProductDetail />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "my-orders",
            element: <MyOrders />,
          },
        ],
      },
    ],
  },
];