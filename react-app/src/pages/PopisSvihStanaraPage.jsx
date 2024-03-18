// Za importanje ikona otic ovdje https://react-icons.github.io/react-icons/search/#q=
import CollapsableNavbar from "../components/CollapsableNavbar";
import { useEffect, useState } from "react";
import axios from "axios";

const PopisSvihStanaraPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/all-stanar")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <CollapsableNavbar />
      <h1>Tablica trenutačnih stanara</h1>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">OIB</th>
            <th scope="col">JMBAG</th>
            <th scope="col">Ime</th>
            <th scope="col">Prezime</th>
            <th scope="col">datum_rodenja</th>
            <th scope="col">adresa_prebivalista</th>
            <th scope="col">subvencioniranost</th>
            <th scope="col">uciliste</th>
            <th scope="col">uplata_teretane</th>
            <th scope="col">komentar</th>
            <th scope="col">datum_useljenja</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PopisSvihStanaraPage;
