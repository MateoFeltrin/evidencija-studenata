import { FaPenAlt } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import { TbDoorEnter } from "react-icons/tb";
import { TbDoorExit } from "react-icons/tb";
import { IoIosLogIn } from "react-icons/io";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CollapsableNavbar from "../components/CollapsableNavbar";

const PopisKrevetaPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/svi-kreveti")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container-fluid">
      <CollapsableNavbar />
      <div className="container mt-4">
        <h1>Popis kreveta</h1>
        <button className="btn btn-sm btn-primary mb-3" onClick={() => handleChange(index)}>Dodaj krevet</button>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Id kreveta</th>
                <th scope="col">Broj objekta</th>
                <th scope="col">Broj sobe</th>
                <th scope="col">Broj kreveta</th>
                <th scope="col">Zauzetost</th>
                <th scope="col">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {data.map((krevet, id_kreveta) => (
                <tr key={id_kreveta}>
                  <td className="table-data">{krevet.id_kreveta}</td>
                  <td className="table-data">{krevet.broj_objekta}</td>
                  <td className="table-data">{krevet.broj_sobe}</td>
                  <td className="table-data">{krevet.broj_kreveta}</td>
                  <td className="table-data">{krevet.zauzetost}</td>
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
    </div>
  );
};

export default PopisKrevetaPage;
