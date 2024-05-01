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

  const handleDelete = (id_boravka) => {
    const isConfirmed = window.confirm("Želite li zaista obrisati objekt?");
    if (isConfirmed) {
      console.log("Broj objekta to delete:", id_boravka);
      axios
        .delete(`http://localhost:3000/brisanje-boravka/${id_boravka}`)
        .then(() => {
          axios
            .get("http://localhost:3000/api/svi-boravci")
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
                <td className="table-data">{boravak.ime}</td>
                <td className="table-data">{boravak.prezime}</td>
                <td className="table-data">{boravak.datum_useljenja}</td>
                <td className="table-data">{boravak.datum_iseljenja}</td>
                <td className="table-data">{boravak.broj_objekta}</td>
                <td className="table-data">{boravak.broj_sobe}</td>
                <td className="table-data">{boravak.broj_kreveta}</td>
                <td className="table-data">{boravak.email_korisnika}</td>
                <td className="table-data">
                <Link to={`/izmjenaBoravka/${boravak.id_boravka}`} className="btn btn-sm btn-primary">Izmijeni</Link>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(boravak.id_boravka)}>Izbriši</button>
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
