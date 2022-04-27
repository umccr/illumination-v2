import React from "react";

import { Route } from "react-router-dom";

import ProtectedRoute from "../../utils/ProtectedRoute";

import ProjectDataTransferPage from "../../../pages/projects/dataTransfer/ProjectDataTransferPage";
import ProjectDataTransferListPage from "../../../pages/projects/dataTransfer/ProjectDataTransferListPage";


const ProjectAnalysesRoutes: React.ReactNode[] = [
  <Route
    index
    element={<ProtectedRoute element={<ProjectDataTransferListPage />} />}
    key="projectDataTransferIndex"
  />,
  <Route path=":dataTransferId" key="projectDataTransferId">
    <Route
      index
      element={<ProtectedRoute element={<ProjectDataTransferPage />} />}
    />
  </Route>,
];

export default ProjectAnalysesRoutes;
