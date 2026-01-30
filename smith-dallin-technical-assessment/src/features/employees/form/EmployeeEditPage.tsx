import { useLoaderData, useParams } from "react-router-dom";
import { useUpdateEmployeeMutation } from "../api/queries";
import { EmployeeFormData, EditLoaderData } from "../__types__";
import EmployeeForm from "./EmployeeForm";

const EmployeeEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { departments, squads, employee } = useLoaderData() as EditLoaderData;
  const employeeId = parseInt(id!);
  const mutation = useUpdateEmployeeMutation(employeeId);

  const handleSubmit = async (data: EmployeeFormData) => {
    await mutation.mutateAsync(data);
  };

  return (
    <EmployeeForm
      initialData={employee}
      onSubmit={handleSubmit}
      submitLabel="Save Changes"
      title="Edit Employee"
      departments={departments}
      squads={squads}
    />
  );
};

export default EmployeeEditPage;
