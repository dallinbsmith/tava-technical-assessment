import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import {
  employeeKeys,
  useEmployeesQuery,
  useEmployeeQuery,
} from "../queries";
import * as api from "../api";

vi.mock("../api");

const mockEmployee = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  title: "Engineer",
  department: "Engineering",
  dateStarted: "2024-01-01",
  quote: "Hello",
  status: "active" as const,
  avatarUrl: "",
  squads: ["Alpha"],
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe("employeeKeys", () => {
  it("generates correct key for all employees", () => {
    expect(employeeKeys.all).toEqual(["employees"]);
  });

  it("generates correct key for employee list with filters", () => {
    const filters = { search: "john", page: 1 };
    expect(employeeKeys.list(filters)).toEqual(["employees", filters]);
  });

  it("generates correct key for employee detail", () => {
    expect(employeeKeys.detail(1)).toEqual(["employee", 1]);
  });
});

describe("useEmployeesQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches employees with filters", async () => {
    const mockData = { data: [mockEmployee], total: 1, page: 1, limit: 9 };
    vi.mocked(api.getEmployees).mockResolvedValueOnce(mockData);

    const filters = { search: "john" };
    const { result } = renderHook(() => useEmployeesQuery(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.getEmployees).toHaveBeenCalledWith(filters);
    expect(result.current.data).toEqual(mockData);
  });

  it("handles error state", async () => {
    const error = new Error("Failed to fetch");
    vi.mocked(api.getEmployees).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useEmployeesQuery({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(error);
  });
});

describe("useEmployeeQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches single employee by id", async () => {
    vi.mocked(api.getEmployee).mockResolvedValueOnce(mockEmployee);

    const { result } = renderHook(() => useEmployeeQuery(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.getEmployee).toHaveBeenCalledWith(1);
    expect(result.current.data).toEqual(mockEmployee);
  });

  it("does not fetch when id is 0 (falsy)", async () => {
    const { result } = renderHook(() => useEmployeeQuery(0), {
      wrapper: createWrapper(),
    });

    // Query should not be enabled
    expect(result.current.fetchStatus).toBe("idle");
    expect(api.getEmployee).not.toHaveBeenCalled();
  });
});
