import React from "react";

import { Route } from "react-router-dom";

import ProjectPipelinesPage from "../../../pages/projects/pipelines/ProjectPipelinesPage";
import ProjectPipelinePage from "../../../pages/projects/pipelines/ProjectPipelinePage";
import ProjectPipelineReferenceSetsPage from "../../../pages/projects/pipelines/ProjectPipelineReferenceSetsPage";
import ProjectPipelineInputParametersPage from "../../../pages/projects/pipelines/ProjectPipelineInputParametersPage";

const ProjectBaseRoutes: React.ReactNode[] = [
  <Route
    index
    element={<ProjectPipelinesPage />}
    key="ProjectPipelinesPageIndex"
  />,
  <Route path=":pipelineId" key="ProjectPipelineId">
    <Route index element={<ProjectPipelinePage />} />
    <Route
      path="inputParameters"
      element={<ProjectPipelineInputParametersPage />}
    />
    <Route
      path="referenceSets"
      element={<ProjectPipelineReferenceSetsPage />}
    />
  </Route>,
];

export default ProjectBaseRoutes;
