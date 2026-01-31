import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { cn } from "@shared/lib/styles";
import { Modal } from "@shared/components/Modal";
import {
  FilterModalProps,
  SortField,
  SortOrder,
  StatusFilter,
} from "./utils/__types__";

const sortOptions: { value: SortField; label: string }[] = [
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
];

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

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
  const [localDepartments, setLocalDepartments] =
    useState<string[]>(selectedDepartments);
  const [localSortField, setLocalSortField] = useState<SortField>(sortField);
  const [localSortOrder, setLocalSortOrder] = useState<SortOrder>(sortOrder);
  const [localStatusFilter, setLocalStatusFilter] =
    useState<StatusFilter>(statusFilter);

  useEffect(() => {
    if (isOpen) {
      setLocalDepartments(selectedDepartments);
      setLocalSortField(sortField);
      setLocalSortOrder(sortOrder);
      setLocalStatusFilter(statusFilter);
    }
  }, [isOpen, selectedDepartments, sortField, sortOrder, statusFilter]);

  const toggleItem = (
    item: string,
    list: string[],
    setList: (items: string[]) => void,
  ) => {
    setList(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item],
    );
  };

  const handleApply = () => {
    onApply(
      localDepartments,
      localSortField,
      localSortOrder,
      localStatusFilter,
    );
    onClose();
  };

  const hasSelections =
    localDepartments.length > 0 || localStatusFilter !== "all";

  const footer = (
    <>
      <button
        onClick={() => {
          setLocalDepartments([]);
          setLocalSortField("firstName");
          setLocalSortOrder("asc");
          setLocalStatusFilter("all");
        }}
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
                onClick={() => setLocalStatusFilter(opt.value)}
                className={cn(
                  "flex-1 px-3 py-2 text-sm border transition-colors",
                  localStatusFilter === opt.value
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
                onClick={() => setLocalSortField(opt.value)}
                className={cn(
                  "flex-1 px-3 py-2 text-sm border transition-colors",
                  localSortField === opt.value
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
              onClick={() => setLocalSortOrder("asc")}
              className={cn(
                "flex-1 px-3 py-2 text-sm border transition-colors",
                localSortOrder === "asc"
                  ? "border-sky-500/50 bg-sky-900/30 text-sky-300"
                  : "border-border bg-elevated text-muted hover:border-sky-500/50",
              )}
            >
              A → Z
            </button>
            <button
              onClick={() => setLocalSortOrder("desc")}
              className={cn(
                "flex-1 px-3 py-2 text-sm border transition-colors",
                localSortOrder === "desc"
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
                  checked={localDepartments.includes(dept)}
                  onChange={() =>
                    toggleItem(dept, localDepartments, setLocalDepartments)
                  }
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
