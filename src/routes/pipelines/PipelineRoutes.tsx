import React from "react";

import { Route } from "react-router-dom";

import PipelinesPage from "../../pages/pipelines/PipelinesPage";
import PipelinePage from "../../pages/pipelines/PipelinePage";
import PipelineInputParametersPage from "../../pages/pipelines/PipelineInputParametersPage";
import PipelineReferenceSetsPage from "../../pages/pipelines/PipelineReferenceSetsPage";

const PipelinesRoutes: React.ReactNode[] = [
  <Route index element={<PipelinesPage />} key="pipelineIndex" />,
  <Route path=":pipelineId" key="pipelineIdRoute">
    <Route index element={<PipelinePage />} />
    <Route path="inputParameters" element={<PipelineInputParametersPage />} />
    <Route path="referenceSets" element={<PipelineReferenceSetsPage />} />
  </Route>,
];

export default PipelinesRoutes;
