import CollapsableNavbar from "../components/CollapsableNavbar";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";

const PopisSvihStanaraPage = () => {
  const [data, setData] = useState([]);
  

  

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/trenutni-stanari")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container-fluid">
      <CollapsableNavbar />
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
              {data.map((student, oib) => (
                <tr key={oib}>
                  <td className="table-data">{student.oib}</td>
                  <td className="table-data">{student.jmbag}</td>
                  <td className="table-data">{student.ime}</td>
                  <td className="table-data">{student.prezime}</td>
                  <td className="table-data">{student.datum_rodenja}</td>
                  <td className="table-data">{student.adresa_prebivalista}</td>
                  <td className="table-data">{student.subvencioniranost}</td>
                  <td className="table-data">{student.uciliste}</td>
                  <td className="table-data">{student.uplata_teretane}</td>
                  <td className="table-data">{student.komentar}</td>
                  <td className="table-data">{student.datum_useljenja}</td>
                  <td className="table-data">
                    <button className="btn btn-sm btn-primary" onClick={() => handleChange(index)}>Izmijeni</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(index)}>Izbriši</button>
                    <button className="btn btn-sm btn-secondary">Iseljenje </button>
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

export default PopisSvihStanaraPage;
