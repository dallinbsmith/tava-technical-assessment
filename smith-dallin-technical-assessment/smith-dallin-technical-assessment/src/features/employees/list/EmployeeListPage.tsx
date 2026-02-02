import { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { Users, X, Building2 } from "lucide-react";
import {
  useEmployeesQuery,
  useDeleteEmployeeMutation,
} from "@shared/lib/queries";
import { useUrlFilters } from "@shared/hooks/useUrlFilters";
import { ReferenceData, Employee, ViewMode } from "../__types__";
import Pagination from "./Pagination";
import FilterModal from "./FilterModal";
import EmployeeCard from "./EmployeeCard";
import EmployeeRow from "./EmployeeRow";
import EmployeeSearchBar from "./EmployeeSearchBar";
import EmployeeControls from "./EmployeeControls";
import DeleteConfirmationModal from "@shared/components/DeleteConfirmationModal";

const ITEMS_PER_PAGE_OPTIONS = [6, 9, 12, 24];

const EmployeeListPage = () => {
  const { departments } = useLoaderData() as ReferenceData;

  const { filters, setFilters, updateFilters, resetSearchCriteria } =
    useUrlFilters();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [groupByDepartment, setGroupByDepartment] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const { data, isLoading, error } = useEmployeesQuery({
    search: debouncedSearch || undefined,
    department:
      filters.departments.length > 0 ? filters.departments : undefined,
    status: filters.status !== "all" ? filters.status : undefined,
    sort: filters.sort,
    order: filters.order,
    page: filters.page,
    limit: filters.limit,
  });

  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const deleteMutation = useDeleteEmployeeMutation({
    onSuccess: () => setDeleteTarget(null),
  });

  const employees = data?.data ?? [];
  const totalCount = data?.total ?? 0;
  const totalPages = Math.ceil(totalCount / filters.limit);

  const groupedEmployees = useMemo(() => {
    if (!groupByDepartment) return null;
    return employees.reduce(
      (groups, emp) => {
        const dept = emp.department || "No Department";
        (groups[dept] ??= []).push(emp);
        return groups;
      },
      {} as Record<string, Employee[]>,
    );
  }, [employees, groupByDepartment]);

  const activeFilterChips = useMemo(
    () => [
      ...filters.departments.map((dept) => ({
        type: "Department",
        value: dept,
        onRemove: () =>
          setFilters((prev) => ({
            ...prev,
            departments: prev.departments.filter((d) => d !== dept),
            page: 1,
          })),
      })),
      ...(filters.status !== "all"
        ? [
            {
              type: "Status",
              value:
                filters.status.charAt(0).toUpperCase() +
                filters.status.slice(1),
              onRemove: () => updateFilters({ status: "all" }),
            },
          ]
        : []),
    ],
    [filters.departments, filters.status, setFilters, updateFilters],
  );

  const activeFilterCount =
    filters.departments.length + (filters.status !== "all" ? 1 : 0);

  const handleDelete = useCallback(({ id, firstName, lastName }: Employee) => {
    setDeleteTarget({ id, name: `${firstName} ${lastName}` });
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      setFilters((prev) => ({ ...prev, page }));
    },
    [setFilters],
  );

  const handleLimitChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFilters((prev) => ({
        ...prev,
        limit: Number(e.target.value),
        page: 1,
      }));
    },
    [setFilters],
  );

  if (isLoading && !data) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-12 bg-elevated mb-4" />
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(filters.limit)].map((_, i) => (
              <div key={i} className="h-48 bg-elevated" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 text-center border-red-500/30 bg-red-900/20">
        <div className="w-16 h-16 bg-red-900/50 flex items-center justify-center mx-auto mb-4">
          <X className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-red-300 mb-2">
          Failed to Load Employees
        </h3>
        <p className="text-red-400">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  const isEmpty = employees.length === 0;

  const renderEmployees = (employeeList: Employee[]) =>
    viewMode === "grid" ? (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {employeeList.map((emp) => (
          <EmployeeCard key={emp.id} employee={emp} />
        ))}
      </div>
    ) : (
      <div className="space-y-2">
        {employeeList.map((emp) => (
          <EmployeeRow
            key={emp.id}
            employee={emp}
            onDelete={() => handleDelete(emp)}
          />
        ))}
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Employees</h1>
        <Link to="/employees/new" className="btn btn-primary gap-2">
          <span>+ Add Employee</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <EmployeeSearchBar
          value={filters.search}
          onChange={(search) => updateFilters({ search })}
        />
        <EmployeeControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenFilters={() => setIsFilterModalOpen(true)}
          activeFilterCount={activeFilterCount}
          groupByDepartment={groupByDepartment}
          onGroupByDepartmentChange={setGroupByDepartment}
        />
      </div>

      {activeFilterChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilterChips.map((filter, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-sm bg-sky-900/30 text-sky-300 border border-sky-500/30"
            >
              {filter.value}
              <button
                onClick={filter.onRemove}
                className="p-0.5 hover:bg-sky-500/30 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={resetSearchCriteria}
            className="text-sm text-muted hover:text-sky-400 underline"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-muted px-1">
        <span>
          {totalCount} {totalCount === 1 ? "employee" : "employees"}
        </span>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">Show:</span>
          <select
            value={filters.limit}
            onChange={handleLimitChange}
            className="bg-transparent border-none p-0 text-muted focus:ring-0 cursor-pointer hover:text-primary"
          >
            {ITEMS_PER_PAGE_OPTIONS.map((n) => (
              <option key={n} value={n} className="bg-surface text-primary">
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isEmpty ? (
        <div className="card text-center py-12">
          <div className="w-12 h-12 bg-elevated flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-muted" />
          </div>
          <h3 className="text-sm font-semibold text-primary">No results</h3>
          <p className="text-xs text-muted mt-1 mb-4">
            Try adjusting your search or filters
          </p>
          <button
            onClick={resetSearchCriteria}
            className="text-xs font-medium text-sky-400 hover:text-sky-300 underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {groupByDepartment && groupedEmployees ? (
            <div className="space-y-6">
              {Object.entries(groupedEmployees)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([dept, deptEmployees]) => (
                  <div key={dept}>
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                      <Building2 className="w-4 h-4 text-muted" />
                      <h2 className="text-sm font-semibold text-primary">
                        {dept}
                      </h2>
                      <span className="text-xs text-muted">
                        ({deptEmployees.length})
                      </span>
                    </div>
                    {renderEmployees(deptEmployees)}
                  </div>
                ))}
            </div>
          ) : (
            renderEmployees(employees)
          )}

          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        departments={departments}
        selectedDepartments={filters.departments}
        sortField={filters.sort}
        sortOrder={filters.order}
        statusFilter={filters.status}
        onApply={(departments, sort, order, status) =>
          updateFilters({ departments, sort, order, status })
        }
      />

      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => !deleteMutation.isPending && setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        isDeleting={deleteMutation.isPending}
        itemName={deleteTarget?.name ?? ""}
        error={deleteMutation.error?.message ?? null}
      />
    </div>
  );
};

export default EmployeeListPage;
