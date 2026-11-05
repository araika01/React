import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import RecipeList from "../components/RecipeList";
import { fetchRecipes } from "../services/api";
import { useFavorites } from "../hooks/useFavorites";

const CUISINES = [
  "italian", "asian", "mexican", "french",
  "indian", "american", "mediterranean", "thai",
];
const PAGE_SIZE = 9;

export default function RecipesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { favorites, toggleFavorite } = useFavorites();

  const search     = searchParams.get("search") ?? "";
  const cuisine    = searchParams.get("cuisine") ?? "all";
  const difficulty = searchParams.get("difficulty") ?? "all";
  const maxTime    = Number(searchParams.get("maxTime") ?? 0);
  const sort       = searchParams.get("sort") ?? "title-asc";
  const page       = Number(searchParams.get("page") ?? 1);

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const [data, setData] = useState({
    items: [], total: 0, totalPages: 1, page: 1, pageSize: PAGE_SIZE,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false; 
    setLoading(true);
    setError(null);

    fetchRecipes({
      page,
      pageSize: PAGE_SIZE,
      search: debouncedSearch,
      cuisine,
      difficulty,
      maxTime,
      sort,
    })
      .then((res) => { if (!ignore) setData(res); })
      .catch((err) => { if (!ignore) setError(err.message); })
      .finally(() => { if (!ignore) setLoading(false); });

    return () => { ignore = true; };
  }, [debouncedSearch, cuisine, difficulty, maxTime, sort, page, reloadKey]);

  function updateFilters(patch) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      Object.entries(patch).forEach(([k, v]) => {
        const isEmpty =
          v === undefined ||
          v === null ||
          v === "" ||
          v === "all" ||
          (k === "maxTime" && Number(v) === 0) ||
          (k === "page" && Number(v) === 1); 

        if (isEmpty) next.delete(k);
        else next.set(k, String(v));
      });

      
      if (!("page" in patch)) next.delete("page");

      return next;
    });
  }

  function resetFilters() {
    setSearchParams({});
  }

  function goToPage(p) {
    updateFilters({ page: p });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Recipes</h1>
        <p className="muted">
          {loading ? "Loading…" : `${data.total} recipes found`}
        </p>
      </div>

      <FilterBar
        filters={{ search, cuisine, difficulty, maxTime, sort }}
        onChange={updateFilters}
        onReset={resetFilters}
        cuisines={CUISINES}
      />

      <RecipeList
        items={data.items}
        loading={loading}
        error={error}
        pageSize={PAGE_SIZE}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onRetry={() => setReloadKey((k) => k + 1)}
        onReset={resetFilters}
      />

      <Pagination
        page={data.page}
        totalPages={data.totalPages}
        onChange={goToPage}
      />
    </div>
  );
}