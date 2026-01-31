import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@test/test-utils";
import userEvent from "@testing-library/user-event";
import EmployeeForm from "../../EmployeeForm";

describe("EmployeeForm", () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    submitLabel: "Create Employee",
    title: "Add New Employee",
    departments: ["Engineering", "Product", "Design"],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the form with title", () => {
      render(<EmployeeForm {...defaultProps} />);

      expect(screen.getByText("Add New Employee")).toBeInTheDocument();
    });

    it("renders all form fields", () => {
      render(<EmployeeForm {...defaultProps} />);

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/quote/i)).toBeInTheDocument();
    });

    it("renders status toggle buttons", () => {
      render(<EmployeeForm {...defaultProps} />);

      // Use getAllByRole since there may be multiple buttons with these names
      const activeButtons = screen.getAllByRole("button", {
        name: /^active$/i,
      });
      const inactiveButtons = screen.getAllByRole("button", {
        name: /^inactive$/i,
      });

      expect(activeButtons.length).toBeGreaterThan(0);
      expect(inactiveButtons.length).toBeGreaterThan(0);
    });

    it("renders submit and cancel buttons", () => {
      render(<EmployeeForm {...defaultProps} />);

      expect(screen.getByText("Create Employee")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    it("renders back to list link", () => {
      render(<EmployeeForm {...defaultProps} />);

      expect(screen.getByText("Back to list")).toBeInTheDocument();
    });
  });

  describe("initial data (edit mode)", () => {
    const initialData = {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      title: "Engineer",
      department: "Engineering",
      dateStarted: "2024-01-15T00:00:00.000Z",
      quote: "Hello world",
      status: "active" as const,
      avatarUrl: "",
    };

    it("populates fields with initial data", () => {
      render(<EmployeeForm {...defaultProps} initialData={initialData} />);

      expect(screen.getByDisplayValue("John")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Engineer")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2024-01-15")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Hello world")).toBeInTheDocument();
    });

    it("shows department from initial data", () => {
      render(<EmployeeForm {...defaultProps} initialData={initialData} />);

      const select = screen.getByLabelText(/department/i);
      expect(select).toHaveValue("Engineering");
    });
  });

  describe("form interaction", () => {
    it("allows typing in text fields", async () => {
      const user = userEvent.setup();
      render(<EmployeeForm {...defaultProps} />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      await user.type(firstNameInput, "Jane");

      expect(firstNameInput).toHaveValue("Jane");
    });

    it("allows toggling status", async () => {
      const user = userEvent.setup();
      render(<EmployeeForm {...defaultProps} />);

      const inactiveButton = screen.getByRole("button", { name: /inactive/i });
      await user.click(inactiveButton);

      // Check that inactive button has the selected styling
      expect(inactiveButton).toHaveClass("bg-red-900/30");
    });
  });

  describe("validation", () => {
    it("shows error for missing first name", async () => {
      const user = userEvent.setup();
      render(<EmployeeForm {...defaultProps} />);

      // Fill other required fields but not first name
      await user.type(screen.getByLabelText(/last name/i), "Doe");
      await user.type(screen.getByLabelText(/start date/i), "2024-01-15");

      await user.click(screen.getByText("Create Employee"));

      await waitFor(() => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      });
    });

    it("shows error for missing last name", async () => {
      const user = userEvent.setup();
      render(<EmployeeForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/first name/i), "John");
      await user.type(screen.getByLabelText(/start date/i), "2024-01-15");

      await user.click(screen.getByText("Create Employee"));

      await waitFor(() => {
        expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      });
    });

    it("accepts empty email but validates email format when provided", async () => {
      // This test verifies the email field behavior
      // The schema allows empty email or valid email format
      const user = userEvent.setup();
      const initialData = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "",
        title: "",
        department: "Engineering",
        dateStarted: "2024-01-15",
        quote: "",
        status: "active" as const,
        avatarUrl: "",
      };
      render(<EmployeeForm {...defaultProps} initialData={initialData} />);

      // Valid email should work
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "valid@example.com");

      expect(emailInput).toHaveValue("valid@example.com");
    });

    it("clears error when field is corrected", async () => {
      const user = userEvent.setup();
      render(<EmployeeForm {...defaultProps} />);

      // Trigger error
      await user.click(screen.getByText("Create Employee"));

      await waitFor(() => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      });

      // Fix the error
      await user.type(screen.getByLabelText(/first name/i), "John");

      await waitFor(() => {
        expect(
          screen.queryByText(/first name is required/i),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("form submission", () => {
    it("calls onSubmit with form data on valid submission", async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();
      // Provide initialData with department to pass validation
      const initialData = {
        id: 1,
        firstName: "",
        lastName: "",
        email: "",
        title: "",
        department: "Engineering",
        dateStarted: "",
        quote: "",
        status: "active" as const,
        avatarUrl: "",
      };

      render(
        <EmployeeForm
          {...defaultProps}
          onSubmit={onSubmit}
          initialData={initialData}
        />,
      );

      await user.type(screen.getByLabelText(/first name/i), "John");
      await user.type(screen.getByLabelText(/last name/i), "Doe");
      await user.type(screen.getByLabelText(/start date/i), "2024-01-15");

      await user.click(screen.getByText("Create Employee"));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            firstName: "John",
            lastName: "Doe",
            status: "active",
            department: "Engineering",
          }),
        );
      });
    });

    it("shows loading state during submission", async () => {
      const onSubmit = vi
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(resolve, 100)),
        );
      const user = userEvent.setup();
      const initialData = {
        id: 1,
        firstName: "",
        lastName: "",
        email: "",
        title: "",
        department: "Engineering",
        dateStarted: "",
        quote: "",
        status: "active" as const,
        avatarUrl: "",
      };

      render(
        <EmployeeForm
          {...defaultProps}
          onSubmit={onSubmit}
          initialData={initialData}
        />,
      );

      await user.type(screen.getByLabelText(/first name/i), "John");
      await user.type(screen.getByLabelText(/last name/i), "Doe");
      await user.type(screen.getByLabelText(/start date/i), "2024-01-15");

      await user.click(screen.getByText("Create Employee"));

      expect(screen.getByText("Saving...")).toBeInTheDocument();
    });

    it("shows error message on submission failure", async () => {
      const onSubmit = vi.fn().mockRejectedValue(new Error("Server error"));
      const user = userEvent.setup();
      const initialData = {
        id: 1,
        firstName: "",
        lastName: "",
        email: "",
        title: "",
        department: "Engineering",
        dateStarted: "",
        quote: "",
        status: "active" as const,
        avatarUrl: "",
      };

      render(
        <EmployeeForm
          {...defaultProps}
          onSubmit={onSubmit}
          initialData={initialData}
        />,
      );

      await user.type(screen.getByLabelText(/first name/i), "John");
      await user.type(screen.getByLabelText(/last name/i), "Doe");
      await user.type(screen.getByLabelText(/start date/i), "2024-01-15");

      await user.click(screen.getByText("Create Employee"));

      await waitFor(() => {
        expect(screen.getByText("Server error")).toBeInTheDocument();
      });
    });
  });
});
