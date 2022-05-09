import React from "react";

import { Route } from "react-router-dom";

import StorageConfigurationListPage from "../../pages/storageConfigurations/StorageConfigurationListPage";
import StorageConfigurationPage from "../../pages/storageConfigurations/StorageConfigurationPage";
import StorageConfigurationDetailsPage from "../../pages/storageConfigurations/StorageConfigurationDetailsPage";

const ProjectRoutes: React.ReactNode[] = [
  <Route
    index
    element={<StorageConfigurationListPage />}
    key="storageConfigurationIndex"
  />,
  <Route path=":StorageConfigurationId" key="storageConfigurationIdIndex">
    <Route index element={<StorageConfigurationPage />} />
    <Route path="details" element={<StorageConfigurationDetailsPage />} />
  </Route>,
];

export default ProjectRoutes;
