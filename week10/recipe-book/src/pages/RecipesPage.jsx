import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchRecipes } from "../api/recipesApi";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import RecipeList from "../components/RecipeList";
import { useFavorites } from "../hooks/useFavorites";

const PAGE_SIZE = 9;

const DEFAULT_FILTERS = {
  search: "",
  cuisine: "all",
  difficulty: "all",
  maxTime: 0,
  sort: "title-asc",
};

const CUISINES = ["italian", "asian", "mexican", "french", "indian", "american", "mediterranean", "thai"];

export default function RecipesPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchRecipes({ page, pageSize: PAGE_SIZE, ...filters })
      .then((res) => {
        if (cancelled) return;
        setData(res);
        if (res.page !== page) setPage(res.page);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.message);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [page, filters.search, filters.cuisine, filters.difficulty, filters.maxTime, filters.sort, reloadKey]);

  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.cuisine, filters.difficulty, filters.maxTime, filters.sort]);

  const handleFiltersChange = useCallback((patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  const pageSizeForSkeleton = useMemo(() => PAGE_SIZE, []);

  return (
    <section className="page">
      <div className="page-head">
        <h1>Recipes</h1>
        <p className="muted">Found: {data.total}</p>
      </div>

      <FilterBar
        filters={filters}
        onChange={handleFiltersChange}
        onReset={handleReset}
        cuisines={CUISINES}
      />

      <RecipeList
        items={data.items}
        loading={loading}
        error={error}
        pageSize={pageSizeForSkeleton}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onRetry={() => setReloadKey((k) => k + 1)}
        onReset={handleReset}
      />

      {!loading && !error && (
        <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
      )}
    </section>
  );
}