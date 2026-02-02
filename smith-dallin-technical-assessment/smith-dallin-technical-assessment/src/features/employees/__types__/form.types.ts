import { Employee, EmployeeFormData } from "./index";

export type EmployeeFormProps = {
  initialData?: Partial<Employee>;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  submitLabel: string;
  title: string;
  departments: string[];
};
