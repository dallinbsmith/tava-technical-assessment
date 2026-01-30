import { useState, useDeferredValue, useMemo } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { Users, X, Building2 } from "lucide-react";
import { useEmployeesQuery, useDeleteEmployeeMutation } from "../api/queries";
import {
  Employee,
  ReferenceData,
  ViewMode,
  SortField,
  SortOrder,
} from "../__types__";
import Pagination from "./Pagination";
import FilterModal from "./FilterModal";
import EmployeeCard from "./EmployeeCard";
import EmployeeRow from "./EmployeeRow";
import EmployeeSearchBar from "./EmployeeSearchBar";
import EmployeeControls from "./EmployeeControls";
import ActiveFilters from "./ActiveFilters";
import DeleteConfirmationModal from "../../../shared/components/DeleteConfirmationModal";

const ITEMS_PER_PAGE_OPTIONS = [6, 9, 12, 24];

const EmployeeListPage = () => {
  const { departments, squads } = useLoaderData() as ReferenceData;

  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilters, setDepartmentFilters] = useState<string[]>([]);
  const [squadFilters, setSquadFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [groupByDepartment, setGroupByDepartment] = useState(false);
  const [sortField, setSortField] = useState<SortField>("firstName");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const deferredSearch = useDeferredValue(searchQuery);

  const { data, isLoading, error } = useEmployeesQuery({
    search: deferredSearch || undefined,
    department: departmentFilters.length > 0 ? departmentFilters : undefined,
    squad: squadFilters.length > 0 ? squadFilters : undefined,
    sort: sortField,
    order: sortOrder,
    page: currentPage,
    limit: itemsPerPage,
  });

  const deleteMutation = useDeleteEmployeeMutation({
    onSuccess: () => setDeleteTarget(null),
  });

  const employees = data?.data ?? [];
  const totalCount = data?.total ?? 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const groupedEmployees = useMemo(() => {
    if (!groupByDepartment) return null;
    return employees.reduce(
      (groups, emp) => {
        const dept = emp.department || "Unassigned";
        if (!groups[dept]) groups[dept] = [];
        groups[dept].push(emp);
        return groups;
      },
      {} as Record<string, Employee[]>,
    );
  }, [employees, groupByDepartment]);

  const updateFilters = (newDepartments: string[], newSquads: string[]) => {
    setDepartmentFilters(newDepartments);
    setSquadFilters(newSquads);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDepartmentFilters([]);
    setSquadFilters([]);
    setCurrentPage(1);
  };

  const activeFilters = [
    ...departmentFilters.map((dept) => ({
      type: "Department",
      value: dept,
      onRemove: () => {
        setDepartmentFilters(departmentFilters.filter((d) => d !== dept));
        setCurrentPage(1);
      },
    })),
    ...squadFilters.map((squad) => ({
      type: "Squad",
      value: squad,
      onRemove: () => {
        setSquadFilters(squadFilters.filter((s) => s !== squad));
        setCurrentPage(1);
      },
    })),
  ];

  if (isLoading && !data) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-12 bg-elevated mb-4" />
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
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
          value={searchQuery}
          onChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
        />
        <EmployeeControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenFilters={() => setIsFilterModalOpen(true)}
          activeFilterCount={departmentFilters.length + squadFilters.length}
          groupByDepartment={groupByDepartment}
          onGroupByDepartmentChange={setGroupByDepartment}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={(field, order) => {
            setSortField(field);
            setSortOrder(order);
            setCurrentPage(1);
          }}
        />
      </div>

      <ActiveFilters filters={activeFilters} onClearAll={clearFilters} />

      <div className="flex items-center justify-between text-xs text-muted px-1">
        <span>
          {totalCount} {totalCount === 1 ? "employee" : "employees"}
        </span>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
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
            onClick={clearFilters}
            className="text-xs font-medium text-sky-400 hover:text-sky-300 underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {groupByDepartment && groupedEmployees ? (
            <div className="space-y-6">
              {Object.entries(groupedEmployees).map(([dept, deptEmployees]) => (
                <div key={dept}>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                    <Building2 className="w-4 h-4 text-sky-400" />
                    <h2 className="text-sm font-semibold text-primary">
                      {dept}
                    </h2>
                    <span className="text-xs text-muted">
                      ({deptEmployees.length})
                    </span>
                  </div>
                  {viewMode === "grid" ? (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {deptEmployees.map((emp) => (
                        <EmployeeCard key={emp.id} employee={emp} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {deptEmployees.map((emp) => (
                        <EmployeeRow
                          key={emp.id}
                          employee={emp}
                          onDelete={() =>
                            setDeleteTarget({
                              id: emp.id,
                              name: `${emp.firstName} ${emp.lastName}`,
                            })
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
              {viewMode === "grid" && (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {employees.map((emp) => (
                    <EmployeeCard key={emp.id} employee={emp} />
                  ))}
                </div>
              )}

              {viewMode === "list" && (
                <div className="space-y-2">
                  {employees.map((emp) => (
                    <EmployeeRow
                      key={emp.id}
                      employee={emp}
                      onDelete={() =>
                        setDeleteTarget({
                          id: emp.id,
                          name: `${emp.firstName} ${emp.lastName}`,
                        })
                      }
                    />
                  ))}
                </div>
              )}
            </>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        departments={departments}
        squads={squads}
        selectedDepartments={departmentFilters}
        selectedSquads={squadFilters}
        onApply={updateFilters}
      />

      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => !deleteMutation.isPending && setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        isDeleting={deleteMutation.isPending}
        employeeName={deleteTarget?.name ?? ""}
        error={deleteMutation.error?.message ?? null}
      />
    </div>
  );
};

export default EmployeeListPage;
