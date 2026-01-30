import { useLoaderData } from "react-router-dom";
import { useCreateEmployeeMutation } from "../queries";
import { EmployeeFormData, ReferenceData } from "../__types__";
import EmployeeForm from "./EmployeeForm";

const EmployeeCreatePage = () => {
  const { departments, squads } = useLoaderData() as ReferenceData;
  const mutation = useCreateEmployeeMutation();

  const handleSubmit = async (data: EmployeeFormData) => {
    await mutation.mutateAsync(data);
  };

  return (
    <EmployeeForm
      onSubmit={handleSubmit}
      submitLabel="Create Employee"
      title="Add New Employee"
      departments={departments}
      squads={squads}
    />
  );
};

export default EmployeeCreatePage;
