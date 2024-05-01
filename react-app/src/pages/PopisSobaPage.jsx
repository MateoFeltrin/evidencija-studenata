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

  const handleDelete = (id_sobe) => {
    const isConfirmed = window.confirm("Želite li zaista obrisati objekt?");
    if (isConfirmed) {
      console.log("Broj objekta to delete:", id_sobe);
      axios
        .delete(`http://localhost:3000/brisanje-sobe/${id_sobe}`)
        .then(() => {
          axios
            .get("http://localhost:3000/api/sve-sobe")
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
              {data.map((soba) => (
                <tr key={soba.id_sobe}>
                  <td className="table-data">{soba.id_sobe}</td>
                  <td className="table-data">{soba.broj_objekta}</td>
                  <td className="table-data">{soba.kat_sobe}</td>
                  <td className="table-data">{soba.broj_sobe}</td>
                  <td className="table-data">
                  <Link to={`/izmjenaSoba/${soba.id_sobe}`} className="btn btn-sm btn-primary">Izmijeni</Link>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(soba.id_sobe)}>Izbriši</button>
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
