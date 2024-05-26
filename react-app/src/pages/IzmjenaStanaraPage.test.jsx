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
describe("IzmjenaStanaraPage", () => {
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

  test("saves token in local storage upon login", async () => {
    // Simulate successful login
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidWxvZ2EiOiJhZG1pbiIsImlhdCI6MTcxNTI3NjQ5NH0.3TnEpjg9HwamJIRk6GT6mdpVBdrbFE6lcCPSaf1gNig";
    localStorage.setItem("token", token);

    // Render component
    render(
      <MemoryRouter initialEntries={["/izmjena-stanara/1"]}>
        <Routes>
          <Route path="/izmjena-stanara/:id" element={<IzmjenaStanaraPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the async operations to complete
    await waitFor(() => {
      // Expect token to be in local storage
      expect(localStorage.getItem("token")).toBe(token);
    });
  });

  test("handles error during data fetching", async () => {
    // Mock Axios to return an error
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch data"));

    render(
      <MemoryRouter initialEntries={["/izmjena-stanara/1"]}>
        <Routes>
          <Route path="/izmjena-stanara/:id" element={<IzmjenaStanaraPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the async operations to complete
    await waitFor(() => {
      // Expect error message to be displayed
      expect(screen.getByText(/Error fetching data/i)).toBeInTheDocument();
    });
  });
});
