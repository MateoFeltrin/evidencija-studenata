import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CollapsableNavbar from "../components/CollapsableNavbar";
import { useNavigate } from "react-router-dom";
const PopisKrevetaPage = () => {
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch token from local storage
    const token = localStorage.getItem("token");

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
              .get("http://localhost:3000/api/svi-kreveti")
              .then((res) => setData(res.data))
              .catch((err) => console.log(err));
          } else {
            // If the user is not authorized, redirect to "/not-authorized" page
            navigate("/not-authorized");
          }
        })
        .catch((error) => {
          // If there's an error (e.g., invalid token), redirect the user to the login page
          console.error("Error verifying token:", error);
          navigate("/prijava");
        });
    } else {
      // If there's no token, redirect the user to the login page
      navigate("/prijava");
    }
  }, [navigate]);

  const handleDelete = (id_kreveta) => {
    const isConfirmed = window.confirm("Želite li zaista obrisati objekt?");
    if (isConfirmed) {
      console.log("Broj objekta to delete:", id_kreveta);
      axios
        .delete(`http://localhost:3000/brisanje-kreveta/${id_kreveta}`)
        .then(() => {
          axios
            .get("http://localhost:3000/api/svi-kreveti")
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
      <div className="container mt-4">
        <h1>Popis kreveta</h1>
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
                  <td className="table-data">{krevet.broj_objekta}</td>
                  <td className="table-data">{krevet.broj_sobe}</td>
                  <td className="table-data">{krevet.broj_kreveta}</td>
                  <td className="table-data">{krevet.zauzetost}</td>
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
      </div>
    </div>
  );
};

export default PopisKrevetaPage;
