import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "./api";
import { EmployeeFormData, EmployeeFilters } from "../../features/employees/__types__";

export const employeeKeys = {
  all: ["employees"] as const,
  list: (filters: EmployeeFilters) => ["employees", filters] as const,
  detail: (id: number) => ["employee", id] as const,
};

export const useEmployeesQuery = (filters: EmployeeFilters) =>
  useQuery({
    queryKey: employeeKeys.list(filters),
    queryFn: () => getEmployees(filters),
  });

export const useEmployeeQuery = (id: number) =>
  useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => getEmployee(id),
    enabled: !!id,
  });

export const useCreateEmployeeMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      navigate("/");
    },
  });
};

export const useUpdateEmployeeMutation = (id: number) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EmployeeFormData) => updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(id) });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
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
        employeeKeys.detail(employeeId),
        updatedEmployee,
      );
    },
  });
};
