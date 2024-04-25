import { FaPenAlt } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import { TbDoorEnter } from "react-icons/tb";
import { TbDoorExit } from "react-icons/tb";
import { IoIosLogIn } from "react-icons/io";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CollapsableNavbar from "../components/CollapsableNavbar";

const PopisKorisnikaPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/svi-radnici")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (index) => {
    // Handle change logic
  };

  const handleDelete = (index) => {
    // Handle delete logic
  };

  return (
    <div className="container-fluid">
      <CollapsableNavbar />
      <h1>Popis radnika</h1>
      <button className="btn btn-sm btn-primary mb-3" onClick={() => handleChange(index)}>Dodaj radnika</button>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">ID Korisnika</th>
              <th scope="col">Email</th>
              <th scope="col">Lozinka</th>
              <th scope="col">Uloga</th>
              <th scope="col">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {data.map((radnik, index) => (
              <tr key={index}>
                <td className="table-data">{radnik.email_korisnika}</td>
                <td className="table-data">{radnik.email_korisnika}</td>
                <td className="table-data">{radnik.lozinka}</td>
                <td className="table-data">{radnik.uloga}</td>
                <td className="table-data">
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleChange(index)}>Izmijeni</button>
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

export default PopisKorisnikaPage;
