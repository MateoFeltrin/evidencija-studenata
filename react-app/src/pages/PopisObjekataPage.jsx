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

const PopisObjekataPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/svi-objekti")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <CollapsableNavbar />
      <h1>Popis objekata </h1>
      <button className="btn btn-sm btn-primary" onClick={() => handleChange(index)}>Dodaj objekt</button>
      <table className="table table-striped table-hover">
  <thead>
    <tr>
      <th scope="col">Broj objekta</th>
      <th scope="col">Akcije</th>
    </tr>
  </thead>
  <tbody>
    {data.map((objekt, broj_objekta) => (
      <tr key={broj_objekta}>
        <td className="table-data">{objekt.broj_objekta}</td>
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

export default PopisObjekataPage;
