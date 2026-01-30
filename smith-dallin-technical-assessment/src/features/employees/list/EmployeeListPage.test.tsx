import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../../test/test-utils";
import userEvent from "@testing-library/user-event";
import EmployeeListPage from "./EmployeeListPage";
import * as reactRouterDom from "react-router-dom";
import * as queries from "../api/queries";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLoaderData: vi.fn(),
  };
});

vi.mock("../api/queries", () => ({
  useEmployeesQuery: vi.fn(),
  useDeleteEmployeeMutation: vi.fn(),
}));

const mockEmployees = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    title: "Software Engineer",
    department: "Engineering",
    dateStarted: "2024-01-15",
    quote: "Hello world",
    status: "active" as const,
    avatarUrl: "",
    squads: ["Alpha"],
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    title: "Product Manager",
    department: "Product",
    dateStarted: "2023-06-01",
    quote: "Ship it!",
    status: "active" as const,
    avatarUrl: "",
    squads: ["Beta"],
  },
];

describe("EmployeeListPage", () => {
  beforeEach(() => {
    vi.mocked(reactRouterDom.useLoaderData).mockReturnValue({
      departments: ["Engineering", "Product", "Design"],
      squads: ["Alpha", "Beta", "Gamma"],
    });

    vi.mocked(queries.useEmployeesQuery).mockReturnValue({
      data: { data: mockEmployees, total: 2, page: 1, limit: 9 },
      isLoading: false,
      error: null,
    } as ReturnType<typeof queries.useEmployeesQuery>);

    vi.mocked(queries.useDeleteEmployeeMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: null,
    } as unknown as ReturnType<typeof queries.useDeleteEmployeeMutation>);
  });

  it("renders employee list with employee names", async () => {
    render(<EmployeeListPage />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  it("displays the correct employee count", async () => {
    render(<EmployeeListPage />);

    await waitFor(() => {
      expect(screen.getByText("2 employees")).toBeInTheDocument();
    });
  });

  it("shows search input and filters button", () => {
    render(<EmployeeListPage />);

    expect(
      screen.getByPlaceholderText("Search employees..."),
    ).toBeInTheDocument();
    expect(screen.getByText("Filters")).toBeInTheDocument();
  });

  it("shows Add Employee button", () => {
    render(<EmployeeListPage />);

    expect(screen.getByText("+ Add Employee")).toBeInTheDocument();
  });

  it("allows typing in search input", async () => {
    const user = userEvent.setup();
    render(<EmployeeListPage />);

    const searchInput = screen.getByPlaceholderText("Search employees...");
    await user.type(searchInput, "John");

    expect(searchInput).toHaveValue("John");
  });

  it("shows loading state when data is loading", () => {
    vi.mocked(queries.useEmployeesQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as ReturnType<typeof queries.useEmployeesQuery>);

    render(<EmployeeListPage />);

    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("shows error state when query fails", () => {
    vi.mocked(queries.useEmployeesQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed to fetch"),
    } as unknown as ReturnType<typeof queries.useEmployeesQuery>);

    render(<EmployeeListPage />);

    expect(screen.getByText("Failed to Load Employees")).toBeInTheDocument();
    expect(screen.getByText("Failed to fetch")).toBeInTheDocument();
  });

  it("shows empty state when no employees match filters", () => {
    vi.mocked(queries.useEmployeesQuery).mockReturnValue({
      data: { data: [], total: 0, page: 1, limit: 9 },
      isLoading: false,
      error: null,
    } as ReturnType<typeof queries.useEmployeesQuery>);

    render(<EmployeeListPage />);

    expect(screen.getByText("No results")).toBeInTheDocument();
    expect(
      screen.getByText("Try adjusting your search or filters"),
    ).toBeInTheDocument();
  });
});
