import { z } from "zod";

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
// UI State Types (shared across components)
// =============================================================================

export type ViewMode = "grid" | "list";
export type SortField = "firstName" | "lastName";
export type StatusFilter = "all" | "active" | "inactive";
export type SortOrder = "asc" | "desc";

export type ReferenceData = {
  departments: string[];
  squads: string[];
};

export type EditLoaderData = ReferenceData & {
  employee: Employee;
};
