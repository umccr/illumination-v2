import React from "react";

import { Route } from "react-router-dom";

// Project Pages
import ProjectsPage from "../../pages/projects/ProjectsPage";
import ProjectPage from "../../pages/projects/ProjectPage";
import ProjectAnalysesRoutes from "./analyses/ProjectAnalysesRoutes";
import ProjectBaseRoutes from "./base/ProjectBaseRoutes";
import ProjectCustomNotificationsRoutes from "./notificationSubscriptions/ProjectCustomNotificationSubscriptionsRoutes";
import ProjectNotificationsRoutes from "./notificationSubscriptions/ProjectNotificationSubscriptionsRoutes";
import ProjectDataRoutes from "./data/ProjectDataRoutes";
import ProjectPipelinesRoutes from "./pipelines/ProjectPipelinesRoutes";
import ProjectBundlesRoutes from "./bundles/ProjectBundlesRoutes";

const ProjectRoutes: React.ReactNode[] = [
  <Route index element={<ProjectsPage />} key="projectIndex" />,
  <Route path=":projectId" key="projectIdRoute">
    <Route index element={<ProjectPage />} />
    <Route path="analyses">{ProjectAnalysesRoutes}</Route>
    <Route path="base">{ProjectBaseRoutes}</Route>
    <Route path="data">{ProjectDataRoutes}</Route>
    <Route path="customNotificationSubscriptions">
      {ProjectCustomNotificationsRoutes}
    </Route>
    <Route path="notificationSubscriptions">{ProjectNotificationsRoutes}</Route>
    <Route path="pipelines">{ProjectPipelinesRoutes}</Route>
    <Route path="bundles">{ProjectBundlesRoutes}</Route>
  </Route>,
];

export default ProjectRoutes;
