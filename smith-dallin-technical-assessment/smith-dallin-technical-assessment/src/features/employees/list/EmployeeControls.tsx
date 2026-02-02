import { Filter, LayoutGrid, List, Building2 } from "lucide-react";
import { cn } from "@shared/lib/styles";
import { EmployeeControlsProps, ViewMode } from "../__types__";

const viewModes: { mode: ViewMode; icon: typeof LayoutGrid; label: string }[] =
  [
    { mode: "grid", icon: LayoutGrid, label: "Grid view" },
    { mode: "list", icon: List, label: "List view" },
  ];

const EmployeeControls = ({
  viewMode,
  onViewModeChange,
  onOpenFilters,
  activeFilterCount,
  groupByDepartment,
  onGroupByDepartmentChange,
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

    <div className="flex border border-border overflow-hidden bg-elevated">
      {viewModes.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => onViewModeChange(mode)}
          className={cn(
            "p-2 transition-colors border-r border-border last:border-r-0",
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

    <button
      onClick={() => onGroupByDepartmentChange(!groupByDepartment)}
      className={cn(
        "p-2 border transition-colors",
        groupByDepartment
          ? "border-sky-500/50 bg-sky-900/40 text-sky-300"
          : "border-border bg-elevated text-muted hover:border-sky-500/50",
      )}
      title="Group by department"
    >
      <Building2 className="w-4 h-4" />
    </button>
  </div>
);

export default EmployeeControls;
