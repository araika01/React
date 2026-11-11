import { lazy } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import HomePage from "./pages/HomePage";

const AboutPage         = lazy(() => import("./pages/AboutPage"));
const LoginPage         = lazy(() => import("./pages/LoginPage"));
const RecipesPage       = lazy(() => import("./pages/RecipesPage"));
const RecipeDetailsPage = lazy(() => import("./pages/RecipeDetailsPage"));
const DashboardPage     = lazy(() => import("./pages/DashboardPage"));
const AddRecipePage     = lazy(() => import("./pages/AddRecipePage"));
const NotFoundPage      = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/"               element={<HomePage />} />
          <Route path="/about"          element={<AboutPage />} />
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/recipes"        element={<RecipesPage />} />
          <Route path="/recipes/:id"    element={<RecipeDetailsPage />} />
          <Route path="/dashboard"      element={<DashboardPage />} />
          <Route path="/add"            element={<AddRecipePage />} />
          <Route path="*"               element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}