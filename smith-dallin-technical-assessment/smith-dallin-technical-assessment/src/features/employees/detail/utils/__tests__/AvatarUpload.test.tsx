import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createQueryWrapper } from "@test/test-utils";
import AvatarUpload from "../../AvatarUpload";
import * as api from "@shared/lib/api";

vi.mock("@shared/lib/api", () => ({
  uploadAvatar: vi.fn(),
}));

describe("AvatarUpload", () => {
  const defaultProps = {
    firstName: "John",
    lastName: "Doe",
    onUpload: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("displays initials when no avatar URL", () => {
      render(<AvatarUpload {...defaultProps} />, {
        wrapper: createQueryWrapper(),
      });

      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("displays image when avatar URL is provided", () => {
      render(
        <AvatarUpload
          {...defaultProps}
          currentAvatarUrl="https://example.com/avatar.jpg"
        />,
        { wrapper: createQueryWrapper() },
      );

      const img = screen.getByRole("img", { name: /john doe/i });
      expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
    });

    it("shows upload button", () => {
      render(<AvatarUpload {...defaultProps} />, {
        wrapper: createQueryWrapper(),
      });

      expect(screen.getByTitle("Upload image")).toBeInTheDocument();
    });
  });

  describe("inactive state", () => {
    it("applies grayscale when inactive", () => {
      const { container } = render(
        <AvatarUpload {...defaultProps} inactive={true} />,
        { wrapper: createQueryWrapper() },
      );

      expect(container.querySelector(".grayscale")).toBeInTheDocument();
    });
  });

  describe("file input", () => {
    it("has file input with image accept attribute", () => {
      render(<AvatarUpload {...defaultProps} />, {
        wrapper: createQueryWrapper(),
      });

      const input = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("accept", "image/*");
    });
  });

  describe("file upload", () => {
    it("calls uploadAvatar and onUpload on valid file", async () => {
      const onUpload = vi.fn().mockResolvedValue(undefined);
      vi.mocked(api.uploadAvatar).mockResolvedValue(
        "https://example.com/new-avatar.jpg",
      );

      const user = userEvent.setup();
      render(<AvatarUpload {...defaultProps} onUpload={onUpload} />, {
        wrapper: createQueryWrapper(),
      });

      const input = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const file = new File(["test"], "avatar.jpg", { type: "image/jpeg" });

      await user.upload(input, file);

      await waitFor(() => {
        expect(api.uploadAvatar).toHaveBeenCalledWith(file);
      });

      await waitFor(() => {
        expect(onUpload).toHaveBeenCalledWith(
          "https://example.com/new-avatar.jpg",
        );
      });
    });

    it("shows loading state during upload", async () => {
      vi.mocked(api.uploadAvatar).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve("url"), 100)),
      );

      const user = userEvent.setup();
      render(<AvatarUpload {...defaultProps} />, {
        wrapper: createQueryWrapper(),
      });

      const input = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const file = new File(["test"], "avatar.jpg", { type: "image/jpeg" });

      await user.upload(input, file);

      expect(document.querySelector(".animate-spin")).toBeInTheDocument();
    });

    it("shows error on upload failure", async () => {
      vi.mocked(api.uploadAvatar).mockRejectedValue(new Error("Upload failed"));

      const user = userEvent.setup();
      render(<AvatarUpload {...defaultProps} />, {
        wrapper: createQueryWrapper(),
      });

      const input = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const file = new File(["test"], "avatar.jpg", { type: "image/jpeg" });

      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText("Upload failed")).toBeInTheDocument();
      });
    });
  });

  describe("error dismissal", () => {
    it("clears error when X is clicked", async () => {
      vi.mocked(api.uploadAvatar).mockRejectedValue(new Error("Upload failed"));

      const user = userEvent.setup();
      render(<AvatarUpload {...defaultProps} />, {
        wrapper: createQueryWrapper(),
      });

      const input = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const file = new File(["test"], "avatar.jpg", { type: "image/jpeg" });

      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText("Upload failed")).toBeInTheDocument();
      });

      // Find and click the close button on the error
      const closeButton = screen
        .getByText("Upload failed")
        .closest("div")
        ?.querySelector("button");

      if (closeButton) {
        await user.click(closeButton);
      }

      await waitFor(() => {
        expect(screen.queryByText("Upload failed")).not.toBeInTheDocument();
      });
    });
  });
});
