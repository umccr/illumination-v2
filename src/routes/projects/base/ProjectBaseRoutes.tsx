import React from "react";

import { Route } from "react-router-dom";

import ProtectedRoute from "../../utils/ProtectedRoute";
import ProjectBaseJobPage from "../../../pages/projects/base/ProjectBaseJobPage";
import ProjectBaseJobsPage from "../../../pages/projects/base/ProjectBaseJobsPage";
import ProjectBaseTablesPage from "../../../pages/projects/base/ProjectBaseTablesPage";
import NotFoundPage from "../../../pages/NotFoundPage";

const ProjectBaseRoutes: React.ReactNode[] = [
  <Route index element={<NotFoundPage />} key="ProjectBaseIndex" />,
  <Route path="jobs" key="projectBaseJobs">
    <Route index element={<ProjectBaseJobsPage />} />
    <Route path=":baseJobId" element={<ProjectBaseJobPage />} />
  </Route>,
  <Route path="tables" key="projectBaseTable">
    <Route index element={<ProjectBaseTablesPage />} />
  </Route>,
];

export default ProjectBaseRoutes;
