import React, { useState, useEffect } from "react";
import CollapsableNavbar from "../components/CollapsableNavbar";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS file
import moment from "moment";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PopisVremenskogPerioda = () => {
  const token = localStorage.getItem("token");
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState(""); // State to store input value
  const [search, setSearch] = useState(""); // State to store search term
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10; // Number of records per page
  const navigate = useNavigate();

  const fetchData = async (page) => {
    try {
      const formattedStartDate = moment(selectionRange.startDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
      const formattedEndDate = moment(selectionRange.endDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
      const response = await axios.get(`http://localhost:3000/api/boravci-u-vremenskom-periodu/${formattedStartDate}/${formattedEndDate}`, {
        params: {
          page,
          limit,
          search,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { stanari, totalPages } = response.data;

      setData(stanari);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
      navigate("/forbidden");
    }
  };

  useEffect(() => {
    if (token) {
      fetchData(currentPage);
    } else {
      navigate("/prijava");
    }
  }, [currentPage, search, navigate, selectionRange]);

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };

  // Function to handle search when the button is clicked
  const handleSearch = () => {
    setSearch(searchInput); // Set search term from input value
    setCurrentPage(1); // Reset current page to 1 when performing a new search
  };

  return (
    <div>
      <CollapsableNavbar />
      <div className="container">
        <div className="row justify-content-center mt-4">
          <div className="col-md-8">
            <h2 className="text-center mb-4">Popis boravaka u određenom vremenskom periodu</h2>
            {/* Date range picker */}
            <DateRange editableDateInputs={true} onChange={handleSelect} moveRangeOnFirstSelection={false} ranges={[selectionRange]} />
            {/* Display boravci data */}
            <div class="input-group mb-3">
              <input type="text" className="form-control" placeholder="Pretraži" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
              <button className="btn btn-outline-secondary" type="button" id="button-addon1" onClick={handleSearch}>
                Pretraži
              </button>
            </div>
            <div className="mt-4">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>OIB</th>
                      <th>Ime</th>
                      <th>Prezime</th>
                      <th>Datum useljenja</th>
                      <th>Datum iseljenja</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data &&
                      data.map((boravak) => (
                        <tr key={boravak.id_boravka}>
                          <td>{boravak.oib}</td>
                          <td>{boravak.stanar.ime}</td>
                          <td>{boravak.stanar.prezime}</td>
                          <td>{new Date(boravak.datum_useljenja).toDateString()}</td>
                          <td>{boravak.datum_iseljenja ? new Date(boravak.datum_iseljenja).toDateString() : "/"}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <nav aria-label="Page navigation">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage((prev) => prev - 1)}>
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage((prev) => prev + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default PopisVremenskogPerioda;
