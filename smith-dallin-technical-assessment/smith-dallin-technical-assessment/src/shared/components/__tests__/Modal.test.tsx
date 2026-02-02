import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Settings } from "lucide-react";
import { Modal } from "../Modal";

describe("Modal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: "Test Modal",
    children: <p>Modal content</p>,
  };

  describe("visibility", () => {
    it("renders when isOpen is true", () => {
      render(<Modal {...defaultProps} />);

      expect(screen.getByText("Test Modal")).toBeInTheDocument();
      expect(screen.getByText("Modal content")).toBeInTheDocument();
    });

    it("does not render when isOpen is false", () => {
      render(<Modal {...defaultProps} isOpen={false} />);

      expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
    });
  });

  describe("close behavior", () => {
    it("calls onClose when X button is clicked", async () => {
      const onClose = vi.fn();
      const user = userEvent.setup();

      render(<Modal {...defaultProps} onClose={onClose} />);

      const closeButton = screen.getByRole("button");
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when backdrop is clicked", async () => {
      const onClose = vi.fn();
      const user = userEvent.setup();

      render(<Modal {...defaultProps} onClose={onClose} />);

      const backdrop = document.querySelector(".bg-black\\/60");
      await user.click(backdrop!);

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("title and icon", () => {
    it("displays the title", () => {
      render(<Modal {...defaultProps} title="Custom Title" />);

      expect(screen.getByText("Custom Title")).toBeInTheDocument();
    });

    it("renders icon when provided", () => {
      render(<Modal {...defaultProps} icon={Settings} />);

      const header = screen.getByText("Test Modal").parentElement;
      expect(header?.querySelector("svg")).toBeInTheDocument();
    });

    it("does not render icon when not provided", () => {
      render(<Modal {...defaultProps} />);

      const header = screen.getByText("Test Modal").parentElement;
      const titleArea = header?.querySelector("svg");
      expect(titleArea).not.toBeInTheDocument();
    });
  });

  describe("footer", () => {
    it("renders footer when provided", () => {
      const footer = <button>Submit</button>;

      render(<Modal {...defaultProps} footer={footer} />);

      expect(screen.getByText("Submit")).toBeInTheDocument();
    });

    it("does not render footer section when not provided", () => {
      render(<Modal {...defaultProps} />);

      expect(screen.queryByText("Submit")).not.toBeInTheDocument();
    });
  });

  describe("content", () => {
    it("renders children content", () => {
      render(
        <Modal {...defaultProps}>
          <div data-testid="custom-content">Custom children</div>
        </Modal>,
      );

      expect(screen.getByTestId("custom-content")).toBeInTheDocument();
      expect(screen.getByText("Custom children")).toBeInTheDocument();
    });

    it("renders complex children", () => {
      render(
        <Modal {...defaultProps}>
          <form>
            <input type="text" placeholder="Enter name" />
            <button type="submit">Save</button>
          </form>
        </Modal>,
      );

      expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
      expect(screen.getByText("Save")).toBeInTheDocument();
    });
  });
});
