import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import CollapsableNavbar from "../components/CollapsableNavbar";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const PopisBoravakaPage = () => {
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
      const response = await axios.get("http://localhost:3000/api/svi-boravci", {
        params: {
          page,
          limit,
          search,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { boravci, totalPages } = response.data;

      setData(boravci);
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

  const handleDelete = (id_boravka) => {
    const isConfirmed = window.confirm("Želite li zaista obrisati boravak?");
    if (isConfirmed) {
      console.log("Broj boravka to delete:", id_boravka);
      axios
        .delete(`http://localhost:3000/brisanje-boravka/${id_boravka}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          axios
            .get("http://localhost:3000/api/svi-boravci", {
              headers: {
                Authorization: `Bearer ${token}`, // Include the token in the headers
              },
            })
            .then((res) => setData(res.data))
            .catch((err) => console.log(err));
        })
        .catch((err) => {
          console.log(err);
          alert("Došlo je do pogreške prilikom brisanja!", err.message);
        });
    }
  };

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
        <h1>Popis boravaka</h1>
        <div class="input-group mb-3">
          <input type="text" className="form-control" placeholder="Pretraži" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          <button className="btn btn-outline-secondary" type="button" id="button-addon1" onClick={handleSearch}>
            Pretraži
          </button>
        </div>
        <Link to="/unosBoravka" className="btn btn-sm btn-primary mb-3">
          Dodaj boravak
        </Link>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">OIB</th>
                <th scope="col">Ime stanara</th>
                <th scope="col">Prezime stanara</th>
                <th scope="col">Datum Useljenja</th>
                <th scope="col">Datum Iseljenja</th>
                <th scope="col">Broj Objekta</th>
                <th scope="col">Broj sobe</th>
                <th scope="col">Broj Kreveta</th>
                <th scope="col">Korisnik</th>
                <th scope="col">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) &&
                data.map((boravak) => (
                  <tr key={boravak.id_boravka}>
                    <td className="table-data">{boravak.stanar.oib}</td>
                    <td className="table-data">{boravak.stanar.ime}</td>
                    <td className="table-data">{boravak.stanar.prezime}</td>
                    <td className="table-data">{formatDate(boravak.datum_useljenja)}</td>
                    <td className="table-data">{formatDate(boravak.datum_iseljenja)}</td>
                    <td className="table-data">{boravak.krevet.soba.broj_objekta}</td>
                    <td className="table-data">{boravak.krevet.soba.broj_sobe}</td>
                    <td className="table-data">{boravak.krevet.broj_kreveta}</td>
                    <td className="table-data">{boravak.korisnik.email_korisnika}</td>
                    <td className="table-data">
                      <Link to={`/izmjenaBoravka/${boravak.id_boravka}?broj_objekta=${boravak.krevet.soba.broj_objekta}&broj_sobe=${boravak.krevet.soba.broj_sobe}&broj_kreveta=${boravak.krevet.broj_kreveta}&oib=${boravak.stanar.oib}`} className="btn btn-sm btn-primary">
                        Izmijeni
                      </Link>

                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(boravak.id_boravka)}>
                        Izbriši
                      </button>
                      {boravak.datum_iseljenja === null && (
                        <button className="btn btn-sm btn-secondary" onClick={() => handleIseljenje(boravak.id_boravka)}>
                          Iseljenje
                        </button>
                      )}
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

export default PopisBoravakaPage;
