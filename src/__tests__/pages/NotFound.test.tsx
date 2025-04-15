import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, useLocation } from "react-router-dom";
import NotFound from "../../pages/NotFound";
import React from "react";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});

describe("NotFound Page", () => {
  const mockUseLocation = useLocation as unknown as jest.Mock;

  it("should render the 404 message", () => {
    mockUseLocation.mockReturnValue({ pathname: "/non-existent-route" });

    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Oops! Page not found")).toBeInTheDocument();
  });

  it("should render the 'Return to Home' link", () => {
    mockUseLocation.mockReturnValue({ pathname: "/non-existent-route" });

    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const homeLink = screen.getByText("Return to Home");
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("should log an error to the console with the correct message", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockUseLocation.mockReturnValue({ pathname: "/non-existent-route" });

    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "404 Error: User attempted to access non-existent route:",
      "/non-existent-route"
    );

    consoleErrorSpy.mockRestore();
  });
});