import React from "react";

import { Route } from "react-router-dom";

import ProtectedRoute from "../utils/ProtectedRoute";
import PipelinesPage from "../../pages/pipelines/PipelinesPage";
import PipelinePage from "../../pages/pipelines/PipelinePage";
import PipelineInputParametersPage from "../../pages/pipelines/PipelineInputParametersPage";
import PipelineReferenceSetsPage from "../../pages/pipelines/PipelineReferenceSetsPage";

const ProjectRoutes: React.ReactNode[] = [
  <Route
    index
    element={<PipelinesPage />}
    key="pipelineIndex"
  />,
  <Route path=":pipelineId" key="projectIdRoute">
    <Route index element={<PipelinePage />} />
    <Route
      path="inputParameters"
      element={<PipelineInputParametersPage />}
    />
    <Route
      path="referenceSets"
      element={<PipelineReferenceSetsPage />}
    /> 
  </Route>,
];

export default ProjectRoutes;
