import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getCurrentUser } from "./api/user.api";
import { login, logout } from "./store/slice/authSlice";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer.jsx";
import { Outlet } from "@tanstack/react-router";

export default function RootLayout() {
  const dispatch = useDispatch();

  const {
    data: user,
    error,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isSuccess && user) {
      dispatch(login(user));
    }
  }, [isSuccess, user, dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(logout());
    }
  }, [isError, dispatch]);

  return (
    <>
      <Navbar />
      <main className="min-h-[60vh]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
