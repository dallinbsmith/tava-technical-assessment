import { Filter, LayoutGrid, List, Layers, ArrowUpDown } from "lucide-react";
import { cn } from "../../../shared/lib/styles";
import { EmployeeControlsProps, SortField } from "../__types__";

const viewModes = [
  { mode: "grid" as const, icon: LayoutGrid, label: "Grid" },
  { mode: "list" as const, icon: List, label: "List" },
];

const sortOptions: { value: SortField; label: string }[] = [
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
  { value: "department", label: "Department" },
  { value: "dateStarted", label: "Start Date" },
];

const EmployeeControls = ({
  viewMode,
  onViewModeChange,
  onOpenFilters,
  activeFilterCount,
  groupByDepartment,
  onGroupByDepartmentChange,
  sortField,
  sortOrder,
  onSortChange,
}: EmployeeControlsProps) => (
  <div className="flex flex-wrap gap-2 sm:gap-3">
    <button
      onClick={onOpenFilters}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm border transition-colors",
        activeFilterCount > 0
          ? "border-sky-500/50 bg-sky-900/30 text-sky-300"
          : "border-border bg-elevated text-muted hover:border-sky-500/50",
      )}
    >
      <Filter className="w-4 h-4" />
      <span>Filters</span>
      {activeFilterCount > 0 && (
        <span className="px-1.5 py-0.5 text-xs bg-sky-600 text-white">
          {activeFilterCount}
        </span>
      )}
    </button>

    <div className="flex items-center gap-1 px-3 py-2 text-sm border border-border bg-elevated">
      <ArrowUpDown className="w-4 h-4 text-muted" />
      <select
        value={sortField}
        onChange={(e) => onSortChange(e.target.value as SortField, sortOrder)}
        className="bg-transparent border-none p-0 text-muted focus:ring-0 cursor-pointer hover:text-primary text-sm"
      >
        {sortOptions.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-surface text-primary"
          >
            {opt.label}
          </option>
        ))}
      </select>
      <button
        onClick={() =>
          onSortChange(sortField, sortOrder === "asc" ? "desc" : "asc")
        }
        className="text-muted hover:text-sky-400 transition-colors"
        title={sortOrder === "asc" ? "Ascending" : "Descending"}
      >
        {sortOrder === "asc" ? "↑" : "↓"}
      </button>
    </div>

    <button
      onClick={() => onGroupByDepartmentChange(!groupByDepartment)}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm border transition-colors",
        groupByDepartment
          ? "border-sky-500/50 bg-sky-900/30 text-sky-300"
          : "border-border bg-elevated text-muted hover:border-sky-500/50",
      )}
      title="Group by department"
    >
      <Layers className="w-4 h-4" />
      <span className="hidden sm:inline">Group</span>
    </button>

    <div className="flex border border-border overflow-hidden bg-elevated">
      {viewModes.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => onViewModeChange(mode)}
          className={cn(
            "p-2 transition-colors",
            mode !== "grid" && "border-l border-border",
            viewMode === mode
              ? "bg-sky-900/40 text-sky-300"
              : "text-muted hover:bg-surface",
          )}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  </div>
);

export default EmployeeControls;
