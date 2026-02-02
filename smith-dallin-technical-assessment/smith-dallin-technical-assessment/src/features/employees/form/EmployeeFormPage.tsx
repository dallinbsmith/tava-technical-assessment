import { useLoaderData, useParams } from "react-router-dom";
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from "@shared/lib/queries";
import { EmployeeFormData, EditLoaderData, ReferenceData } from "../__types__";
import EmployeeForm from "./EmployeeForm";

const EmployeeFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const loaderData = useLoaderData() as EditLoaderData | ReferenceData;
  const isEditMode = "employee" in loaderData;

  const { departments } = loaderData;
  const employee = isEditMode ? loaderData.employee : undefined;
  const employeeId = id ? parseInt(id) : 0;

  const createMutation = useCreateEmployeeMutation();
  const updateMutation = useUpdateEmployeeMutation(employeeId);

  const handleSubmit = async (data: EmployeeFormData) => {
    if (isEditMode) {
      await updateMutation.mutateAsync(data);
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  return (
    <EmployeeForm
      initialData={employee}
      onSubmit={handleSubmit}
      submitLabel={isEditMode ? "Save Changes" : "Create Employee"}
      title={isEditMode ? "Edit Employee" : "Add New Employee"}
      departments={departments}
    />
  );
};

export default EmployeeFormPage;
