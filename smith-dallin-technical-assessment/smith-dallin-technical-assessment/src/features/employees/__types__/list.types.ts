import { Employee } from "./index";

export type ViewMode = "grid" | "list";
export type SortField = "firstName" | "lastName";
export type StatusFilter = "all" | "active" | "inactive";
export type SortOrder = "asc" | "desc";
export type AvatarSize = "sm" | "md" | "lg" | "xl";

export type ListFilters = {
  search: string;
  departments: string[];
  status: StatusFilter;
  sort: SortField;
  order: SortOrder;
  page: number;
  limit: number;
};

export type FilterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  departments: string[];
  selectedDepartments: string[];
  sortField: SortField;
  sortOrder: SortOrder;
  statusFilter: StatusFilter;
  onApply: (
    departments: string[],
    sortField: SortField,
    sortOrder: SortOrder,
    statusFilter: StatusFilter,
  ) => void;
};

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export type EmployeeCardProps = {
  employee: Employee;
};

export type AvatarProps = {
  src?: string;
  firstName: string;
  lastName: string;
  size?: AvatarSize;
  className?: string;
  inactive?: boolean;
};

export type EmployeeControlsProps = {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
  groupByDepartment: boolean;
  onGroupByDepartmentChange: (grouped: boolean) => void;
};

export type EmployeeSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export type EmployeeRowProps = {
  employee: Employee;
  onDelete: () => void;
};
