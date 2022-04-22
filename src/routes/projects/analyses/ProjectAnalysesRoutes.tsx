import React from "react";

import { Route } from "react-router-dom";

import ProtectedRoute from "../../utils/ProtectedRoute";

import ProjectAnalysesPage from "../../../pages/projects/analyses/ProjectAnalysesPage";
import ProjectAnalysesStepPage from "../../../pages/projects/analyses/ProjectAnalysesStepPage";
import ProjectAnalysisPage from "../../../pages/projects/analyses/ProjectAnalysisPage";
import ProjectAnalysesInputsPage from "../../../pages/projects/analyses/ProjectAnalysesInputsPage";
import ProjectAnalysesOutputsPage from "../../../pages/projects/analyses/ProjectAnalysesOutputsPage";
import ProjectAnalysesRawOutputsPage from "../../../pages/projects/analyses/ProjectAnalysesRawOutputsPage";
import ProjectAnalysesConfigurationsPage from "../../../pages/projects/analyses/ProjectAnalysesConfigurationsPage";

const ProjectAnalysesRoutes: React.ReactNode[] = [
  <Route
    index
    element={<ProtectedRoute element={<ProjectAnalysesPage />} />}
    key="projectAnalysesIndex"
  />,
  <Route path=":analysisId" key="projectAnalysisId">
    <Route
      index
      element={<ProtectedRoute element={<ProjectAnalysisPage />} />}
    />
    <Route
      path="steps"
      element={<ProtectedRoute element={<ProjectAnalysesStepPage />} />}
    />
    <Route
      path="inputs"
      element={<ProtectedRoute element={<ProjectAnalysesInputsPage />} />}
    />
    <Route
      path="outputs"
      element={<ProtectedRoute element={<ProjectAnalysesOutputsPage />} />}
    />
    <Route
      path="rawOutputs"
      element={<ProtectedRoute element={<ProjectAnalysesRawOutputsPage />} />}
    />
    <Route
      path="configurations"
      element={
        <ProtectedRoute element={<ProjectAnalysesConfigurationsPage />} />
      }
    />
  </Route>,
];

export default ProjectAnalysesRoutes;
