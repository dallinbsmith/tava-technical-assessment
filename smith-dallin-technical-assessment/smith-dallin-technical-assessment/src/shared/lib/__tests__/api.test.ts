import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getEmployees,
  getEmployee,
  getDepartments,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  uploadAvatar,
} from "../api";

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
};

describe("API functions", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe("getEmployees", () => {
    it("fetches employees without filters", async () => {
      const mockResponse = {
        data: [mockEmployee],
        total: 1,
        page: 1,
        limit: 9,
      };
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await getEmployees();

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3001/employees",
        { signal: undefined },
      );
      expect(result).toEqual(mockResponse);
    });

    it("builds query string from filters", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], total: 0, page: 1, limit: 9 }),
      } as Response);

      await getEmployees({
        search: "john",
        department: ["Engineering", "Product"],
        status: "active",
        sort: "firstName",
        order: "asc",
        page: 2,
        limit: 10,
      });

      const calledUrl = vi.mocked(global.fetch).mock.calls[0][0] as string;
      expect(calledUrl).toContain("search=john");
      expect(calledUrl).toContain("department=Engineering%2CProduct");
      expect(calledUrl).toContain("status=active");
      expect(calledUrl).toContain("sort=firstName");
      expect(calledUrl).toContain("order=asc");
      expect(calledUrl).toContain("page=2");
      expect(calledUrl).toContain("limit=10");
    });

    it("excludes status=all from query string", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], total: 0, page: 1, limit: 9 }),
      } as Response);

      await getEmployees({ status: "all" });

      const calledUrl = vi.mocked(global.fetch).mock.calls[0][0] as string;
      expect(calledUrl).not.toContain("status");
    });

    it("throws error on failed request", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "Server error" }),
      } as Response);

      await expect(getEmployees()).rejects.toThrow("Server error");
    });

    it("throws generic error when no error message in response", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error("Parse error")),
      } as Response);

      await expect(getEmployees()).rejects.toThrow("Server error");
    });
  });

  describe("getEmployee", () => {
    it("fetches single employee by id", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockEmployee),
      } as Response);

      const result = await getEmployee(1);

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3001/employees/1",
        { signal: undefined },
      );
      expect(result).toEqual(mockEmployee);
    });

    it("throws error for non-existent employee", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: "Employee not found" }),
      } as Response);

      await expect(getEmployee(999)).rejects.toThrow("Employee not found");
    });
  });

  describe("getDepartments", () => {
    it("fetches departments list", async () => {
      const departments = ["Engineering", "Product", "Design"];
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(departments),
      } as Response);

      const result = await getDepartments();

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3001/departments",
        { signal: undefined },
      );
      expect(result).toEqual(departments);
    });
  });

  describe("createEmployee", () => {
    it("creates employee with POST request", async () => {
      const newEmployee = { ...mockEmployee, id: undefined };
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockEmployee),
      } as Response);

      const result = await createEmployee(newEmployee);

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3001/employees",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEmployee),
        },
      );
      expect(result).toEqual(mockEmployee);
    });

    it("throws error on validation failure", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: "First name is required" }),
      } as Response);

      await expect(
        createEmployee({ ...mockEmployee, firstName: "" }),
      ).rejects.toThrow("First name is required");
    });
  });

  describe("updateEmployee", () => {
    it("updates employee with PUT request", async () => {
      const updates = { firstName: "Jane" };
      const updated = { ...mockEmployee, firstName: "Jane" };
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updated),
      } as Response);

      const result = await updateEmployee(1, updates);

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3001/employees/1",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        },
      );
      expect(result).toEqual(updated);
    });
  });

  describe("deleteEmployee", () => {
    it("deletes employee with DELETE request", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockEmployee),
      } as Response);

      const result = await deleteEmployee(1);

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3001/employees/1",
        { method: "DELETE" },
      );
      expect(result).toEqual(mockEmployee);
    });
  });

  describe("uploadAvatar", () => {
    it("uploads file with FormData", async () => {
      const file = new File(["test"], "avatar.png", { type: "image/png" });
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ url: "http://example.com/avatar.png" }),
      } as Response);

      const result = await uploadAvatar(file);

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3001/upload",
        expect.objectContaining({
          method: "POST",
          body: expect.any(FormData),
        }),
      );
      expect(result).toBe("http://example.com/avatar.png");
    });
  });
});
