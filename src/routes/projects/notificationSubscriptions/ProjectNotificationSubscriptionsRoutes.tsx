import React from "react";

import { Route } from "react-router-dom";

import ProtectedRoute from "../../utils/ProtectedRoute";
import ProjectNotificationPage from "../../../pages/projects/notificationSubscriptions/ProjectNotificationPage";
import ProjectNotificationsPage from "../../../pages/projects/notificationSubscriptions/ProjectNotificationsPage";

const ProjectNotificationSubscriptionsRoutes: React.ReactNode[] = [
  <Route
    key="projectNotificationIndex"
    index
    element={<ProjectNotificationsPage />}
  />,
  <Route
    key="projectNotificationSubId"
    path=":subId"
    element={<ProjectNotificationPage />}
  />,
];

export default ProjectNotificationSubscriptionsRoutes;
