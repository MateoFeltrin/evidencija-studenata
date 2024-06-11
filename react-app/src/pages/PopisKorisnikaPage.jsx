import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import CollapsableNavbar from "../components/CollapsableNavbar";
import { useNavigate } from "react-router-dom";

const PopisKorisnikaPage = () => {
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState(""); // State to store input value
  const [search, setSearch] = useState(""); // State to store search term
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10; // Number of records per page

  const navigate = useNavigate();

  const fetchData = async (page) => {
    try {
      const response = await axios.get("http://localhost:3000/api/svi-korisnici", {
        params: {
          page,
          limit,
          search,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { korisnici, totalPages } = response.data;

      setData(korisnici);
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

  const handleDelete = (id_korisnika) => {
    const isConfirmed = window.confirm("Želite li zaista obrisati korisnika?");
    if (isConfirmed) {
      console.log("Broj objekta to delete:", id_korisnika);
      axios
        .delete(`http://localhost:3000/brisanje-korisnika/${id_korisnika}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        })
        .then(() => {
          alert("Korisnik izbrisan!");
          fetchData(currentPage);
        })
        .catch((err) => {
          console.log(err);
          alert("Došlo je do pogreške prilikom brisanja korisnika, Korisnik ima prijavljene ili popravljene kvarova!", err.message);
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
        <h1>Popis korisnika</h1>
        <div class="input-group mb-3">
          <input type="text" className="form-control" placeholder="Pretraži" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          <button className="btn btn-outline-secondary" type="button" id="button-addon1" onClick={handleSearch}>
            Pretraži
          </button>
        </div>
        <Link to="/unosRadnika" className="btn btn-sm btn-primary mb-3">
          Dodaj radnika
        </Link>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">ID Korisnika</th>
                <th scope="col">Email</th>
                <th scope="col">Lozinka</th>
                <th scope="col">Uloga</th>
                <th scope="col">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {data.map((radnik) => (
                <tr key={radnik.id_korisnika}>
                  <td className="table-data">{radnik.id_korisnika}</td>
                  <td className="table-data">{radnik.email_korisnika}</td>
                  <td className="table-data">{radnik.lozinka}</td>
                  <td className="table-data">{radnik.uloga}</td>
                  <td className="table-data">
                    <Link to={`/izmjenaRadnika/${radnik.id_korisnika}`} className="btn btn-sm btn-primary">
                      Izmijeni
                    </Link>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(radnik.id_korisnika)}>
                      Izbriši
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default PopisKorisnikaPage;
