import { Link } from 'react-router-dom';
import axios from "axios";
import { useEffect, useState } from "react";
import CollapsableNavbar from "../components/CollapsableNavbar";

const PopisAktivnihKvarovaPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/aktivni-kvarovi")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

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
            {data.map((kvar, id_kvara) => (
              <tr key={id_kvara}>
                <td className="table-data">{kvar.id_kvara}</td>
                <td className="table-data">{kvar.datum_prijave_kvara}</td>
                <td className="table-data">{kvar.opis_kvara}</td>
                <td className="table-data">{kvar.broj_sobe}</td>
                <td className="table-data">{kvar.broj_objekta}</td>
                <td className="table-data">{kvar.ime}</td>
                <td className="table-data">{kvar.prezime}</td>
                <td className="table-data">
                  <button className="btn btn-sm btn-primary" onClick={() => handleChange(index)}>Izmijeni</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(index)}>Izbriši</button>
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
