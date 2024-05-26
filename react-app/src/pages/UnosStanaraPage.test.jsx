import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import UnosStanaraPage from "./UnosStanaraPage";
import { vi } from "vitest";

vi.mock("axios");

// Mock a valid JWT token
const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

describe("UnosStanaraPage", () => {
  beforeEach(() => {
    localStorage.setItem("token", validToken);
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("renders form elements correctly", () => {
    render(
      <Router>
        <UnosStanaraPage />
      </Router>
    );

    expect(screen.getByLabelText(/OIB/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/JMBAG/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Unesite Ime/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prezime/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Datum rođenja/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Adresa prebivališta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subvencioniranost/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Učilište/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Uplata teretane/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Komentar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email korisnika/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Lozinka/i)).toBeInTheDocument();
  });

  test("handles input changes correctly", () => {
    render(
      <Router>
        <UnosStanaraPage />
      </Router>
    );

    const oibInput = screen.getByLabelText(/OIB/i);
    fireEvent.change(oibInput, { target: { value: "12345678901" } });
    expect(oibInput.value).toBe("12345678901");

    const jmbagInput = screen.getByLabelText(/JMBAG/i);
    fireEvent.change(jmbagInput, { target: { value: "1234567890" } });
    expect(jmbagInput.value).toBe("1234567890");

    const nameInput = screen.getByLabelText(/Unesite Ime/i);
    fireEvent.change(nameInput, { target: { value: "John" } });
    expect(nameInput.value).toBe("John");
  });

  test("shows error message for invalid OIB", () => {
    render(
      <Router>
        <UnosStanaraPage />
      </Router>
    );

    const oibInput = screen.getByLabelText(/OIB/i);
    fireEvent.change(oibInput, { target: { value: "123" } });

    expect(screen.getByText(/OIB mora imati 11 znamenki./i)).toBeInTheDocument();
  });

  test("submits the form with valid data", async () => {
    axios.post.mockResolvedValue({ data: { success: true } });

    render(
      <Router>
        <UnosStanaraPage />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/OIB/i), { target: { value: "12345678901" } });
    fireEvent.change(screen.getByLabelText(/JMBAG/i), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByLabelText(/Unesite Ime/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/Prezime/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/Datum rođenja/i), { target: { value: "2000-01-01" } });
    fireEvent.change(screen.getByLabelText(/Adresa prebivališta/i), { target: { value: "Some Address" } });
    fireEvent.change(screen.getByLabelText(/Učilište/i), { target: { value: "Some School" } });
    fireEvent.change(screen.getByLabelText(/Email korisnika/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Lozinka/i), { target: { value: "password" } });

    fireEvent.click(screen.getByRole("button", { name: /Unesi/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("http://localhost:3000/unos-stanara", expect.any(Object), { headers: { Authorization: "Bearer " + validToken } });
    });

    expect(screen.getByLabelText(/OIB/i).value).toBe("");
  });
});
