import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./styles/Counter.module.css";
import LoginPage from "./pages/login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ContactPage from "./pages/contact";
import BookPage from "./pages/book";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import RegisterPage from "./pages/register";
import { callFetchAccount } from "./services/api";
import { doLogin } from "./redux/account/accountSlice";
import Loading from "./components/Loading";
import NotFound from "./components/NotFound";
import AdminPage from "./pages/admin";
import ProtectedRoute from "./components/ProtectedRoute";
import LayoutAdmin from "./components/Admin/LayoutAdmin";
import UserTable from "./components/Admin/User/UserTable";
import "./styles/reset.scss";
import "./styles/global.scss";
import BookTable from "./components/Admin/Book/BookTable";
import OrderPage from "./pages/order";
import History from "./pages/history";
import OrderTable from "./components/Admin/Order/OrderTable";

const Layout = () => {
  return (
    <div className="Layout-app">
      <Header />
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
};

export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.account.isLoading);

  const fetchAccount = async () => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    ) {
      return;
    }
    const res = await callFetchAccount();
    if (res?.data?.user) {
      dispatch(doLogin(res.data.user));
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,

      children: [
        { index: true, element: <Home /> },
        {
          path: "order",
          element: (
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "book/:slug",
          element: <BookPage />,
        },
        {
          path: "history",
          element: (
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },

    {
      path: "/admin",
      element: (
        <ProtectedRoute>
          <LayoutAdmin />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,

      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "user",
          element: (
            <ProtectedRoute>
              <UserTable />
            </ProtectedRoute>
          ),
        },
        {
          path: "book",
          element: (
            <ProtectedRoute>
              <BookTable />
            </ProtectedRoute>
          ),
        },
        {
          path: "order",
          element: (
            <ProtectedRoute>
              <OrderTable />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      {isLoading == false ||
      window.location.pathname === "/login" ||
      window.location.pathname === "/register" ||
      location.pathname.startsWith("/book/") ||
      window.location.pathname === "/" ? (
        <RouterProvider router={router} />
      ) : (
        <Loading />
      )}
    </>
  );
}
