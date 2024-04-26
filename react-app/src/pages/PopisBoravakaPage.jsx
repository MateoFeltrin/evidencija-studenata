import { Link } from 'react-router-dom';
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CollapsableNavbar from "../components/CollapsableNavbar";

const PopisBoravakaPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/svi-boravci")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

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
            {data.map((boravak, id_boravka) => (
              <tr key={id_boravka}>
                <td className="table-data">{boravak.stanar.ime}</td>
                <td className="table-data">{boravak.stanar.prezime}</td>
                <td className="table-data">{boravak.datum_useljenja}</td>
                <td className="table-data">{boravak.datum_iseljenja}</td>
                <td className="table-data">{boravak.krevet.soba.broj_objekta}</td>
                <td className="table-data">{boravak.krevet.soba.broj_sobe}</td>
                <td className="table-data">{boravak.krevet.broj_kreveta}</td>
                <td className="table-data">{boravak.korisnik.email_korisnika}</td>
                <td className="table-data">
                  <button className="btn btn-sm btn-primary" onClick={() => handleChange(index)}>
                    Izmijeni
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(index)}>
                    Izbriši
                  </button>
                  <button className="btn btn-sm btn-secondary">Iseljenje </button>
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
