/* 
Za importanje ikona otic ovdje https://react-icons.github.io/react-icons/search/#q= 

Stranica za izmjenu podataka stanara
*/
import { FaPenAlt } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import { TbDoorEnter } from "react-icons/tb";
import { TbDoorExit } from "react-icons/tb";
import { IoIosLogIn } from "react-icons/io";
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

  return (
    <div>
      <CollapsableNavbar />
      <h1>Popis svih kvarova</h1>
      <button className="btn btn-sm btn-primary" onClick={() => handleChange(index)}>Dodaj kvar</button>
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
    {data.map((kvar, id_kvara) => (
      <tr key={id_kvara}>
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
          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(index)}>Izbriši</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
};

export default PopisSvihKvarovaPage;
