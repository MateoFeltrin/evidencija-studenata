import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import CollapsableNavbar from "../components/CollapsableNavbar";
import { useNavigate } from "react-router-dom";

const PopisAktivnihKvarovaPage = () => {
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch token from local storage
    const token = localStorage.getItem("token");

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
              .get("http://localhost:3000/api/aktivni-kvarovi")
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
        .delete(`http://localhost:3000/brisanje-kvara/${id_kvara}`)
        .then(() => {
          axios
            .get("http://localhost:3000/api/aktivni-kvarovi")
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
      <h1 className="mt-4">Popis aktivnih kvarova</h1>
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
              <th scope="col">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {data.map((kvar) => (
              <tr key={kvar.id_kvara}>
                <td className="table-data">{kvar.id_kvara}</td>
                <td className="table-data">{kvar.datum_prijave_kvara}</td>
                <td className="table-data">{kvar.opis_kvara}</td>
                <td className="table-data">{kvar.soba.broj_sobe}</td>
                <td className="table-data">{kvar.soba.broj_objekta}</td>
                <td className="table-data">{kvar.stanar.ime}</td>
                <td className="table-data">{kvar.stanar.prezime}</td>
                <td className="table-data">
                  <button className="btn btn-sm btn-primary" onClick={() => handleChange(index)}>
                    Izmijeni
                  </button>
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
  );
};

export default PopisAktivnihKvarovaPage;
