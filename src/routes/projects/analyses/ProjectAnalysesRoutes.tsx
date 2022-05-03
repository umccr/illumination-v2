import React from "react";

import { Route } from "react-router-dom";

import ProjectAnalysesPage from "../../../pages/projects/analyses/ProjectAnalysesPage";
import ProjectAnalysesStepPage from "../../../pages/projects/analyses/ProjectAnalysesStepPage";
import ProjectAnalysisPage from "../../../pages/projects/analyses/ProjectAnalysisPage";
import ProjectAnalysesInputsPage from "../../../pages/projects/analyses/ProjectAnalysesInputsPage";
import ProjectAnalysesOutputsPage from "../../../pages/projects/analyses/ProjectAnalysesOutputsPage";
import ProjectAnalysesRawOutputsPage from "../../../pages/projects/analyses/ProjectAnalysesRawOutputsPage";
import ProjectAnalysesConfigurationsPage from "../../../pages/projects/analyses/ProjectAnalysesConfigurationsPage";

const ProjectAnalysesRoutes: React.ReactNode[] = [
  <Route index element={<ProjectAnalysesPage />} key="projectAnalysesIndex" />,
  <Route path=":analysisId" key="projectAnalysisId">
    <Route index element={<ProjectAnalysisPage />} />
    <Route path="steps" element={<ProjectAnalysesStepPage />} />
    <Route path="inputs" element={<ProjectAnalysesInputsPage />} />
    <Route path="outputs" element={<ProjectAnalysesOutputsPage />} />
    <Route path="rawOutputs" element={<ProjectAnalysesRawOutputsPage />} />
    <Route
      path="configurations"
      element={<ProjectAnalysesConfigurationsPage />}
    />
  </Route>,
];

export default ProjectAnalysesRoutes;
