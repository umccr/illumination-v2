import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/home/HomePage";

import ProjectRoutes from "./projects/ProjectRoutes";
import PipelineRoutes from "./pipelines/PipelineRoutes";
import BundleRoutes from "./bundles/BundlesRoutes";
import MetadataModelsRoute from "./metadataModels/metadataModelsRoute";
// Custom Routing
import ProtectedRoute from "./utils/ProtectedRoute";
import SignInPage from "../pages/SignInPage";
import NotFoundPage from "../pages/NotFoundPage";
import AnalysisStoragePage from "../pages/analysisStorage/AnalysisStoragePage";
import DataFormatsPage from "../pages/dataFormats/DataFormatsPage";
import EventCodesPage from "../pages/eventCodes/EventCodesPage";
import EventLogPage from "../pages/eventLog/EventLogPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute />}>
        {/* Main Routes */}
        <Route index element={<HomePage />} />
        <Route path="projects">{ProjectRoutes}</Route>
        <Route path="pipelines">{PipelineRoutes}</Route>
        <Route path="bundles">{BundleRoutes}</Route>

        {/* Other Routes */}
        <Route path="analysisStorage" element={<AnalysisStoragePage />} />
        <Route path="dataFormats" element={<DataFormatsPage />} />
        <Route path="eventCodes" element={<EventCodesPage />} />
        <Route path="eventLog" element={<EventLogPage />} />
        <Route path="metadataModels">{MetadataModelsRoute}</Route>
      </Route>
      <Route path="/signIn" element={<SignInPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
