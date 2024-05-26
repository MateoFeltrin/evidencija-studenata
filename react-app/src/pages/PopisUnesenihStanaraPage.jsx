import CollapsableNavbar from "../components/CollapsableNavbar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const PopisUnesenihStanaraPage = () => {
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
      const response = await axios.get("http://localhost:3000/api/sviupisani-stanari", {
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

  const handleDelete = (oib) => {
    const isConfirmed = window.confirm("Želite li zaista obrisati stanara?");
    if (isConfirmed) {
      axios
        .delete(`http://localhost:3000/brisanje-stanara/${oib}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        })
        .then(() => {
          setData(data.filter((student) => student.oib !== oib));
          alert("Stanar uspješno obrisan!");
        })
        .catch((err) => {
          console.log(err);
          alert("Došlo je do pogreške prilikom brisanja, provjerite nalazi li se stanar u tablici boravci! ", err.message);
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
          <h1>Tablica svih unesenih stanara</h1>
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
                  <th scope="col">Domski email</th>
                  <th scope="col">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {data.map((student) => (
                  <tr key={student.oib}>
                    <td className="table-data">{student.oib}</td>
                    <td className="table-data">{student.jmbag}</td>
                    <td className="table-data">{student.ime}</td>
                    <td className="table-data">{student.prezime}</td>
                    <td className="table-data">{formatDate(student.datum_rodenja)}</td>
                    <td className="table-data">{student.adresa_prebivalista}</td>
                    <td className="table-data">{student.subvencioniranost ? "Da" : "Ne"}</td>
                    <td className="table-data">{student.uciliste}</td>
                    <td className="table-data">{student.uplata_teretane ? "Da" : "Ne"}</td>
                    <td className="table-data">{student.komentar}</td>
                    <td className="table-data">{student.korisnik ? student.korisnik.email_korisnika : "N/A"}</td>
                    {/*Dodani radi testa, da se handla ako je undefined */}
                    <td className="table-data">
                      <Link to={`/izmjenaStanara/${student.oib}`} className="btn btn-sm btn-primary">
                        Izmijeni
                      </Link>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(student.oib)}>
                        Izbriši
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

export default PopisUnesenihStanaraPage;
