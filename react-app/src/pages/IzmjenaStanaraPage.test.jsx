import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import axios from "axios";
import { MemoryRouter, Routes, Route, BrowserRouter as Router } from "react-router-dom";
import IzmjenaStanaraPage from "./IzmjenaStanaraPage";
import { expect, vi } from "vitest";
import { setupServer } from "msw/node";
import { rest } from "msw";

vi.mock("axios");

// Mock a valid JWT token
const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

describe("IzmjenaStanaraPage", () => {
  beforeEach(() => {
    localStorage.setItem("token", validToken);
  });

  afterEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
  });

  test("renders form elements correctly", async () => {
    const mockData = {
      oib: "12345678901",
      jmbag: "1234567890",
      ime: "John",
      prezime: "Doe",
      datum_rodenja: "2000-01-01",
      adresa_prebivalista: "123 Main St",
      subvencioniranost: false,
      uciliste: "Example University",
      uplata_teretane: false,
      komentar: "",
      id_korisnika: "1",
    };

    axios.get.mockResolvedValue({ data: mockData });

    render(
      <MemoryRouter initialEntries={["/izmjena-stanara/1"]}>
        <Routes>
          <Route path="/izmjena-stanara/:id" element={<IzmjenaStanaraPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the async operations to complete
    await waitFor(() => {
      expect(screen.getByLabelText(/OIB:/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/OIB:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/JMBAG:/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Ime:")).toBeInTheDocument();
    expect(screen.getByLabelText(/Prezime:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Datum Rođenja:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Adresa Prebivališta:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subvencioniranost/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Učilište:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Uplata teretane/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Komentar:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ID Korisnika:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Izmijeni/i })).toBeInTheDocument();
  });

  test("displays validation error messages", () => {
    render(
      <Router>
        <IzmjenaStanaraPage />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/OIB/i), { target: { value: "123" } });
    fireEvent.blur(screen.getByLabelText(/OIB/i));

    expect(screen.getByText(/OIB mora imati 11 znamenki/i)).toBeInTheDocument();
  });

  test("handles error during data fetching", async () => {
    // Mock the alert function
    window.alert = vi.fn();

    // Mock Axios to return an error
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch data"));

    render(
      <MemoryRouter initialEntries={["/izmjena-stanara/1"]}>
        <Routes>
          <Route path="/izmjena-stanara/:id" element={<IzmjenaStanaraPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the async operation to complete and check the alert
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Error fetching data. Please try again.");
    });
  });

  test("submits the form with valid data", async () => {
    const mockData = {
      oib: "12345678901",
      jmbag: "1234567890",
      ime: "John",
      prezime: "Doe",
      datum_rodenja: "2000-01-01",
      adresa_prebivalista: "123 Main St",
      subvencioniranost: false,
      uciliste: "Example University",
      uplata_teretane: false,
      komentar: "",
      id_korisnika: "1",
    };

    axios.get.mockResolvedValue({ data: mockData });
    axios.put.mockResolvedValue({ data: { success: true } });

    // Mock the alert function
    window.alert = vi.fn();

    render(
      <MemoryRouter initialEntries={["/izmjena-stanara/1"]}>
        <Routes>
          <Route path="/izmjena-stanara/:id" element={<IzmjenaStanaraPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the async operations to complete
    await waitFor(() => {
      expect(screen.getByLabelText(/OIB:/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Ime:"), { target: { value: "John Updated" } });
    fireEvent.change(screen.getByLabelText(/Prezime:/i), { target: { value: "Doe Updated" } });

    fireEvent.click(screen.getByRole("button", { name: /Izmijeni/i }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(`http://localhost:3000/azuriranje-stanara/1`, { ...mockData, ime: "John Updated", prezime: "Doe Updated" }, { headers: { Authorization: "Bearer " + validToken } });
    });

    expect(axios.put).toHaveBeenCalled();
    // Verify the alert was called with the correct message
    expect(window.alert).toHaveBeenCalledWith("Podaci uspješno izmjenjeni!");
  });
});
