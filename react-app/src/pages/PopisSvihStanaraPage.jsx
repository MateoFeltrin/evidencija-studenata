import CollapsableNavbar from "../components/CollapsableNavbar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const PopisSvihStanaraPage = () => {
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
              .get("http://localhost:3000/api/trenutni-stanari", {
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

  const handleDelete = (oib) => {
    const isConfirmed = window.confirm("Želite li zaista obrisati stanara?");
    if (isConfirmed) {
      axios
        .delete(`http://localhost:3000/brisanje-stanara/${oib}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        })
        .then(() => {
          axios
            .get("http://localhost:3000/api/trenutni-stanari", {
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
          // Fetch data after successful move-out
          axios
            .get("http://localhost:3000/api/trenutni-stanari", {
              headers: {
                Authorization: `Bearer ${token}`, // Include the token in the headers
              },
            })
            .then((res) => setData(res.data))
            .catch((err) => console.log(err));
        })
        .catch((error) => {
          console.error("Error updating move-out date:", error);
        });
    }
  };
  return (
    <div>
      <CollapsableNavbar />
      <div className="container-fluid">
        <div className="mt-4">
          <h1>Tablica trenutačnih stanara</h1>
          <Link to="/UnosStanara" className="btn btn-sm btn-primary mb-3">
            Dodaj novog stanara
          </Link>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">OIB</th>
                  <th scope="col">JMBAG</th>
                  <th scope="col">Ime</th>
                  <th scope="col">Prezime</th>
                  <th scope="col">Datum rođenja</th>
                  <th scope="col">Adresa prebivališta</th>
                  <th scope="col">Subvencioniranost</th>
                  <th scope="col">Učilište</th>
                  <th scope="col">Uplata teretane</th>
                  <th scope="col">Komentar</th>
                  <th scope="col">Datum useljenja</th>
                  <th scope="col">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {data.map((student) => (
                  <tr key={student.oib}>
                    <td className="table-data">{student.oib}</td>
                    <td className="table-data">{student.stanar.jmbag}</td>
                    <td className="table-data">{student.stanar.ime}</td>
                    <td className="table-data">{student.stanar.prezime}</td>
                    <td className="table-data">{formatDate(student.stanar.datum_rodenja)}</td>
                    <td className="table-data">{student.stanar.adresa_prebivalista}</td>
                    {/* Display 'Da' for true and 'Ne' for false for subvencioniranost */}
                    <td className="table-data">{student.stanar.subvencioniranost ? "Da" : "Ne"}</td>
                    <td className="table-data">{student.stanar.uciliste}</td>
                    {/* Display 'Da' for true and 'Ne' for false for uplata_teretane */}
                    <td className="table-data">{student.stanar.uplata_teretane ? "Da" : "Ne"}</td>
                    <td className="table-data">{student.stanar.komentar}</td>
                    <td className="table-data">{formatDate(student.datum_useljenja)}</td>
                    <td className="table-data">
                      <Link to={`/izmjenaStanara/${student.oib}`} className="btn btn-sm btn-primary">
                        Izmijeni
                      </Link>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(student.oib)}>
                        Izbriši
                      </button>
                      <button className="btn btn-sm btn-secondary" onClick={() => handleIseljenje(student.id_boravka)}>
                        Iseljenje
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

export default PopisSvihStanaraPage;
