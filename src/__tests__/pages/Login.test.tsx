import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Login from "../../pages/Login";
import React from "react";

const mockSignIn = vi.fn();
const mockToast = vi.fn();

vi.mock("../../hooks/useAuth", () => {
  return {
    AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useAuth: () => ({
      signIn: mockSignIn,
      isLoading: false,
    }),
  };
});

vi.mock("../../hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

import { AuthProvider } from "../../hooks/useAuth";

describe("Login Page", () => {
  beforeEach(() => {
    mockSignIn.mockClear();
    mockToast.mockClear();
  });

  it("should render the Login component correctly", () => {
    render(
      <MemoryRouter>
        <React.Suspense fallback={null}>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </React.Suspense>
      </MemoryRouter>
    );
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });


  it("should show an error toast when fields are empty", async () => {
    render(
      <MemoryRouter>
        <React.Suspense fallback={null}>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </React.Suspense>
      </MemoryRouter>
    );
    fireEvent.submit(screen.getByTestId("login-form"));
    // Debug log to check calls
    console.log("mockToast calls:", mockToast.mock.calls);
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringMatching(/error/i),
        })
      );
    });
  });

  it("should call signIn with valid inputs", () => {
    render(
      <MemoryRouter>
        <React.Suspense fallback={null}>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </React.Suspense>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(mockSignIn).toHaveBeenCalledWith("test@example.com", "password123");
  });

  it("should render the 'Remember me' checkbox", () => {
    render(
      <MemoryRouter>
        <React.Suspense fallback={null}>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </React.Suspense>
      </MemoryRouter>
    );
    expect(screen.getByLabelText("Remember me")).toBeInTheDocument();
  });

  it("should render the 'Forgot your password?' link", () => {
    render(
      <MemoryRouter>
        <React.Suspense fallback={null}>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </React.Suspense>
      </MemoryRouter>
    );
    expect(screen.getByText("Forgot your password?")).toBeInTheDocument();
  });

  it("should render the 'create a new account' link", () => {
    render(
      <MemoryRouter>
        <React.Suspense fallback={null}>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </React.Suspense>
      </MemoryRouter>
    );
    expect(screen.getByText("create a new account")).toBeInTheDocument();
  });
});
