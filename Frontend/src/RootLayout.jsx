import { Outlet } from "@tanstack/react-router";
import Navbar from "./components/Navbar.jsx";

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default RootLayout;
