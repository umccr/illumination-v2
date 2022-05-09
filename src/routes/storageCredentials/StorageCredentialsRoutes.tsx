import React from "react";

import { Route } from "react-router-dom";

import StorageCredentialsListPage from "../../pages/storageCredentials/StorageCredentialsListPage";
import StorageCredentialPage from "../../pages/storageCredentials/StorageCredentialPage";

const StorageCredentialsRoutes: React.ReactNode[] = [
  <Route
    index
    element={<StorageCredentialsListPage />}
    key="storageCredentialIndex"
  />,
  <Route path=":storageCredentialId" key="storageCredentialId">
    <Route index element={<StorageCredentialPage />} />
  </Route>,
];

export default StorageCredentialsRoutes;
