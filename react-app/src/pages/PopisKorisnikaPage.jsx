import { Link } from 'react-router-dom';
import axios from "axios";
import { useEffect, useState } from "react";
import CollapsableNavbar from "../components/CollapsableNavbar";

const PopisKorisnikaPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/svi-radnici")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id_korisnika) => {
    const isConfirmed = window.confirm("Želite li zaista obrisati objekt?");
    if (isConfirmed) {
      console.log("Broj objekta to delete:", id_korisnika);
      axios
        .delete(`http://localhost:3000/brisanje-korisnika/${id_korisnika}`)
        .then(() => {
          axios
            .get("http://localhost:3000/api/svi-radnici")
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
                <Link to={`/izmjenaRadnika/${radnik.id_korisnika}`} className="btn btn-sm btn-primary">Izmijeni</Link>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(radnik.id_korisnika)}>Izbriši</button>
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
