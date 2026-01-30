import { z } from "zod";
import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

export const employeeStatusSchema = z.enum(["active", "inactive"]);

export const employeeSchema = z.object({
  id: z.number(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").or(z.literal("")),
  title: z.string(),
  department: z.string().min(1, "Department is required"),
  dateStarted: z.string().min(1, "Start date is required"),
  quote: z.string(),
  status: employeeStatusSchema,
  avatarUrl: z.string(),
  squads: z.array(z.string()),
});

export const employeeFormSchema = employeeSchema.omit({ id: true });

export const employeeFiltersSchema = z.object({
  search: z.string().optional(),
  department: z.array(z.string()).optional(),
  squad: z.array(z.string()).optional(),
  status: z.enum(["all", "active", "inactive"]).optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export const employeesResponseSchema = z.object({
  data: z.array(employeeSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

// =============================================================================
// Core Entity Types (inferred from Zod schemas)
// =============================================================================

export type EmployeeStatus = z.infer<typeof employeeStatusSchema>;
export type Employee = z.infer<typeof employeeSchema>;
export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
export type EmployeeFilters = z.infer<typeof employeeFiltersSchema>;
export type EmployeesResponse = z.infer<typeof employeesResponseSchema>;

// =============================================================================
// UI State Types
// =============================================================================

export type ViewMode = "grid" | "list";
export type SortField = "firstName" | "lastName";
export type StatusFilter = "all" | "active" | "inactive";
export type SortOrder = "asc" | "desc";
export type AvatarSize = "sm" | "md" | "lg" | "xl";

export type ReferenceData = {
  departments: string[];
  squads: string[];
};

export type EditLoaderData = ReferenceData & {
  employee: Employee;
};

export type EmployeeCardProps = {
  employee: Employee;
};

export type EmployeeRowProps = {
  employee: Employee;
  onDelete: () => void;
};

export type AvatarProps = {
  src?: string;
  firstName: string;
  lastName: string;
  size?: AvatarSize;
  className?: string;
  inactive?: boolean;
};

export type EmployeeSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export type EmployeeControlsProps = {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
};

export type FilterChip = {
  type: string;
  value: string;
  onRemove: () => void;
};

export type ActiveFiltersProps = {
  filters: FilterChip[];
  onClearAll: () => void;
};

export type FilterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  departments: string[];
  squads: string[];
  selectedDepartments: string[];
  selectedSquads: string[];
  sortField: SortField;
  sortOrder: SortOrder;
  statusFilter: StatusFilter;
  onApply: (
    departments: string[],
    squads: string[],
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

// =============================================================================
// Component Props Types - Detail
// =============================================================================

export type EmployeeHeaderProps = {
  employee: Employee;
  onAvatarUpload: (imageUrl: string) => Promise<void>;
};

export type EmployeeInfoProps = {
  employee: Employee;
};

export type AvatarUploadProps = {
  currentAvatarUrl?: string;
  firstName: string;
  lastName: string;
  onUpload: (imageUrl: string) => Promise<void>;
  inactive?: boolean;
};

// =============================================================================
// Component Props Types - Form
// =============================================================================

export type EmployeeFormProps = {
  initialData?: Employee;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  submitLabel: string;
  title: string;
  departments: string[];
  squads: string[];
};

export type AssignmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  departments: string[];
  squads: string[];
  selectedDepartment: string;
  selectedSquads: string[];
  onSave: (department: string, squads: string[]) => void;
};

export type FieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  htmlFor?: string;
  action?: ReactNode;
};

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};
