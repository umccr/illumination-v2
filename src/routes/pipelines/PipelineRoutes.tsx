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
    element={<ProtectedRoute element={<PipelinesPage />} />}
    key="pipelineIndex"
  />,
  <Route path=":pipelineId" key="projectIdRoute">
    <Route index element={<ProtectedRoute element={<PipelinePage />} />} />
    <Route
      path="inputParameters"
      element={<ProtectedRoute element={<PipelineInputParametersPage />} />}
    />
    <Route
      path="referenceSets"
      element={<ProtectedRoute element={<PipelineReferenceSetsPage />} />}
    /> 
  </Route>,
];

export default ProjectRoutes;
