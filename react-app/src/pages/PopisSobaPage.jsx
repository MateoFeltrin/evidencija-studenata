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

const PopisSobaPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/sve-sobe")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <CollapsableNavbar />
      <h1>Popis soba </h1>
      <button className="btn btn-sm btn-primary" onClick={() => handleChange(index)}>Dodaj sobu</button>
      <table className="table table-striped table-hover">
  <thead>
    <tr>
      <th scope="col">Id sobe</th>
      <th scope="col">Broj objekta</th>
      <th scope="col">Kat sobe</th>
      <th scope="col">Broj sobe</th>
      <th scope="col">Akcije</th>
    </tr>
  </thead>
  <tbody>
    {data.map((soba, id_sobe) => (
      <tr key={id_sobe}>
        <td className="table-data">{soba.id_sobe}</td>
        <td className="table-data">{soba.broj_objekta}</td>
        <td className="table-data">{soba.kat_sobe}</td>
        <td className="table-data">{soba.broj_sobe}</td>
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

export default PopisSobaPage;
