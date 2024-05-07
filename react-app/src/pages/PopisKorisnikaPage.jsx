import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import CollapsableNavbar from "../components/CollapsableNavbar";
import { useNavigate } from "react-router-dom";

const PopisKorisnikaPage = () => {
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);

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
              .get("http://localhost:3000/api/svi-radnici", {
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
          axios
            .get("http://localhost:3000/api/svi-radnici", {
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

  return (
    <div className="container-fluid">
      <CollapsableNavbar />
      <h1>Popis radnika</h1>
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
      </div>
    </div>
  );
};

export default PopisKorisnikaPage;
