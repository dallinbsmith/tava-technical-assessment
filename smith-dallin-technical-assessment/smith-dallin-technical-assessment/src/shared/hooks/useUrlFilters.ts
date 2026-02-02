import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

type SortField = "firstName" | "lastName";
type SortOrder = "asc" | "desc";
type StatusFilter = "all" | "active" | "inactive";

export type UrlFilters = {
  search: string;
  departments: string[];
  status: StatusFilter;
  sort: SortField;
  order: SortOrder;
  page: number;
  limit: number;
};

const DEFAULT_FILTERS: UrlFilters = {
  search: "",
  departments: [],
  status: "all",
  sort: "firstName",
  order: "asc",
  page: 1,
  limit: 9,
};

const parseFilters = (searchParams: URLSearchParams): UrlFilters => {
  const departments = searchParams.get("departments");
  return {
    search: searchParams.get("search") || DEFAULT_FILTERS.search,
    departments: departments
      ? departments.split(",")
      : DEFAULT_FILTERS.departments,
    status:
      (searchParams.get("status") as StatusFilter) || DEFAULT_FILTERS.status,
    sort: (searchParams.get("sort") as SortField) || DEFAULT_FILTERS.sort,
    order: (searchParams.get("order") as SortOrder) || DEFAULT_FILTERS.order,
    page: Number(searchParams.get("page")) || DEFAULT_FILTERS.page,
    limit: Number(searchParams.get("limit")) || DEFAULT_FILTERS.limit,
  };
};

export const useUrlFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const setFilters = (
    updater: UrlFilters | ((prev: UrlFilters) => UrlFilters),
  ) => {
    setSearchParams((prevParams) => {
      const prevFilters = parseFilters(prevParams);
      const newFilters =
        typeof updater === "function" ? updater(prevFilters) : updater;
      const params = new URLSearchParams();

      if (newFilters.search) params.set("search", newFilters.search);
      if (newFilters.departments.length > 0)
        params.set("departments", newFilters.departments.join(","));
      if (newFilters.status !== "all") params.set("status", newFilters.status);
      if (newFilters.sort !== "firstName") params.set("sort", newFilters.sort);
      if (newFilters.order !== "asc") params.set("order", newFilters.order);
      if (newFilters.page !== 1) params.set("page", String(newFilters.page));
      if (newFilters.limit !== 9) params.set("limit", String(newFilters.limit));

      return params;
    });
  };

  const updateFilters = (updates: Partial<UrlFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates, page: 1 }));
  };

  const resetSearchCriteria = () => {
    setFilters((prev) => ({
      ...DEFAULT_FILTERS,
      sort: prev.sort,
      order: prev.order,
      limit: prev.limit,
    }));
  };

  return {
    filters,
    setFilters,
    updateFilters,
    resetSearchCriteria,
    DEFAULT_FILTERS,
  };
};
