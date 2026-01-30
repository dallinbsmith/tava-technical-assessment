import { Filter, LayoutGrid, List, Building2 } from "lucide-react";
import { cn } from "../../../shared/lib/styles";
import { ViewMode } from "../__types__";

type Props = {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
  groupByDepartment: boolean;
  onGroupByDepartmentChange: (grouped: boolean) => void;
};

const viewModes = [
  { mode: "grid" as const, icon: LayoutGrid, label: "Grid" },
  { mode: "list" as const, icon: List, label: "List" },
];

const EmployeeControls = ({
  viewMode,
  onViewModeChange,
  onOpenFilters,
  activeFilterCount,
  groupByDepartment,
  onGroupByDepartmentChange,
}: Props) => (
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
      <Building2 className="w-4 h-4" />
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
