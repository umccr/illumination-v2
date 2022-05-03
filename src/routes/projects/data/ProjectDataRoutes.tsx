import React from "react";

import { Route } from "react-router-dom";

import ProjectDataListPage from "../../../pages/projects/data/ProjectDataListPage";
import ProjectDataPage from "../../../pages/projects/data/ProjectDataPage";
import ProjectDataLinkedPage from "../../../pages/projects/data/ProjectDataLinkedPage";
import ProjectDataChildrenPage from "../../../pages/projects/data/ProjectDataChildrenPage";
import ProjectDataEligibleForLinkingPage from "../../../pages/projects/data/ProjectDataEligibleForLinkingPage";
import ProjectNonSampleDataPage from "../../../pages/projects/data/ProjectNonSampleDataPage";
// import ProjectDataSecondaryDataPage from "../../../pages/projects/data/ProjectDataSecondaryDataPage";

const ProjectBaseRoutes: React.ReactNode[] = [
  <Route index element={<ProjectDataListPage />} key="ProjectDataIndex" />,
  <Route path="eligibleForLinking" key="projectDataEligibleForLinking">
    <Route index element={<ProjectDataEligibleForLinkingPage />} />
  </Route>,
  <Route path="nonSampleData" key="ProejectnonSampleDataPage">
    <Route index element={<ProjectNonSampleDataPage />} />
  </Route>,
  <Route path=":dataId" key="projectDataId">
    <Route index element={<ProjectDataPage />} />
    <Route path="children" element={<ProjectDataChildrenPage />} />
    <Route path="linkedProject" element={<ProjectDataLinkedPage />} />
    {/* <Route
      path="secondaryData"
      element={<ProjectDataSecondaryDataPage/>}
    /> */}
  </Route>,
];

export default ProjectBaseRoutes;
