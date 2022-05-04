import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/home/HomePage";

import ProjectRoutes from "./projects/ProjectRoutes";
import PipelineRoutes from "./pipelines/PipelineRoutes";

// Custom Routing
import ProtectedRoute from "./utils/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />

      <Route path="projects">{ProjectRoutes}</Route>
      <Route path="pipelines">{PipelineRoutes}</Route>
    </Routes>
  );
}
