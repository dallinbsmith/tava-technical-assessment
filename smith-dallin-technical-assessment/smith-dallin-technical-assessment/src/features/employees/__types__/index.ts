import { z } from "zod";

const employeeStatusSchema = z.enum(["active", "inactive"]);

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
});

export const employeeFormSchema = employeeSchema.omit({ id: true });

export const employeeFiltersSchema = z.object({
  search: z.string().optional(),
  department: z.array(z.string()).optional(),
  status: z.enum(["all", "active", "inactive"]).optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type Employee = z.infer<typeof employeeSchema>;
export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
export type EmployeeFilters = z.infer<typeof employeeFiltersSchema>;
export type EmployeesResponse = {
  data: Employee[];
  total: number;
  page: number;
  limit: number;
};

export type ReferenceData = {
  departments: string[];
};

export type EditLoaderData = ReferenceData & {
  employee: Employee;
};

// Re-export component types
export * from "./detail.types";
export * from "./form.types";
export * from "./list.types";
