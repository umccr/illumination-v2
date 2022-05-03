import React, { useEffect, useState } from "react";

import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../../container/app/UserContext";

function ProtectedRoute() {
  const { user } = useUserContext();
  return (
    <>
      {user.isSignedIn ? (
        <Outlet />
      ) : (
        <Navigate replace to="signIn" />
      )}
    </>
  );
}

export default ProtectedRoute;
