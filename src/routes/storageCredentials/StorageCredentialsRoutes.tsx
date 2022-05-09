import React from "react";

import { Route } from "react-router-dom";

import StorageCredentialsListPage from "../../pages/storageCredentials/StorageCredentialsListPage";
import StorageCredentialPage from "../../pages/storageCredentials/StorageCredentialPage";

const ProjectRoutes: React.ReactNode[] = [
  <Route
    index
    element={<StorageCredentialsListPage />}
    key="storageCredentialIndex"
  />,
  <Route path=":storageCredentialId" key="storageCredentialId">
    <Route index element={<StorageCredentialPage />} />
  </Route>,
];

export default ProjectRoutes;
