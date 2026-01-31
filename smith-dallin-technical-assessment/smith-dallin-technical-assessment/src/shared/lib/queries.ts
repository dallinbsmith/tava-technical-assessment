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
} from "../../features/employees/utils/__types__";

export const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (filters: EmployeeFilters) =>
    [...employeeKeys.lists(), filters] as const,
  details: () => [...employeeKeys.all, "detail"] as const,
  detail: (id: number) => [...employeeKeys.details(), id] as const,
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
      // Only invalidate lists, not individual details
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
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
      // Update the specific employee in cache
      queryClient.setQueryData(employeeKeys.detail(id), updatedEmployee);
      // Invalidate lists since employee data changed
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
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
      // Remove from cache
      queryClient.removeQueries({ queryKey: employeeKeys.detail(deletedId) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
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
      // Update specific employee
      queryClient.setQueryData(
        employeeKeys.detail(employeeId),
        updatedEmployee,
      );
      // Invalidate lists to update avatars there too
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
};
