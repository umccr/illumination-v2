import React from "react";

import { Route } from "react-router-dom";

import ProjectBundlesPage from "../../../pages/projects/bundles/ProjectBundlesPage";
import ProjectBundlePage from "../../../pages/projects/bundles/ProjectBundlePage";

const ProjectBaseRoutes: React.ReactNode[] = [
  <Route
    index
    element={<ProjectBundlesPage />}
    key="ProjectBundlessPageIndex"
  />,
  <Route path=":bundleId" key="ProjectBundleId">
    <Route index element={<ProjectBundlePage />} />
  </Route>,
];

export default ProjectBaseRoutes;
