import React from "react";

import { Route } from "react-router-dom";

import BundlesListPage from "../../pages/bundles/BundlesListPage";
import BundleDataPage from "../../pages/bundles/BundleDataPage";
import BundlePage from "../../pages/bundles/BundlePage";
import BundlePipelinesPage from "../../pages/bundles/BundlePipelinesPage";
import BundleToolsPage from "../../pages/bundles/BundleToolsPage";
import BundlesSamplesPage from "../../pages/bundles/BundlesSamplesPage";
import BundleToolsEligibleLinkingPage from "../../pages/bundles/BundleToolsEligibleLinkingPage";

const ProjectRoutes: React.ReactNode[] = [
  <Route index element={<BundlesListPage />} key="bundleIndexRoute" />,
  <Route path=":bundleId" key="bundleIdRoute">
    <Route index element={<BundlePage />} />
    <Route path="data" element={<BundleDataPage />} />
    <Route path="pipelines" element={<BundlePipelinesPage />} />
    <Route path="samples" element={<BundlesSamplesPage />} />
    <Route path="tools" key="bundleIdRoute">
      <Route index element={<BundleToolsPage />} />
      <Route
        path="eligibleForLinking"
        element={<BundleToolsEligibleLinkingPage />}
      />
    </Route>
  </Route>,
];

export default ProjectRoutes;
