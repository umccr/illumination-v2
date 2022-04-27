import React from "react";

import { Route } from "react-router-dom";

import ProtectedRoute from "../../utils/ProtectedRoute";
import ProjectDataListPage from "../../../pages/projects/data/ProjectDataListPage";
import ProjectDataPage from "../../../pages/projects/data/ProjectDataPage";
import ProjectDataLinkedPage from "../../../pages/projects/data/ProjectDataLinkedPage";
import ProjectDataChildrenPage from "../../../pages/projects/data/ProjectDataChildrenPage";
import ProjectDataEligibleForLinkingPage from "../../../pages/projects/data/ProjectDataEligibleForLinkingPage";
import ProjectNonSampleDatagPage from "../../../pages/projects/data/ProjectNonSampleDatagPage";
// import ProjectDataSecondaryDataPage from "../../../pages/projects/data/ProjectDataSecondaryDataPage";

const ProjectBaseRoutes: React.ReactNode[] = [
  <Route
    index
    element={<ProtectedRoute element={<ProjectDataListPage />} />}
    key="ProjectDataIndex"
  />,
  <Route path="eligibleForLinking" key="projectDataEligibleForLinking">
    <Route
      index
      element={
        <ProtectedRoute element={<ProjectDataEligibleForLinkingPage />} />
      }
    />
  </Route>,
  <Route path="nonSampleData" key="ProejectnonSampleDataPage">
    <Route
      index
      element={<ProtectedRoute element={<ProjectNonSampleDatagPage />} />}
    />
  </Route>,
  <Route path=":dataId" key="projectDataId">
    <Route index element={<ProtectedRoute element={<ProjectDataPage />} />} />
    <Route
      path="children"
      element={<ProtectedRoute element={<ProjectDataChildrenPage />} />}
    />
    <Route
      path="linkedProject"
      element={<ProtectedRoute element={<ProjectDataLinkedPage />} />}
    />
    {/* <Route
      path="secondaryData"
      element={<ProtectedRoute element={<ProjectDataSecondaryDataPage />} />}
    /> */}
  </Route>,
];

export default ProjectBaseRoutes;
