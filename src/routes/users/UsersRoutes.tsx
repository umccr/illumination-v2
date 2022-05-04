import React from "react";

import { Route } from "react-router-dom";

// Project Pages
import UsersPage from "../../pages/users/UsersPage";
import UserPage from "../../pages/users/UserPage";

const UserRoutes: React.ReactNode[] = [
  <Route index element={<UsersPage />} key="usersIndex" />,
  <Route path=":userId" key="userIdRoute">
    <Route index element={<UserPage />} />
  </Route>,
];

export default UserRoutes;
