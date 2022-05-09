import React from "react";

import { Route } from "react-router-dom";

// Project Pages
import WorkgroupsListPage from "../../pages/workgroups/WorkgroupsListPage";
import WorkgroupPage from "../../pages/workgroups/WorkgroupPage";

const WorkgroupRoutes: React.ReactNode[] = [
  <Route index element={<WorkgroupsListPage />} key="workgroupRouteIndex" />,
  <Route path=":workgroupId" key="workgroupId">
    <Route index element={<WorkgroupPage />} />
  </Route>,
];

export default WorkgroupRoutes;
