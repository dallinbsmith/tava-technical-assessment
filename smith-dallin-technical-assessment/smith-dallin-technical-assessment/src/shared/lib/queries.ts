import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "./api";
import {
  EmployeeFormData,
  EmployeeFilters,
} from "../../features/employees/__types__";

export const useEmployeesQuery = (filters: EmployeeFilters) =>
  useQuery({
    queryKey: ["employees", "list", filters],
    queryFn: () => getEmployees(filters),
  });

export const useEmployeeQuery = (id: number) =>
  useQuery({
    queryKey: ["employees", "detail", id],
    queryFn: () => getEmployee(id),
    enabled: !!id,
  });

export const useCreateEmployeeMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees", "list"] });
      navigate("/");
    },
  });
};

export const useUpdateEmployeeMutation = (id: number) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EmployeeFormData) => updateEmployee(id, data),
    onSuccess: (updatedEmployee) => {
      queryClient.setQueryData(["employees", "detail", id], updatedEmployee);
      queryClient.invalidateQueries({ queryKey: ["employees", "list"] });
      navigate("/");
    },
  });
};

export const useDeleteEmployeeMutation = (options?: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: ["employees", "detail", deletedId],
      });
      queryClient.invalidateQueries({ queryKey: ["employees", "list"] });
      options?.onSuccess?.();
    },
  });
};

export const useAvatarMutation = (employeeId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (avatarUrl: string) =>
      updateEmployee(employeeId, { avatarUrl }),
    onSuccess: (updatedEmployee) => {
      queryClient.setQueryData(
        ["employees", "detail", employeeId],
        updatedEmployee,
      );
      queryClient.invalidateQueries({ queryKey: ["employees", "list"] });
    },
  });
};
