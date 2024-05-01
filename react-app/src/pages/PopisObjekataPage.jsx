import { Link } from 'react-router-dom';
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CollapsableNavbar from "../components/CollapsableNavbar";

const PopisObjekataPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/svi-objekti")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (broj_objekta) => {
    const isConfirmed = window.confirm("Želite li zaista obrisati objekt?");
    if (isConfirmed) {
      console.log("Broj objekta to delete:", broj_objekta);
      axios
        .delete(`http://localhost:3000/brisanje-objekta/${broj_objekta}`)
        .then(() => {
          axios
            .get("http://localhost:3000/api/svi-objekti")
            .then((res) => setData(res.data))
            .catch((err) => console.log(err));
        })
        .catch((err) => {
          console.log(err);
          alert('Došlo je do pogreške prilikom brisanja!', err.message);
        });
    }
  };

  return (
    <div className="container-fluid">
      <CollapsableNavbar />
      <div className="container mt-4">
        <h1>Popis objekata</h1>
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
              {data.map((objekt) => (
                <tr key={objekt.broj_objekta}>
                  <td className="table-data">{objekt.broj_objekta}</td>
                  <td className="table-data">
                  <Link to={`/izmjenaObjekata/${objekt.broj_objekta}`} className="btn btn-sm btn-primary">Izmijeni</Link>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(objekt.broj_objekta)}>Izbriši</button>
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

export default PopisObjekataPage;
