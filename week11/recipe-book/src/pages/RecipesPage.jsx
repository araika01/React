
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const search = searchParams.get("search") ?? "";
  const cuisine = searchParams.get("cuisine") ?? "all";
  const difficulty = searchParams.get("difficulty") ?? "all";
  const maxTime = Number(searchParams.get("maxTime") ?? 0);
  const sort = searchParams.get("sort") ?? "title-asc";
  const page = Number(searchParams.get("page") ?? 1);

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const {
    data,
    isPending,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "recipes",
      {
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        cuisine,
        difficulty,
        maxTime,
        sort,
      },
    ],

    queryFn: () =>
      fetchRecipes({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        cuisine,
        difficulty,
        maxTime,
        sort,
      }),

    staleTime: 1000 * 60 * 5,
  });

  const recipesData = data ?? {
    items: [],
    total: 0,
    totalPages: 1,
    page,
    pageSize: PAGE_SIZE,
  };

  function updateFilters(patch) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      Object.entries(patch).forEach(([key, value]) => {
        const isEmpty =
          value === undefined ||
          value === null ||
          value === "" ||
          value === "all" ||
          (key === "maxTime" && Number(value) === 0) ||
          (key === "page" && Number(value) === 1);

        if (isEmpty) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });

      if (!("page" in patch)) {
        next.delete("page");
      }

      return next;
    });
  }

  function resetFilters() {
    setSearchParams({});
  }

  function goToPage(nextPage) {
    updateFilters({ page: nextPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reloadRecipes() {
    queryClient.invalidateQueries({
      queryKey: ["recipes"],
    });
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Recipes</h1>

        <p className="muted">
          {isPending
            ? "Loading..."
            : `${recipesData.total} recipes found`}
          {isFetching && !isPending && " (Updating...)"}
        </p>
      </div>

      <FilterBar
        filters={{
          search,
          cuisine,
          difficulty,
          maxTime,
          sort,
        }}
        onChange={updateFilters}
        onReset={resetFilters}
        cuisines={CUISINES}
      />

      <RecipeList
        items={recipesData.items}
        loading={isPending}
        error={isError ? error?.message : null}
        pageSize={PAGE_SIZE}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onRetry={reloadRecipes}
        onReset={resetFilters}
      />

      <Pagination
        page={recipesData.page}
        totalPages={recipesData.totalPages}
        onChange={goToPage}
      />
    </div>
  );
}
