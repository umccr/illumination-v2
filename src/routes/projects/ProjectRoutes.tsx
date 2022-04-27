import React from "react";

import { Route } from "react-router-dom";

import ProtectedRoute from "../utils/ProtectedRoute";
// Project Pages
import ProjectsPage from "../../pages/projects/ProjectsPage";
import ProjectPage from "../../pages/projects/ProjectPage";
import ProjectAnalysesRoutes from "./analyses/ProjectAnalysesRoutes";
import ProjectDataTransferRoutes from "./dataTransfer/ProjectDataTransferRoutes"

const ProjectRoutes: React.ReactNode[] = [
  <Route
    index
    element={<ProtectedRoute element={<ProjectsPage />} />}
    key="projectIndex"
  />,
  <Route path=":projectId" key="projectIdRoute">
    <Route index element={<ProtectedRoute element={<ProjectPage />} />} />
    <Route path="analyses">{ProjectAnalysesRoutes}</Route>
    <Route path="dataTransfer">{ProjectDataTransferRoutes}</Route>
  </Route>,
];

export default ProjectRoutes;
