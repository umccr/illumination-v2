import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import ProjectsPage from "./pages/projects/ProjectsPage";
import ProjectPage from "./pages/projects/ProjectPage";

// Custom Routing
import ProtectedRoute from "./utils/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
      <Route path="projects">
        <Route
          index={true}
          element={<ProtectedRoute element={<ProjectsPage />} />}
        />
        <Route
          path=":projectId"
          element={<ProtectedRoute element={<ProjectPage />} />}
        />
      </Route>
    </Routes>
  );
}
