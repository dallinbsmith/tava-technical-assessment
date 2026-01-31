import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "../../Pagination";

describe("Pagination", () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("visibility", () => {
    it("renders when totalPages > 1", () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("/ 5")).toBeInTheDocument();
    });

    it("does not render when totalPages is 1", () => {
      const { container } = render(
        <Pagination {...defaultProps} totalPages={1} />,
      );

      expect(container).toBeEmptyDOMElement();
    });

    it("does not render when totalPages is 0", () => {
      const { container } = render(
        <Pagination {...defaultProps} totalPages={0} />,
      );

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("page display", () => {
    it("displays current page and total pages", () => {
      render(<Pagination {...defaultProps} currentPage={3} totalPages={10} />);

      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("/ 10")).toBeInTheDocument();
    });
  });

  describe("previous button", () => {
    it("is disabled on first page", () => {
      render(<Pagination {...defaultProps} currentPage={1} />);

      expect(screen.getByTitle("Previous")).toBeDisabled();
    });

    it("is enabled on pages after first", () => {
      render(<Pagination {...defaultProps} currentPage={2} />);

      expect(screen.getByTitle("Previous")).not.toBeDisabled();
    });

    it("calls onPageChange with previous page when clicked", async () => {
      const onPageChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Pagination
          {...defaultProps}
          currentPage={3}
          onPageChange={onPageChange}
        />,
      );

      await user.click(screen.getByTitle("Previous"));

      expect(onPageChange).toHaveBeenCalledWith(2);
    });
  });

  describe("next button", () => {
    it("is disabled on last page", () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={5} />);

      expect(screen.getByTitle("Next")).toBeDisabled();
    });

    it("is enabled on pages before last", () => {
      render(<Pagination {...defaultProps} currentPage={4} totalPages={5} />);

      expect(screen.getByTitle("Next")).not.toBeDisabled();
    });

    it("calls onPageChange with next page when clicked", async () => {
      const onPageChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Pagination
          {...defaultProps}
          currentPage={3}
          onPageChange={onPageChange}
        />,
      );

      await user.click(screen.getByTitle("Next"));

      expect(onPageChange).toHaveBeenCalledWith(4);
    });
  });

  describe("edge cases", () => {
    it("handles single-digit to double-digit page transition", () => {
      render(<Pagination {...defaultProps} currentPage={9} totalPages={15} />);

      expect(screen.getByText("9")).toBeInTheDocument();
      expect(screen.getByText("/ 15")).toBeInTheDocument();
    });

    it("handles large page numbers", () => {
      render(
        <Pagination {...defaultProps} currentPage={99} totalPages={100} />,
      );

      expect(screen.getByText("99")).toBeInTheDocument();
      expect(screen.getByText("/ 100")).toBeInTheDocument();
    });
  });
});
