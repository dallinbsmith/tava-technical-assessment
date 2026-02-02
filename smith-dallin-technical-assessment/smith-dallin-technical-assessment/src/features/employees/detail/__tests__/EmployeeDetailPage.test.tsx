import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@test/test-utils";
import { mockEmployee } from "@test/mocks";
import userEvent from "@testing-library/user-event";
import EmployeeDetailPage from "../EmployeeDetailPage";
import * as reactRouterDom from "react-router-dom";
import * as queries from "@shared/lib/queries";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});

vi.mock("@shared/lib/queries", async () => {
  const actual = await vi.importActual("@shared/lib/queries");
  return {
    ...actual,
    useEmployeeQuery: vi.fn(),
    useDeleteEmployeeMutation: vi.fn(),
    useAvatarMutation: vi.fn(),
  };
});

describe("EmployeeDetailPage", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(reactRouterDom.useParams).mockReturnValue({ id: "1" });
    vi.mocked(reactRouterDom.useNavigate).mockReturnValue(mockNavigate);

    vi.mocked(queries.useEmployeeQuery).mockReturnValue({
      data: mockEmployee,
      isLoading: false,
      error: null,
    } as ReturnType<typeof queries.useEmployeeQuery>);

    vi.mocked(queries.useDeleteEmployeeMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: null,
    } as unknown as ReturnType<typeof queries.useDeleteEmployeeMutation>);

    vi.mocked(queries.useAvatarMutation).mockReturnValue({
      mutateAsync: vi.fn(),
    } as unknown as ReturnType<typeof queries.useAvatarMutation>);
  });

  describe("loading state", () => {
    it("shows loading spinner while fetching", () => {
      vi.mocked(queries.useEmployeeQuery).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as ReturnType<typeof queries.useEmployeeQuery>);

      render(<EmployeeDetailPage />);

      expect(document.querySelector(".animate-spin")).toBeInTheDocument();
    });
  });

  describe("error state", () => {
    it("shows error message when fetch fails", () => {
      vi.mocked(queries.useEmployeeQuery).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error("Failed to fetch"),
      } as unknown as ReturnType<typeof queries.useEmployeeQuery>);

      render(<EmployeeDetailPage />);

      expect(screen.getByText("Failed to fetch")).toBeInTheDocument();
    });

    it("shows 'Employee not found' when no employee and no error", () => {
      vi.mocked(queries.useEmployeeQuery).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
      } as ReturnType<typeof queries.useEmployeeQuery>);

      render(<EmployeeDetailPage />);

      expect(screen.getByText("Employee not found")).toBeInTheDocument();
    });

    it("shows back to list link on error", () => {
      vi.mocked(queries.useEmployeeQuery).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error("Error"),
      } as unknown as ReturnType<typeof queries.useEmployeeQuery>);

      render(<EmployeeDetailPage />);

      expect(screen.getByText("Back to list")).toBeInTheDocument();
    });
  });

  describe("employee details", () => {
    it("displays employee name", async () => {
      render(<EmployeeDetailPage />);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });
    });

    it("displays employee title", async () => {
      render(<EmployeeDetailPage />);

      await waitFor(() => {
        expect(screen.getByText("Software Engineer")).toBeInTheDocument();
      });
    });

    it("displays employee email", async () => {
      render(<EmployeeDetailPage />);

      await waitFor(() => {
        expect(screen.getByText("john@example.com")).toBeInTheDocument();
      });
    });
  });

  describe("navigation", () => {
    it("shows back to list link", () => {
      render(<EmployeeDetailPage />);

      const backLinks = screen.getAllByText("Back to list");
      expect(backLinks.length).toBeGreaterThan(0);
    });

    it("shows Edit button linking to edit page", () => {
      render(<EmployeeDetailPage />);

      const editLink = screen.getByRole("link", { name: /edit/i });
      expect(editLink).toHaveAttribute("href", "/employees/1/edit");
    });
  });

  describe("delete functionality", () => {
    it("shows Remove button", () => {
      render(<EmployeeDetailPage />);

      expect(screen.getByText("Remove")).toBeInTheDocument();
    });

    it("opens delete confirmation modal when Remove is clicked", async () => {
      const user = userEvent.setup();
      render(<EmployeeDetailPage />);

      await user.click(screen.getByText("Remove"));

      await waitFor(() => {
        expect(screen.getByText("Confirm Removal")).toBeInTheDocument();
      });
    });

    it("shows employee name in delete confirmation", async () => {
      const user = userEvent.setup();
      render(<EmployeeDetailPage />);

      await user.click(screen.getByText("Remove"));

      await waitFor(() => {
        expect(
          screen.getByText(/Are you sure you want to remove/),
        ).toBeInTheDocument();
        const confirmText = screen.getByText(/Are you sure you want to remove/);
        expect(confirmText.closest("p")?.textContent).toContain("John Doe");
      });
    });
  });
});
