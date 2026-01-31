import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { mockEmployee as baseMockEmployee } from "@test/test-utils";
import EmployeeInfo from "../../EmployeeInfo";

const mockEmployee = { ...baseMockEmployee, avatarUrl: "" };

describe("EmployeeInfo", () => {
  describe("contact information", () => {
    it("displays email", () => {
      render(<EmployeeInfo employee={mockEmployee} />);

      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    it("displays Contact Information heading", () => {
      render(<EmployeeInfo employee={mockEmployee} />);

      expect(screen.getByText("Contact Information")).toBeInTheDocument();
    });
  });

  describe("work information", () => {
    it("displays department", () => {
      render(<EmployeeInfo employee={mockEmployee} />);

      expect(screen.getByText("Engineering")).toBeInTheDocument();
    });

    it("displays 'Not assigned' when no department", () => {
      render(<EmployeeInfo employee={{ ...mockEmployee, department: "" }} />);

      expect(screen.getByText("Not assigned")).toBeInTheDocument();
    });

    it("displays Work Information heading", () => {
      render(<EmployeeInfo employee={mockEmployee} />);

      expect(screen.getByText("Work Information")).toBeInTheDocument();
    });
  });

  describe("employment details", () => {
    it("displays formatted start date", () => {
      render(<EmployeeInfo employee={mockEmployee} />);

      // The date is formatted with toLocaleDateString - check for year at minimum
      // due to timezone differences in test environment
      expect(screen.getByText(/2024/)).toBeInTheDocument();
      expect(screen.getByText(/January/)).toBeInTheDocument();
    });

    it("displays 'Not specified' when no start date", () => {
      render(<EmployeeInfo employee={{ ...mockEmployee, dateStarted: "" }} />);

      expect(screen.getByText("Not specified")).toBeInTheDocument();
    });

    it("displays Employment Details heading", () => {
      render(<EmployeeInfo employee={mockEmployee} />);

      expect(screen.getByText("Employment Details")).toBeInTheDocument();
    });
  });

  describe("employee ID", () => {
    it("displays employee ID", () => {
      render(<EmployeeInfo employee={mockEmployee} />);

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("Employee ID")).toBeInTheDocument();
    });

    it("displays Employee Information heading", () => {
      render(<EmployeeInfo employee={mockEmployee} />);

      expect(screen.getByText("Employee Information")).toBeInTheDocument();
    });
  });

  describe("quote", () => {
    it("displays quote when present", () => {
      render(<EmployeeInfo employee={mockEmployee} />);

      expect(screen.getByText(/"Hello world!"/)).toBeInTheDocument();
    });

    it("does not display quote when empty", () => {
      render(<EmployeeInfo employee={{ ...mockEmployee, quote: "" }} />);

      expect(screen.queryByText(/"/)).not.toBeInTheDocument();
    });
  });
});
