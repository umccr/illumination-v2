import React from "react";

import { Route } from "react-router-dom";

import RegionListPage from "../../pages/regions/RegionListPage";
import RegionPage from "../../pages/regions/RegionPage";

const RegionsRoutes: React.ReactNode[] = [
  <Route index element={<RegionListPage />} key="regionRouteIndex" />,
  <Route path=":regionId" key="regionIdRoute">
    <Route index element={<RegionPage />} />
  </Route>,
];

export default RegionsRoutes;
