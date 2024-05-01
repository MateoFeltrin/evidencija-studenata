import { Link } from 'react-router-dom';
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CollapsableNavbar from "../components/CollapsableNavbar";

const PopisSvihKvarovaPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/svi-kvarovi")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id_kvara) => {
    const isConfirmed = window.confirm("Želite li zaista obrisati kvar?");
    if (isConfirmed) {
      console.log("Broj objekta to delete:", id_kvara);
      axios
        .delete(`http://localhost:3000/brisanje-kvara/${id_kvara}`)
        .then(() => {
          axios
            .get("http://localhost:3000/api/svi-kvarovi")
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
        <h1>Popis svih kvarova</h1>
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
              {data.map((kvar) => (
                <tr key={kvar.id_kvara}>
                  <td className="table-data">{kvar.id_kvara}</td>
                  <td className="table-data">{kvar.datum_prijave_kvara}</td>
                  <td className="table-data">{kvar.opis_kvara}</td>
                  <td className="table-data">{kvar.broj_sobe}</td>
                  <td className="table-data">{kvar.broj_objekta}</td>
                  <td className="table-data">{kvar.ime}</td>
                  <td className="table-data">{kvar.prezime}</td>
                  <td className="table-data">{kvar.email_korisnika}</td>
                  <td className="table-data">
                    <button className="btn btn-sm btn-primary" onClick={() => handleChange(index)}>Izmijeni</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(kvar.id_kvara)}>Izbriši</button>
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

export default PopisSvihKvarovaPage;
