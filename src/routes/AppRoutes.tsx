import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/home/HomePage";

import ProjectRoutes from "./projects/ProjectRoutes";
import PipelineRoutes from "./pipelines/PipelineRoutes";

// Custom Routing
import ProtectedRoute from "./utils/ProtectedRoute";
import SignInPage from "../pages/SignInPage";
import NotFoundPage from "../pages/NotFoundPage";
import UsersRoutes from "./users/UsersRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute />}>
        <Route index element={<HomePage />} />
        <Route path="projects">{ProjectRoutes}</Route>
        <Route path="pipelines">{PipelineRoutes}</Route>
        <Route path="users">{UsersRoutes}</Route>
      </Route>
      <Route path="/signIn" element={<SignInPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
