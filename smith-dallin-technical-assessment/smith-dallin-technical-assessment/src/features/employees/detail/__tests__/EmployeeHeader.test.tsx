import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EmployeeHeader from "../EmployeeHeader";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockEmployee = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  title: "Software Engineer",
  department: "Engineering",
  dateStarted: "2024-01-15T00:00:00.000Z",
  quote: "Hello world!",
  status: "active" as const,
  avatarUrl: "https://example.com/avatar.jpg",
  squads: ["Alpha", "Beta"],
};

describe("EmployeeHeader", () => {
  const defaultProps = {
    employee: mockEmployee,
    onAvatarUpload: vi.fn(),
  };

  describe("employee name and title", () => {
    it("displays employee full name", () => {
      render(<EmployeeHeader {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("displays employee title", () => {
      render(<EmployeeHeader {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    });
  });

  describe("squads display", () => {
    it("displays all squads for active employee", () => {
      render(<EmployeeHeader {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByText("Alpha")).toBeInTheDocument();
      expect(screen.getByText("Beta")).toBeInTheDocument();
    });

    it("does not display squads for inactive employee", () => {
      render(
        <EmployeeHeader
          {...defaultProps}
          employee={{ ...mockEmployee, status: "inactive" }}
        />,
        { wrapper: createWrapper() },
      );

      expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
      expect(screen.queryByText("Beta")).not.toBeInTheDocument();
    });
  });

  describe("inactive status", () => {
    it("displays (deactivated) label for inactive employee", () => {
      render(
        <EmployeeHeader
          {...defaultProps}
          employee={{ ...mockEmployee, status: "inactive" }}
        />,
        { wrapper: createWrapper() },
      );

      expect(screen.getByText("(deactivated)")).toBeInTheDocument();
    });

    it("does not display (deactivated) for active employee", () => {
      render(<EmployeeHeader {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.queryByText("(deactivated)")).not.toBeInTheDocument();
    });
  });

  describe("avatar", () => {
    it("renders avatar with employee image", () => {
      render(<EmployeeHeader {...defaultProps} />, { wrapper: createWrapper() });

      const avatar = screen.getByRole("img", { name: /john doe/i });
      expect(avatar).toBeInTheDocument();
    });
  });
});
