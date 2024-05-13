import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import CollapsableNavbar from "../components/CollapsableNavbar";
import { useNavigate } from "react-router-dom";

const PopisKrevetaPage = () => {
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
      const response = await axios.get("http://localhost:3000/api/svi-kreveti", {
        params: {
          page,
          limit,
          search,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { kreveti, totalPages } = response.data;

      setData(kreveti);
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

  const handleDelete = async (id_kreveta) => {
    const isConfirmed = window.confirm("Želite li zaista obrisati krevet?");
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/brisanje-kreveta/${id_kreveta}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        fetchData(currentPage);
      } catch (error) {
        console.error("Error deleting room:", error);
        alert("Došlo je do pogreške prilikom brisanja, provjerite je li krevet vezan uz boravak trenutnog stanara!");
      }
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
          <h1>Popis kreveta</h1>
          <div class="input-group mb-3">
            <input type="text" className="form-control" placeholder="Pretraži" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
            <button className="btn btn-outline-secondary" type="button" id="button-addon1" onClick={handleSearch}>
              Pretraži
            </button>
          </div>
          <Link to="/unosKreveta" className="btn btn-sm btn-primary mb-3">
            Dodaj krevet
          </Link>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">Id kreveta</th>
                  <th scope="col">Broj objekta</th>
                  <th scope="col">Broj sobe</th>
                  <th scope="col">Broj kreveta</th>
                  <th scope="col">Zauzetost</th>
                  <th scope="col">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {data.map((krevet) => (
                  <tr key={krevet.id_kreveta}>
                    <td className="table-data">{krevet.id_kreveta}</td>
                    <td className="table-data">{krevet.soba.broj_objekta}</td>
                    <td className="table-data">{krevet.soba.broj_sobe}</td>
                    <td className="table-data">{krevet.broj_kreveta}</td>
                    <td className="table-data">{krevet.zauzetost ? "Da" : "Ne"}</td>
                    <td className="table-data">
                      <Link to={`/izmjenaKreveta/${krevet.id_kreveta}`} className="btn btn-sm btn-primary">
                        Izmijeni
                      </Link>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(krevet.id_kreveta)}>
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

export default PopisKrevetaPage;
