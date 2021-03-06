import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/home/HomePage";

import ProjectRoutes from "./projects/ProjectRoutes";
import PipelineRoutes from "./pipelines/PipelineRoutes";
import BundleRoutes from "./bundles/BundlesRoutes";
import MetadataModelsRoute from "./metadataModels/MetadataModelsRoute";
import NotificationChannelRoutes from "./notificationChannels/NotificationChannelRoutes";
import StorageConfigurationsRoutes from "./storageConfigurations/StorageConfigurationsRoutes";
import StorageCredentialsRoutes from "./storageCredentials/StorageCredentialsRoutes";
import WorkgroupsRoutes from "./workgroups/WorkgroupsRoutes";
import RegionsRoutes from "./regions/RegionsRoutes";
import UsersRoutes from "./users/UsersRoutes";
import ConnectorsRoutes from "./connectors/ConnectorsRoutes";

// Custom Routing
import ProtectedRoute from "./utils/ProtectedRoute";
import SignInPage from "../pages/SignInPage";
import NotFoundPage from "../pages/NotFoundPage";
import AnalysisStoragePage from "../pages/analysisStorage/AnalysisStoragePage";
import DataFormatsPage from "../pages/dataFormats/DataFormatsPage";
import EventCodesPage from "../pages/eventCodes/EventCodesPage";
import EventLogPage from "../pages/eventLog/EventLogPage";
import StorageBundlesPage from "../pages/storageBundles/StorageBundlesPage";
import SamplesListPage from "../pages/samples/SamplesListPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute />}>
        {/* Main Routes */}
        <Route index element={<HomePage />} />
        <Route path="projects">{ProjectRoutes}</Route>
        <Route path="pipelines">{PipelineRoutes}</Route>
        <Route path="bundles">{BundleRoutes}</Route>
        <Route path="users">{UsersRoutes}</Route>
        <Route path="workgroups">{WorkgroupsRoutes}</Route>
        <Route path="regions">{RegionsRoutes}</Route>
        <Route path="samples" element={<SamplesListPage />} />
        <Route path="connectors">{ConnectorsRoutes}</Route>

        {/* Other Routes */}
        <Route path="analysisStorage" element={<AnalysisStoragePage />} />
        <Route path="dataFormats" element={<DataFormatsPage />} />
        <Route path="eventCodes" element={<EventCodesPage />} />
        <Route path="eventLog" element={<EventLogPage />} />
        <Route path="storageBundles" element={<StorageBundlesPage />} />
        <Route path="metadataModels">{MetadataModelsRoute}</Route>
        <Route path="notificationChannels">{NotificationChannelRoutes}</Route>
        <Route path="storageConfigurations">
          {StorageConfigurationsRoutes}
        </Route>
        <Route path="storageCredentials">{StorageCredentialsRoutes}</Route>
      </Route>
      <Route path="/signIn" element={<SignInPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
