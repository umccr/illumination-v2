import React from "react";

import { Route } from "react-router-dom";

import MetadataModelPage from "../../pages/metadataModels/MetadataModelPage";
import MetadataModelsPage from "../../pages/metadataModels/MetadataModelsPage";
import MetadataModelFieldsPage from "../../pages/metadataModels/MetadataModelFieldsPage";

const ProjectRoutes: React.ReactNode[] = [
  <Route
    index
    element={<MetadataModelsPage />}
    key="metadtaModelsIndexRoute"
  />,
  <Route path=":metadataModelId" key="metadataModelIdRoute">
    <Route index element={<MetadataModelPage />} />
    <Route path="fields" element={<MetadataModelFieldsPage />} />
  </Route>,
];

export default ProjectRoutes;
