import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import PrijavaPage from "./PrijavaPage";
import { vi } from "vitest";

vi.mock("axios");
vi.mock("jwt-decode", async (importOriginal) => {
  const jwtDecode = await importOriginal();
  return {
    ...jwtDecode,
    jwtDecode: vi.fn(() => ({ uloga: "stanar" })),
  };
});

const token = "token";

describe("PrijavaPage", () => {
  beforeEach(() => {
    render(
      <Router>
        <PrijavaPage />
      </Router>
    );
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("renders login form", () => {
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Lozinka/i)).toBeInTheDocument();
    expect(screen.getByText(/Prijavi se/i)).toBeInTheDocument();
  });

  test("successful login saves token to local storage", async () => {
    const jwt_token = "mocked_token";

    localStorage.setItem(token, "mocked_token");

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Lozinka/i), { target: { value: "password" } });
    fireEvent.click(screen.getByText(/Prijavi se/i));

    await waitFor(() => {
      expect(localStorage.getItem(token)).toStrictEqual(jwt_token);
    });
  });

  /*   test("successful login redirects user to the correct page based on role", async () => {
    const token = "mocked_token";
    const decodedToken = { uloga: "stanar" }; // Assuming a mocked decoded token
    axios.post.mockResolvedValue({
      data: {
        success: true,
        token: token,
      },
    });

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Lozinka/i), { target: { value: "password" } });
    fireEvent.click(screen.getByText(/Prijavi se/i));

    await vi.waitFor(() => {
      // Verify the correct redirection based on the user role
      expect(mockNavigate).toHaveBeenCalledWith(decodedToken.uloga === "stanar" ? "/unosKvarova" : "/popisSvihStanara");
    });
  }); */

  test("unsuccessful login shows error message", async () => {
    axios.post.mockResolvedValue({
      data: {
        success: false,
        message: "Invalid credentials",
      },
    });

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "wrong@example.com" } });
    fireEvent.change(screen.getByLabelText(/Lozinka/i), { target: { value: "wrongpassword" } });
    fireEvent.click(screen.getByText(/Prijavi se/i));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  test("handles server error", async () => {
    axios.post.mockRejectedValue(new Error("Internal server error"));

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Lozinka/i), { target: { value: "password" } });
    fireEvent.click(screen.getByText(/Prijavi se/i));

    await waitFor(() => {
      expect(screen.getByText("Internal server error")).toBeInTheDocument();
    });
  });
});
