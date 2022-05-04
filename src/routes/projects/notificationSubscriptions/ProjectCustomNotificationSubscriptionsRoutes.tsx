import React from "react";

import { Route } from "react-router-dom";

import ProjectCustomNotificationPage from "../../../pages/projects/notificationSubscriptions/ProjectCustomNotificationPage";
import ProjectCustomNotificationsPage from "../../../pages/projects/notificationSubscriptions/ProjectCustomNotificationsPage";

const ProjectNotificationSubscriptionsRoutes: React.ReactNode[] = [
  <Route
    index
    element={<ProjectCustomNotificationsPage />}
    key="projectCustomNotificationSubsIndex"
  />,
  <Route
    path=":subId"
    element={<ProjectCustomNotificationPage />}
    key="projectCustomNotificationSubsSubId"
  />,
];

export default ProjectNotificationSubscriptionsRoutes;
