import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Avatar from "../Avatar";

describe("Avatar", () => {
  describe("initials fallback", () => {
    it("displays initials when no src is provided", () => {
      render(<Avatar firstName="John" lastName="Doe" />);

      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("uppercases initials", () => {
      render(<Avatar firstName="john" lastName="doe" />);

      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("handles single character names", () => {
      render(<Avatar firstName="J" lastName="D" />);

      expect(screen.getByText("JD")).toBeInTheDocument();
    });
  });

  describe("image display", () => {
    it("displays image when src is provided", () => {
      render(
        <Avatar
          firstName="John"
          lastName="Doe"
          src="https://example.com/avatar.jpg"
        />,
      );

      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
      expect(img).toHaveAttribute("alt", "John Doe");
    });

    it("falls back to initials on image error", () => {
      render(
        <Avatar
          firstName="John"
          lastName="Doe"
          src="https://example.com/broken.jpg"
        />,
      );

      const img = screen.getByRole("img");
      fireEvent.error(img);

      expect(screen.getByText("JD")).toBeInTheDocument();
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });
  });

  describe("sizes", () => {
    it("applies sm size classes", () => {
      const { container } = render(
        <Avatar firstName="John" lastName="Doe" size="sm" />,
      );

      expect(container.firstChild).toHaveClass("w-8", "h-8");
    });

    it("applies md size classes (default)", () => {
      const { container } = render(<Avatar firstName="John" lastName="Doe" />);

      expect(container.firstChild).toHaveClass("w-10", "h-10");
    });

    it("applies lg size classes", () => {
      const { container } = render(
        <Avatar firstName="John" lastName="Doe" size="lg" />,
      );

      expect(container.firstChild).toHaveClass("w-14", "h-14");
    });

    it("applies xl size classes", () => {
      const { container } = render(
        <Avatar firstName="John" lastName="Doe" size="xl" />,
      );

      expect(container.firstChild).toHaveClass("w-24", "h-24");
    });
  });

  describe("inactive state", () => {
    it("applies grayscale when inactive", () => {
      const { container } = render(
        <Avatar firstName="John" lastName="Doe" inactive={true} />,
      );

      expect(container.firstChild).toHaveClass("grayscale");
    });

    it("does not apply grayscale when active", () => {
      const { container } = render(
        <Avatar firstName="John" lastName="Doe" inactive={false} />,
      );

      expect(container.firstChild).not.toHaveClass("grayscale");
    });
  });

  describe("custom className", () => {
    it("applies additional className", () => {
      const { container } = render(
        <Avatar firstName="John" lastName="Doe" className="custom-class" />,
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });
});
