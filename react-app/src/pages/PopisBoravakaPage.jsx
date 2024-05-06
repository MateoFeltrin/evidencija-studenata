import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CollapsableNavbar from "../components/CollapsableNavbar";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const PopisBoravakaPage = () => {
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  // Format the date using date-fns
  const formatDate = (dateString) => {
    if (dateString != null) {
      return format(new Date(dateString), "dd.MM.yyyy.");
    }
    return null;
  };

  useEffect(() => {
    // Fetch token from local storage

    if (token) {
      // Send a request to the backend server to verify the token and check the user's role
      axios
        .get("http://localhost:3000/verify-token?roles=admin,recepcionar", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        })
        .then((response) => {
          // If the response status is 200, proceed with fetching the data
          if (response.status === 200) {
            axios
              .get("http://localhost:3000/api/svi-boravci", {
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

  const handleDelete = (id_boravka) => {
    const isConfirmed = window.confirm("Želite li zaista obrisati objekt?");
    if (isConfirmed) {
      console.log("Broj objekta to delete:", id_boravka);
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
          `http://localhost:3000/azuriranje-boravka/${id_boravka}`,
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
          // You may want to redirect the user or do other actions here
        })
        .catch((error) => {
          console.error("Error updating move-out date:", error);
        });
    }
  };

  return (
    <div className="container-fluid">
      <CollapsableNavbar />
      <h1>Popis boravaka</h1>
      <Link to="/unosBoravka" className="btn btn-sm btn-primary mb-3">
        Dodaj boravak
      </Link>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
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
            {data.map((boravak) => (
              <tr key={boravak.id_boravka}>
                <td className="table-data">{boravak.stanar.ime}</td>
                <td className="table-data">{boravak.stanar.prezime}</td>
                <td className="table-data">{formatDate(boravak.datum_useljenja)}</td>
                <td className="table-data">{formatDate(boravak.datum_iseljenja)}</td>
                <td className="table-data">{boravak.krevet.soba.broj_objekta}</td>
                <td className="table-data">{boravak.krevet.soba.broj_sobe}</td>
                <td className="table-data">{boravak.krevet.broj_kreveta}</td>
                <td className="table-data">{boravak.korisnik.email_korisnika}</td>
                <td className="table-data">
                  <Link to={`/izmjenaBoravka/${boravak.id_boravka}`} className="btn btn-sm btn-primary">
                    Izmijeni
                  </Link>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(boravak.id_boravka)}>
                    Izbriši
                  </button>
                  <button className="btn btn-sm btn-secondary" onClick={() => handleIseljenje(boravak.id_boravka)}>
                    Iseljenje
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

export default PopisBoravakaPage;
