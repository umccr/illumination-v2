import React from "react";

import { Route } from "react-router-dom";

import ProtectedRoute from "../../utils/ProtectedRoute";
import ProjectCustomNotificationPage from "../../../pages/projects/notificationSubscriptions/ProjectCustomNotificationPage";
import ProjectCustomNotificationsPage from "../../../pages/projects/notificationSubscriptions/ProjectCustomNotificationsPage";

const ProjectNotificationSubscriptionsRoutes: React.ReactNode[] = [
  <Route
    index
    element={<ProtectedRoute element={<ProjectCustomNotificationsPage />} />}
    key="projectCustomNotificationSubsIndex"
  />,
  <Route
    path=":subId"
    element={<ProtectedRoute element={<ProjectCustomNotificationPage />} />}
    key="projectCustomNotificationSubsSubId"
  />,
];

export default ProjectNotificationSubscriptionsRoutes;