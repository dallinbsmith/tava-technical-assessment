import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { cn } from "@shared/lib/styles";
import { Modal } from "@shared/components/Modal";
import {
  FilterModalProps,
  SortField,
  SortOrder,
  StatusFilter,
} from "../__types__";

const sortOptions: { value: SortField; label: string }[] = [
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
];

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

// Local state allows users to modify filters without immediately applying them.
// State resets to current props when modal opens, preserving "cancel" behavior.
type LocalFilters = {
  departments: string[];
  sortField: SortField;
  sortOrder: SortOrder;
  statusFilter: StatusFilter;
};

const DEFAULT_LOCAL: LocalFilters = {
  departments: [],
  sortField: "firstName",
  sortOrder: "asc",
  statusFilter: "all",
};

const FilterModal = ({
  isOpen,
  onClose,
  departments,
  selectedDepartments,
  sortField,
  sortOrder,
  statusFilter,
  onApply,
}: FilterModalProps) => {
  const [local, setLocal] = useState<LocalFilters>({
    departments: selectedDepartments,
    sortField,
    sortOrder,
    statusFilter,
  });

  useEffect(() => {
    if (isOpen) {
      setLocal({
        departments: selectedDepartments,
        sortField,
        sortOrder,
        statusFilter,
      });
    }
  }, [isOpen, selectedDepartments, sortField, sortOrder, statusFilter]);

  const updateLocal = (updates: Partial<LocalFilters>) => {
    setLocal((prev) => ({ ...prev, ...updates }));
  };

  const toggleDepartment = (dept: string) => {
    const newDepts = local.departments.includes(dept)
      ? local.departments.filter((d) => d !== dept)
      : [...local.departments, dept];
    updateLocal({ departments: newDepts });
  };

  const handleApply = () => {
    onApply(
      local.departments,
      local.sortField,
      local.sortOrder,
      local.statusFilter,
    );
    onClose();
  };

  const hasSelections =
    local.departments.length > 0 || local.statusFilter !== "all";

  const footer = (
    <>
      <button
        onClick={() => setLocal(DEFAULT_LOCAL)}
        disabled={!hasSelections}
        className={cn(
          "flex-1 px-4 py-2 text-sm font-medium transition-colors",
          hasSelections
            ? "text-muted hover:text-primary hover:bg-elevated"
            : "text-subtle cursor-not-allowed",
        )}
      >
        Clear
      </button>
      <button
        onClick={handleApply}
        className="flex-1 px-4 py-2 text-sm font-medium bg-sky-900/40 text-sky-300 border border-sky-500/30 hover:bg-sky-900/60 transition-colors"
      >
        Apply
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filters"
      icon={Filter}
      footer={footer}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-muted mb-3">Status</h3>
          <div className="flex gap-2">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateLocal({ statusFilter: opt.value })}
                className={cn(
                  "flex-1 px-3 py-2 text-sm border transition-colors",
                  local.statusFilter === opt.value
                    ? "border-sky-500/50 bg-sky-900/30 text-sky-300"
                    : "border-border bg-elevated text-muted hover:border-sky-500/50",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted mb-3">Sort By</h3>
          <div className="flex gap-2">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateLocal({ sortField: opt.value })}
                className={cn(
                  "flex-1 px-3 py-2 text-sm border transition-colors",
                  local.sortField === opt.value
                    ? "border-sky-500/50 bg-sky-900/30 text-sky-300"
                    : "border-border bg-elevated text-muted hover:border-sky-500/50",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => updateLocal({ sortOrder: "asc" })}
              className={cn(
                "flex-1 px-3 py-2 text-sm border transition-colors",
                local.sortOrder === "asc"
                  ? "border-sky-500/50 bg-sky-900/30 text-sky-300"
                  : "border-border bg-elevated text-muted hover:border-sky-500/50",
              )}
            >
              A → Z
            </button>
            <button
              onClick={() => updateLocal({ sortOrder: "desc" })}
              className={cn(
                "flex-1 px-3 py-2 text-sm border transition-colors",
                local.sortOrder === "desc"
                  ? "border-sky-500/50 bg-sky-900/30 text-sky-300"
                  : "border-border bg-elevated text-muted hover:border-sky-500/50",
              )}
            >
              Z → A
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted mb-3">Departments</h3>
          <div className="space-y-2">
            {departments.map((dept) => (
              <label
                key={dept}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={local.departments.includes(dept)}
                  onChange={() => toggleDepartment(dept)}
                  className="w-4 h-4 accent-sky-500"
                />
                <span className="text-sm text-primary">{dept}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;
