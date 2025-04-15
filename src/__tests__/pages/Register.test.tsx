import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Register from "@/pages/Register";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

describe("Register Page", () => {
  const mockSignUp = vi.fn();
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ signUp: mockSignUp, isLoading: false });
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  it("should show an error toast if passwords do not match", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Full Name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText("Email address"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "password456" } });

    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    expect(mockToast).toHaveBeenCalledWith({
      title: "Error",
      description: "Passwords do not match.",
      variant: "destructive",
    });
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it("should call signUp with correct arguments when form is valid", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Full Name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText("Email address"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    expect(mockSignUp).toHaveBeenCalledWith("john@example.com", "password123", "John Doe");
    expect(mockToast).not.toHaveBeenCalled();
  });

  it("should disable the button and show loading text when isLoading is true", async () => {
    (useAuth as jest.Mock).mockReturnValue({ signUp: mockSignUp, isLoading: true });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: "Creating Account..." });
    expect(button).toBeDisabled();
  });
});