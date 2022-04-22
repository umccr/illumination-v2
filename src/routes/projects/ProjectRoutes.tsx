import React from "react";

import { Route } from "react-router-dom";

import ProtectedRoute from "../utils/ProtectedRoute";
// Project Pages
import ProjectsPage from "../../pages/projects/ProjectsPage";

import ProjectAnalysesRoutes from "./analyses/ProjectAnalysesRoutes";

const ProjectRoutes: React.ReactNode[] = [
  <Route
    index
    element={<ProtectedRoute element={<ProjectsPage />} />}
    key="projectIndex"
  />,
  <Route path=":projectId" key="projectIdRoute">
    <Route index element={<ProtectedRoute element={<ProjectsPage />} />} />
    <Route path="analyses">{ProjectAnalysesRoutes}</Route>
  </Route>,
];

export default ProjectRoutes;
