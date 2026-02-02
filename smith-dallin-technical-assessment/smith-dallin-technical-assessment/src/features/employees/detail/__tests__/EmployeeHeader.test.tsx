import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { createQueryWrapper } from "@test/test-utils";
import { mockEmployee } from "@test/mocks";
import EmployeeHeader from "../EmployeeHeader";

describe("EmployeeHeader", () => {
  const defaultProps = {
    employee: mockEmployee,
    onAvatarUpload: vi.fn(),
  };

  describe("employee name and title", () => {
    it("displays employee full name", () => {
      render(<EmployeeHeader {...defaultProps} />, {
        wrapper: createQueryWrapper(),
      });

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("displays employee title", () => {
      render(<EmployeeHeader {...defaultProps} />, {
        wrapper: createQueryWrapper(),
      });

      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    });
  });

  describe("inactive status", () => {
    it("displays (deactivated) label for inactive employee", () => {
      render(
        <EmployeeHeader
          {...defaultProps}
          employee={{ ...mockEmployee, status: "inactive" }}
        />,
        { wrapper: createQueryWrapper() },
      );

      expect(screen.getByText("(deactivated)")).toBeInTheDocument();
    });

    it("does not display (deactivated) for active employee", () => {
      render(<EmployeeHeader {...defaultProps} />, {
        wrapper: createQueryWrapper(),
      });

      expect(screen.queryByText("(deactivated)")).not.toBeInTheDocument();
    });
  });

  describe("avatar", () => {
    it("renders avatar with employee image", () => {
      render(<EmployeeHeader {...defaultProps} />, {
        wrapper: createQueryWrapper(),
      });

      const avatar = screen.getByRole("img", { name: /john doe/i });
      expect(avatar).toBeInTheDocument();
    });
  });
});
