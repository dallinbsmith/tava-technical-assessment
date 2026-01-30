import {
  Employee,
  EmployeeFormData,
  EmployeesResponse,
  EmployeeFilters,
} from "../__types__";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

const api = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE}${url}`, options);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Request failed: ${response.status}`);
  }
  return response.json();
};

export const getEmployees = async (
  filters: EmployeeFilters = {},
): Promise<EmployeesResponse> => {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.department?.length)
    params.set("department", filters.department.join(","));
  if (filters.squad?.length) params.set("squad", filters.squad.join(","));
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.order) params.set("order", filters.order);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));

  const query = params.toString();
  return api(`/employees${query ? `?${query}` : ""}`);
};

export const getEmployee = (id: number): Promise<Employee> =>
  api(`/employees/${id}`);

export const getDepartments = (): Promise<string[]> => api("/departments");

export const getSquads = (): Promise<string[]> => api("/squads");

export const createEmployee = (data: EmployeeFormData): Promise<Employee> =>
  api("/employees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const updateEmployee = (
  id: number,
  data: Partial<EmployeeFormData>,
): Promise<Employee> =>
  api(`/employees/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deleteEmployee = (id: number): Promise<Employee> =>
  api(`/employees/${id}`, { method: "DELETE" });

export const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("avatar", file);
  const { url } = await api<{ url: string }>("/upload", {
    method: "POST",
    body: formData,
  });
  return url;
};
