import {
  Employee,
  EmployeeFormData,
  EmployeesResponse,
  EmployeeFilters,
} from "../../features/employees/__types__";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiOptions = RequestInit & {
  signal?: AbortSignal;
};

const api = async <T>(url: string, options?: ApiOptions): Promise<T> => {
  const fullUrl = `${API_BASE}${url}`;

  try {
    const response = await fetch(fullUrl, options);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const message =
        errorBody.error ||
        errorBody.message ||
        getDefaultErrorMessage(response.status);

      throw new ApiError(message, response.status);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw error;
      }
      throw new ApiError(`Network error: ${error.message}`, 0);
    }

    throw new ApiError("An unexpected error occurred", 0);
  }
};

const getDefaultErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return "Invalid request";
    case 401:
      return "Unauthorized";
    case 403:
      return "Forbidden";
    case 404:
      return "Not found";
    case 422:
      return "Validation error";
    case 500:
      return "Server error";
    default:
      return `Request failed (${status})`;
  }
};

export const getEmployees = async (
  filters: EmployeeFilters = {},
  signal?: AbortSignal,
): Promise<EmployeesResponse> => {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.department?.length)
    params.set("department", filters.department.join(","));
  if (filters.status && filters.status !== "all")
    params.set("status", filters.status);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.order) params.set("order", filters.order);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));

  const query = params.toString();
  return api(`/employees${query ? `?${query}` : ""}`, { signal });
};

export const getEmployee = (
  id: number,
  signal?: AbortSignal,
): Promise<Employee> => api(`/employees/${id}`, { signal });

export const getDepartments = (signal?: AbortSignal): Promise<string[]> =>
  api("/departments", { signal });

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
