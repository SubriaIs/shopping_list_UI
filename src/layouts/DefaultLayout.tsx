import React from "react";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/redux-hooks";
import { Navigate } from "react-router-dom";

const DefaultLayout = () => {
  const authentication = useAppSelector((state) => state.auth.authentication);

  if (authentication) {
    return <Navigate replace to={"/home"} />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default DefaultLayout;