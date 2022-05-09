import React from "react";

import { Route } from "react-router-dom";

// Connectors Pages
import ConnectorListPage from "../../pages/connectors/ConnectorListPage";
import ConnectorPage from "../../pages/connectors/ConnectorPage";
import ConnectorDownloadRuleListPage from "../../pages/connectors/ConnectorDownloadRuleListPage";
import ConnectorUploadRuleListPage from "../../pages/connectors/ConnectorUploadRuleListPage";

const ConnectorsRoutes: React.ReactNode[] = [
  <Route index element={<ConnectorListPage />} key="connectorsIndex" />,
  <Route path=":connectorId" key="connectorsIdRoute">
    <Route index element={<ConnectorPage />} />
    <Route path="downloadRules">
      <Route
        index
        element={<ConnectorDownloadRuleListPage />}
        key="connectorsDownloadRuleIndex"
      />
      ,
    </Route>
    <Route path="uploadRules">
      <Route
        index
        element={<ConnectorUploadRuleListPage />}
        key="connectorsUploadRuleIndex"
      />
    </Route>
  </Route>,
];

export default ConnectorsRoutes;
