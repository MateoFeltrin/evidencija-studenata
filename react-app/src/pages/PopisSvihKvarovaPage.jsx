import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CollapsableNavbar from "../components/CollapsableNavbar";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const PopisSvihKvarovaPage = () => {
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Format the date using date-fns
  const formatDate = (dateString) => {
    if (dateString != null) {
      return format(new Date(dateString), "dd.MM.yyyy.");
    }
    return null;
  };

  useEffect(() => {
    if (token) {
      // Send a request to the backend server to verify the token and check the user's role
      axios
        .get("http://localhost:3000/verify-token?roles=admin,domar", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        })
        .then((response) => {
          // If the response status is 200, proceed with fetching the data
          if (response.status === 200) {
            axios
              .get("http://localhost:3000/api/svi-kvarovi", {
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

  const handleDelete = (id_kvara) => {
    const isConfirmed = window.confirm("Želite li zaista obrisati kvar?");
    if (isConfirmed) {
      console.log("Broj objekta to delete:", id_kvara);
      axios
        .delete(`http://localhost:3000/brisanje-kvara/${id_kvara}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        })
        .then(() => {
          axios
            .get("http://localhost:3000/api/svi-kvarovi", {
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

  const filteredData = data.filter((kvar) =>
    (kvar.id_kvara.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    (kvar.stanar && kvar.stanar.ime && kvar.stanar.ime.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (kvar.stanar && kvar.stanar.prezime && kvar.stanar.prezime.toLowerCase().includes(searchTerm.toLowerCase())) ||
    kvar.opis_kvara.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (kvar.korisnik && kvar.korisnik.email_korisnika && kvar.korisnik.email_korisnika.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <CollapsableNavbar />
      <div className="container-fluid">
        <div className="container mt-4">
          <h1>Popis svih kvarova</h1>
          <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Pretraži"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
          <Link to="/unosKvarova" className="btn btn-sm btn-primary mb-3">
            Dodaj kvar
          </Link>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">ID kvara</th>
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
                {filteredData.map((kvar) => (
                  <tr key={kvar.id_kvara}>
                    <td className="table-data">{kvar.id_kvara}</td>
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
        </div>
      </div>
    </div>
  );
};

export default PopisSvihKvarovaPage;
