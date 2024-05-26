import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import PopisUnesenihStanaraPage from "./PopisUnesenihStanaraPage";
import { vi } from "vitest";

vi.mock("axios");

// Mock a valid JWT token
const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
/* Testira se učitavanje elemenata, search, paginacija i delete */
describe("PopisUnesenihStanaraPage", () => {
  beforeEach(() => {
    localStorage.setItem("token", validToken);
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("renders page elements correctly", () => {
    // Render the component
    render(
      <Router>
        <PopisUnesenihStanaraPage />
      </Router>
    );

    // Assertions for presence of essential elements
    expect(screen.getByText("Tablica svih unesenih stanara")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Pretraži")).toBeInTheDocument();
    expect(screen.getByText("Dodaj novog stanara")).toBeInTheDocument();
    // Add more assertions for other elements as needed
  });

  test("search functionality filters data correctly", async () => {
    // Mock user data
    const mockData = [
      {
        oib: "123",
        ime: "John",
        prezime: "Doe",
        datum_rodenja: "2000-01-01",
        adresa_prebivalista: "Some Address",
        subvencioniranost: true,
        uciliste: "Some School",
        uplata_teretane: true,
        komentar: "Test comment",
        korisnik: { email_korisnika: "john.doe@example.com" },
      },
      {
        oib: "1233",
        ime: "John1",
        prezime: "Doe1",
        datum_rodenja: "2000-01-01",
        adresa_prebivalista: "Some Address",
        subvencioniranost: true,
        uciliste: "Some School",
        uplata_teretane: false,
        komentar: "Test comment",
        korisnik: { email_korisnika: "john.doe1@example.com" },
      },
    ];
    axios.get.mockResolvedValue({ data: { stanari: mockData, totalPages: 1 } });

    // Render the component
    render(
      <Router>
        <PopisUnesenihStanaraPage />
      </Router>
    );

    // Simulate user input for search
    fireEvent.change(screen.getByPlaceholderText("Pretraži"), { target: { value: "John" } });

    // Wait for data fetching
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("http://localhost:3000/api/sviupisani-stanari", expect.any(Object));
    });

    // Check if data is correctly filtered
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.queryByText("Jane")).not.toBeInTheDocument(); // Ensure Jane is not present
  });

  test("pagination changes pages correctly", async () => {
    // Mock initial page data
    const initialMockData = [
      {
        oib: "123",
        ime: "John",
        prezime: "Doe",
        datum_rodenja: "2000-01-01",
        adresa_prebivalista: "Some Address",
        subvencioniranost: true,
        uciliste: "Some School",
        uplata_teretane: true,
        komentar: "Test comment",
        korisnik: { email_korisnika: "john.doe@example.com" },
      },
    ];

    // Mock second page data
    const secondPageMockData = [
      {
        oib: "456",
        ime: "Jane",
        prezime: "Smith",
        datum_rodenja: "1998-05-05",
        adresa_prebivalista: "Another Address",
        subvencioniranost: false,
        uciliste: "Another School",
        uplata_teretane: false,
        komentar: "Another test comment",
        korisnik: { email_korisnika: "jane.smith@example.com" },
      },
    ];

    axios.get.mockImplementation((url, { params }) => {
      if (params.page === 2) {
        return Promise.resolve({ data: { stanari: secondPageMockData, totalPages: 2 } });
      }
      return Promise.resolve({ data: { stanari: initialMockData, totalPages: 2 } });
    });

    // Render the component
    render(
      <Router>
        <PopisUnesenihStanaraPage />
      </Router>
    );

    // Wait for the initial data to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();
    });

    // Click next page
    fireEvent.click(screen.getByText("Next"));

    // Wait for the second page data fetching
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("http://localhost:3000/api/sviupisani-stanari", {
        params: {
          page: 2,
          limit: 10,
          search: "",
        },
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      });
    });

    // Wait for the new page data to be rendered
    await waitFor(() => {
      expect(screen.getByText("Jane")).toBeInTheDocument(); // Assuming Jane is on the second page
    });
  });

  test("deletes a user correctly", async () => {
    // Mock user data
    const mockData = [
      {
        oib: "123",
        ime: "John",
        prezime: "Doe",
        datum_rodenja: "2000-01-01",
        adresa_prebivalista: "Some Address",
        subvencioniranost: true,
        uciliste: "Some School",
        uplata_teretane: true,
        komentar: "Test comment",
        korisnik: { email_korisnika: "john.doe@example.com" },
      },
    ];

    // Mock axios get and delete methods
    axios.get.mockResolvedValue({ data: { stanari: mockData, totalPages: 1 } });
    axios.delete.mockResolvedValue({});

    // Mock confirmation dialog
    window.confirm = vi.fn(() => true);

    // Render the component
    render(
      <Router>
        <PopisUnesenihStanaraPage />
      </Router>
    );

    // Wait for the delete button to appear in the DOM
    const deleteButton = await waitFor(() => screen.getByText(/Izbriši/i));

    // Simulate delete action
    fireEvent.click(deleteButton);

    // Wait for delete API call
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith("http://localhost:3000/brisanje-stanara/123", { headers: { Authorization: "Bearer " + validToken } });
    });

    // Ensure user is removed from the UI
    expect(screen.queryByText("John")).not.toBeInTheDocument();
  });
});
