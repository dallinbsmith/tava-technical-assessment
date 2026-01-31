import { Employee, EmployeeFormData } from "../../../utils/__types__";

export type EmployeeFormProps = {
  initialData?: Partial<Employee>;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  submitLabel: string;
  title: string;
  departments: string[];
};
