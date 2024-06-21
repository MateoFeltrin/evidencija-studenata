import CollapsableNavbar from "../components/CollapsableNavbar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const PopisSvihStanaraPage = () => {
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState(""); // State to store input value
  const [search, setSearch] = useState(""); // State to store search term
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10; // Number of records per page

  const navigate = useNavigate();

  // Format the date using date-fns
  const formatDate = (dateString) => {
    if (dateString != null) {
      return format(new Date(dateString), "dd.MM.yyyy.");
    }
    return null;
  };

  const fetchData = async (page) => {
    try {
      const response = await axios.get("http://localhost:3000/api/trenutni-stanari", {
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
  }, [currentPage, search, navigate]);

  const handleIseljenje = (id_boravka) => {
    const isConfirmed = window.confirm("Želite li zaista iseliti stanara?");
    if (isConfirmed) {
      axios
        .put(
          `http://localhost:3000/iseljenje/${id_boravka}`,
          {
            datum_iseljenja: new Date(), // Set move-out date to current date
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
            },
          }
        )
        .then(() => {
          alert("Stanar uspješno iseljen!");
          // Fetch data after successful move-out
          fetchData(currentPage); // Fetch data using the existing function
        })
        .catch((error) => {
          console.error("Error updating move-out date:", error);
        });
    }
  };

  // Function to handle search when the button is clicked
  const handleSearch = () => {
    setSearch(searchInput); // Set search term from input value
    setCurrentPage(1); // Reset current page to 1 when performing a new search
  };

  return (
    <div>
      <CollapsableNavbar />
      <div className="container-fluid">
        <div className="mt-4">
          <h1>Tablica trenutačnih stanara</h1>
          <div class="input-group mb-3">
            <input type="text" className="form-control" placeholder="Pretraži" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
            <button className="btn btn-outline-secondary" type="button" id="button-addon1" onClick={handleSearch}>
              Pretraži
            </button>
          </div>
          <Link to="/UnosStanara" className="btn btn-sm btn-primary mb-3">
            Dodaj novog stanara
          </Link>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">OIB</th>
                  <th scope="col">JMBAG</th>
                  <th scope="col">Ime</th>
                  <th scope="col">Prezime</th>
                  <th scope="col">Datum rođenja</th>
                  <th scope="col">Adresa prebivališta</th>
                  <th scope="col">Subvencioniranost</th>
                  <th scope="col">Učilište</th>
                  <th scope="col">Uplata teretane</th>
                  <th scope="col">Komentar</th>
                  <th scope="col">Datum useljenja</th>
                  <th scope="col">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) &&
                  data.map((student) => (
                    <tr key={student.oib}>
                      <td className="table-data">{student.oib}</td>
                      <td className="table-data">{student.stanar.jmbag}</td>
                      <td className="table-data">{student.stanar.ime}</td>
                      <td className="table-data">{student.stanar.prezime}</td>
                      <td className="table-data">{formatDate(student.stanar.datum_rodenja)}</td>
                      <td className="table-data">{student.stanar.adresa_prebivalista}</td>
                      {/* Display 'Da' for true and 'Ne' for false for subvencioniranost */}
                      <td className="table-data">{student.stanar.subvencioniranost ? "Da" : "Ne"}</td>
                      <td className="table-data">{student.stanar.uciliste}</td>
                      {/* Display 'Da' for true and 'Ne' for false for uplata_teretane */}
                      <td className="table-data">{student.stanar.uplata_teretane ? "Da" : "Ne"}</td>
                      <td className="table-data">{student.stanar.komentar}</td>
                      <td className="table-data">{formatDate(student.datum_useljenja)}</td>
                      <td className="table-data">
                        <Link to={`/izmjenaStanara/${student.oib}`} className="btn btn-sm btn-primary">
                          Izmijeni
                        </Link>
                        <button className="btn btn-sm btn-secondary" onClick={() => handleIseljenje(student.id_boravka)}>
                          Iseljenje
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
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

export default PopisSvihStanaraPage;
