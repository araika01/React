import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import AddRecipePage from "./pages/AddRecipePage";
import RecipeDetailsPage from "./pages/RecipeDetailsPage";
import RecipesPage from "./pages/RecipesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<RecipesPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
          <Route path="/add" element={<AddRecipePage />} />
          <Route path="*" element={<div className="page">Page not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}