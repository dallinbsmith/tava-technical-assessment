import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterModal from "../FilterModal";

describe("FilterModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    departments: ["Engineering", "Product", "Design"],
    selectedDepartments: [] as string[],
    sortField: "firstName" as const,
    sortOrder: "asc" as const,
    statusFilter: "all" as const,
    onApply: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders when open", () => {
      render(<FilterModal {...defaultProps} />);

      expect(screen.getByText("Filters")).toBeInTheDocument();
    });

    it("does not render when closed", () => {
      render(<FilterModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByText("Filters")).not.toBeInTheDocument();
    });

    it("displays all sections", () => {
      render(<FilterModal {...defaultProps} />);

      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Sort By")).toBeInTheDocument();
      expect(screen.getByText("Departments")).toBeInTheDocument();
    });
  });

  describe("status filter", () => {
    it("shows All, Active, and Inactive options", () => {
      render(<FilterModal {...defaultProps} />);

      expect(screen.getByText("All")).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();
      expect(screen.getByText("Inactive")).toBeInTheDocument();
    });

    it("can select a status", async () => {
      const user = userEvent.setup();
      render(<FilterModal {...defaultProps} />);

      await user.click(screen.getByText("Active"));
      await user.click(screen.getByText("Apply"));

      expect(defaultProps.onApply).toHaveBeenCalledWith(
        [],
        "firstName",
        "asc",
        "active",
      );
    });
  });

  describe("sort options", () => {
    it("shows sort field options", () => {
      render(<FilterModal {...defaultProps} />);

      expect(screen.getByText("First Name")).toBeInTheDocument();
      expect(screen.getByText("Last Name")).toBeInTheDocument();
    });

    it("shows sort order options", () => {
      render(<FilterModal {...defaultProps} />);

      expect(screen.getByText("A → Z")).toBeInTheDocument();
      expect(screen.getByText("Z → A")).toBeInTheDocument();
    });

    it("can change sort field", async () => {
      const user = userEvent.setup();
      render(<FilterModal {...defaultProps} />);

      await user.click(screen.getByText("Last Name"));
      await user.click(screen.getByText("Apply"));

      expect(defaultProps.onApply).toHaveBeenCalledWith(
        [],
        "lastName",
        "asc",
        "all",
      );
    });

    it("can change sort order", async () => {
      const user = userEvent.setup();
      render(<FilterModal {...defaultProps} />);

      await user.click(screen.getByText("Z → A"));
      await user.click(screen.getByText("Apply"));

      expect(defaultProps.onApply).toHaveBeenCalledWith(
        [],
        "firstName",
        "desc",
        "all",
      );
    });
  });

  describe("department filter", () => {
    it("displays all departments", () => {
      render(<FilterModal {...defaultProps} />);

      expect(screen.getByText("Engineering")).toBeInTheDocument();
      expect(screen.getByText("Product")).toBeInTheDocument();
      expect(screen.getByText("Design")).toBeInTheDocument();
    });

    it("can select a department", async () => {
      const user = userEvent.setup();
      render(<FilterModal {...defaultProps} />);

      await user.click(screen.getByText("Engineering"));
      await user.click(screen.getByText("Apply"));

      expect(defaultProps.onApply).toHaveBeenCalledWith(
        ["Engineering"],
        "firstName",
        "asc",
        "all",
      );
    });

    it("can select multiple departments", async () => {
      const user = userEvent.setup();
      render(<FilterModal {...defaultProps} />);

      await user.click(screen.getByText("Engineering"));
      await user.click(screen.getByText("Product"));
      await user.click(screen.getByText("Apply"));

      expect(defaultProps.onApply).toHaveBeenCalledWith(
        ["Engineering", "Product"],
        "firstName",
        "asc",
        "all",
      );
    });

    it("shows pre-selected departments as checked", () => {
      render(
        <FilterModal {...defaultProps} selectedDepartments={["Engineering"]} />,
      );

      const checkbox = screen.getByRole("checkbox", { name: /engineering/i });
      expect(checkbox).toBeChecked();
    });
  });

  describe("clear functionality", () => {
    it("Clear button is disabled when no selections", () => {
      render(<FilterModal {...defaultProps} />);

      expect(screen.getByText("Clear")).toBeDisabled();
    });

    it("Clear button is enabled when there are selections", () => {
      render(
        <FilterModal {...defaultProps} selectedDepartments={["Engineering"]} />,
      );

      expect(screen.getByText("Clear")).not.toBeDisabled();
    });

    it("clears all selections when Clear is clicked", async () => {
      const user = userEvent.setup();
      render(
        <FilterModal
          {...defaultProps}
          selectedDepartments={["Engineering"]}
          statusFilter="active"
        />,
      );

      await user.click(screen.getByText("Clear"));
      await user.click(screen.getByText("Apply"));

      expect(defaultProps.onApply).toHaveBeenCalledWith(
        [],
        "firstName",
        "asc",
        "all",
      );
    });
  });

  describe("apply and close", () => {
    it("calls onApply with all selections", async () => {
      const user = userEvent.setup();
      render(<FilterModal {...defaultProps} />);

      await user.click(screen.getByText("Engineering"));
      await user.click(screen.getByText("Last Name"));
      await user.click(screen.getByText("Z → A"));
      await user.click(screen.getByText("Inactive"));
      await user.click(screen.getByText("Apply"));

      expect(defaultProps.onApply).toHaveBeenCalledWith(
        ["Engineering"],
        "lastName",
        "desc",
        "inactive",
      );
    });

    it("calls onClose after Apply", async () => {
      const user = userEvent.setup();
      render(<FilterModal {...defaultProps} />);

      await user.click(screen.getByText("Apply"));

      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  describe("state sync on open", () => {
    it("resets local state to props when modal opens", () => {
      const { rerender } = render(
        <FilterModal {...defaultProps} isOpen={false} />,
      );

      rerender(
        <FilterModal
          {...defaultProps}
          isOpen={true}
          selectedDepartments={["Engineering"]}
        />,
      );

      const checkbox = screen.getByRole("checkbox", { name: /engineering/i });
      expect(checkbox).toBeChecked();
    });
  });
});
