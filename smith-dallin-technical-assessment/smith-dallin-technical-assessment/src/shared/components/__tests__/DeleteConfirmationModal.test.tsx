import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

describe("DeleteConfirmationModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    isDeleting: false,
    itemName: "John Doe",
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("visibility", () => {
    it("renders when isOpen is true", () => {
      render(<DeleteConfirmationModal {...defaultProps} />);

      expect(screen.getByText("Confirm Removal")).toBeInTheDocument();
    });

    it("does not render when isOpen is false", () => {
      render(<DeleteConfirmationModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByText("Confirm Removal")).not.toBeInTheDocument();
    });
  });

  describe("content", () => {
    it("displays warning message", () => {
      render(<DeleteConfirmationModal {...defaultProps} />);

      expect(
        screen.getByText("This action cannot be undone."),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "This will permanently remove this item from the system.",
        ),
      ).toBeInTheDocument();
    });

    it("displays item name in confirmation message", () => {
      render(
        <DeleteConfirmationModal {...defaultProps} itemName="Jane Smith" />,
      );

      expect(
        screen.getByText(/Are you sure you want to remove/),
      ).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    it("displays error message when provided", () => {
      render(
        <DeleteConfirmationModal
          {...defaultProps}
          error="Failed to delete employee"
        />,
      );

      expect(screen.getByText("Failed to delete employee")).toBeInTheDocument();
    });

    it("does not display error when null", () => {
      render(<DeleteConfirmationModal {...defaultProps} error={null} />);

      expect(screen.queryByText("Failed to delete")).not.toBeInTheDocument();
    });
  });

  describe("buttons", () => {
    it("shows Cancel and Remove buttons", () => {
      render(<DeleteConfirmationModal {...defaultProps} />);

      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Remove")).toBeInTheDocument();
    });

    it("calls onClose when Cancel is clicked", async () => {
      const onClose = vi.fn();
      const user = userEvent.setup();

      render(<DeleteConfirmationModal {...defaultProps} onClose={onClose} />);

      await user.click(screen.getByText("Cancel"));

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onConfirm when Remove is clicked", async () => {
      const onConfirm = vi.fn();
      const user = userEvent.setup();

      render(
        <DeleteConfirmationModal {...defaultProps} onConfirm={onConfirm} />,
      );

      await user.click(screen.getByText("Remove"));

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe("loading state", () => {
    it("shows Removing... text when isDeleting is true", () => {
      render(<DeleteConfirmationModal {...defaultProps} isDeleting={true} />);

      expect(screen.getByText("Removing...")).toBeInTheDocument();
      expect(screen.queryByText("Remove")).not.toBeInTheDocument();
    });

    it("disables buttons when isDeleting is true", () => {
      render(<DeleteConfirmationModal {...defaultProps} isDeleting={true} />);

      expect(screen.getByText("Cancel")).toBeDisabled();
      expect(screen.getByText("Removing...").closest("button")).toBeDisabled();
    });

    it("prevents closing modal when isDeleting is true", async () => {
      const onClose = vi.fn();
      const user = userEvent.setup();

      render(
        <DeleteConfirmationModal
          {...defaultProps}
          onClose={onClose}
          isDeleting={true}
        />,
      );

      // Try to click backdrop
      const backdrop = document.querySelector(".bg-black\\/60");
      await user.click(backdrop!);

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("buttons are keyboard accessible", async () => {
      const onConfirm = vi.fn();
      const user = userEvent.setup();

      render(
        <DeleteConfirmationModal {...defaultProps} onConfirm={onConfirm} />,
      );

      const removeButton = screen.getByText("Remove");
      removeButton.focus();
      await user.keyboard("{Enter}");

      expect(onConfirm).toHaveBeenCalled();
    });
  });
});
