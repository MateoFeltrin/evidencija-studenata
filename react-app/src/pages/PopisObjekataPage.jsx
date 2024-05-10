import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CollapsableNavbar from "../components/CollapsableNavbar";
import { useNavigate } from "react-router-dom";

const PopisObjekataPage = () => {
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // Send a request to the backend server to verify the token and check the user's role
      axios
        .get("http://localhost:3000/verify-token?roles=admin", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        })
        .then((response) => {
          // If the response status is 200, proceed with fetching the data
          if (response.status === 200) {
            axios
              .get("http://localhost:3000/api/svi-objekti", {
                headers: {
                  Authorization: `Bearer ${token}`, // Include the token in the headers
                },
              })
              .then((res) => setData(res.data))
              .catch((err) => console.log(err));
          } else {
            // If the user is not authorized, redirect to "/not-authorized" page
            navigate("/forbidden");
          }
        })
        .catch((error) => {
          // If there's an error (e.g., invalid token), redirect the user to the login page
          console.error("Error verifying token:", error);
          navigate("/forbidden");
        });
    } else {
      // If there's no token, redirect the user to the login page
      navigate("/prijava");
    }
  }, [navigate]);

  const handleDelete = (broj_objekta) => {
    const isConfirmed = window.confirm("Želite li zaista obrisati objekt?");
    if (isConfirmed) {
      console.log("Broj objekta to delete:", broj_objekta);
      axios
        .delete(`http://localhost:3000/brisanje-objekta/${broj_objekta}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        })
        .then(() => {
          axios
            .get("http://localhost:3000/api/svi-objekti", {
              headers: {
                Authorization: `Bearer ${token}`, // Include the token in the headers
              },
            })
            .then((res) => setData(res.data))
            .catch((err) => console.log(err));
        })
        .catch((err) => {
          console.log(err);
          alert("Došlo je do pogreške prilikom brisanja, uz objekt su vezane sobe!", err.message);
        });
    }
  };
  const filteredData = data.filter((objekt) =>
    objekt.broj_objekta.toString().toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  return (
    <div>
      <CollapsableNavbar />
      <div className="container-fluid">
        <div className="container mt-4">
          <h1>Popis objekata</h1>
          <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Pretraži po broju objekta"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
          <Link to="/unosObjekata" className="btn btn-sm btn-primary mb-3">
            Dodaj objekt
          </Link>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">Broj objekta</th>
                  <th scope="col">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((objekt) => (
                  <tr key={objekt.broj_objekta}>
                    <td className="table-data">{objekt.broj_objekta}</td>
                    <td className="table-data">
                      <Link to={`/izmjenaObjekata/${objekt.broj_objekta}`} className="btn btn-sm btn-primary">
                        Izmijeni
                      </Link>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(objekt.broj_objekta)}>
                        Izbriši
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopisObjekataPage;
