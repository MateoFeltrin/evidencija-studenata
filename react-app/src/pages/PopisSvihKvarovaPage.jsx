import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import CollapsableNavbar from "../components/CollapsableNavbar";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const PopisSvihKvarovaPage = () => {
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
      const response = await axios.get("http://localhost:3000/api/svi-kvarovi", {
        params: {
          page,
          limit,
          search,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);

      const { kvarovi, totalPages } = response.data;

      setData(kvarovi);

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

  const handleDelete = (id_kvara) => {
    const isConfirmed = window.confirm("Želite li zaista obrisati kvar?");
    if (isConfirmed) {
      axios
        .delete(`http://localhost:3000/brisanje-kvara/${id_kvara}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        })
        .then(() => {
          fetchData(currentPage);
        })
        .catch((err) => {
          console.log(err);
          alert("Došlo je do pogreške prilikom brisanja!", err.message);
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
        <div className="container mt-4">
          <h1>Popis svih kvarova</h1>
          <div class="input-group mb-3">
            <input type="text" className="form-control" placeholder="Pretraži" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
            <button className="btn btn-outline-secondary" type="button" id="button-addon1" onClick={handleSearch}>
              Pretraži
            </button>
          </div>
          <Link to="/unosKvarova" className="btn btn-sm btn-primary mb-3">
            Dodaj kvar
          </Link>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">ID kvara</th>
                  <th scope="col">Stanje kvara</th>
                  <th scope="col">Datum prijave</th>
                  <th scope="col">Opis</th>
                  <th scope="col">Soba</th>
                  <th scope="col">Objekt</th>
                  <th scope="col">Ime stanara</th>
                  <th scope="col">Prezime stanara</th>
                  <th scope="col">Domar</th>
                  <th scope="col">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {data.map((kvar) => (
                  <tr key={kvar.id_kvara}>
                    <td className="table-data">{kvar.id_kvara}</td>
                    <td className="table-data">{kvar.stanje_kvara ? "Popravljen" : "Nije popravljen"}</td>
                    <td className="table-data">{formatDate(kvar.datum_prijave_kvara)}</td>
                    <td className="table-data">{kvar.opis_kvara}</td>
                    <td className="table-data">{kvar.soba.broj_sobe}</td>
                    <td className="table-data">{kvar.soba.broj_objekta}</td>
                    <td className="table-data">{kvar.stanar ? kvar.stanar.ime || "Neodređen" : "Neodređen"}</td>
                    <td className="table-data">{kvar.stanar ? kvar.stanar.prezime || "Neodređen" : "Neodređen"}</td>
                    <td className="table-data">{kvar.korisnik ? kvar.korisnik.email_korisnika || "Neodređen" : "Neodređen"}</td>
                    <td className="table-data">
                      <Link to={`/izmjenaKvarova/${kvar.id_kvara}`} className="btn btn-sm btn-primary">
                        Izmijeni
                      </Link>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(kvar.id_kvara)}>
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

export default PopisSvihKvarovaPage;
