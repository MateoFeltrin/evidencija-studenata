import { Link } from 'react-router-dom';
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
    <div className="container-fluid">
      <CollapsableNavbar />
      <div className="container mt-4">
        <h1>Popis soba</h1>
        <Link to="/unosSoba" className="btn btn-sm btn-primary mb-3">
      Dodaj sobu
    </Link>
        <div className="table-responsive">
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
      </div>
    </div>
  );
};

export default PopisSobaPage;
