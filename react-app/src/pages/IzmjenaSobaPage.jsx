import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import axios from "axios";

import CollapsableNavbar from "../components/CollapsableNavbar";

const IzmjenaSobaPage = () => {
  const token = localStorage.getItem("token");
  const { id_sobe } = useParams();

  const [sobaData, setSobaData] = useState({
    id_sobe: "",
    broj_objekta: "",
    kat_sobe: "",
    broj_sobe: "",
  });

  const [brojObjektaOptions, setBrojObjektaOptions] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/sve-sobe1/${id_sobe}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      })
      .then((res) => {
        const data = res.data;
        setSobaData(data);
      })
      .catch((error) => console.error("Error fetching soba data:", error));

    axios
      .get("http://localhost:3000/api/svi-objekti-dropdown", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      })
      .then((res) => {
        const options = res.data.map((obj) => ({
          value: obj.broj_objekta,
          label: obj.broj_objekta,
        }));
        setBrojObjektaOptions(options);
        console.log("Broj objekta options:", options);
      })
      .catch((error) => console.error("Error fetching broj objekta options:", error));
  }, [id_sobe]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:3000/azuriranje-sobe/${sobaData.id_sobe}`, sobaData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      alert("Podaci uspješno izmjenjeni!");
      // Redirect to the page where you display all rooms after successful update
      // Example: history.push("/popisSoba");
    } catch (error) {
      alert("Greška pri izmjeni, pogledajte jesu li unesena sva polja!");
      console.error("Error updating data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSobaData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      <CollapsableNavbar />
      <div className="container-fluid">
        <div className="container mt-4">
          <Link to="/popisSoba" className="btn btn-sm btn-danger mb-5">
            <IoArrowBackSharp />
          </Link>
          <h2>Izmjena sobe</h2>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="id_sobe" className="form-label">
                  ID Sobe:
                </label>
                <input type="number" className="form-control" id="id_sobe" name="id_sobe" value={sobaData.id_sobe} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="broj_objekta" className="form-label">
                  Broj Objekta:
                </label>
                <select className="form-select" id="broj_objekta" name="broj_objekta" value={sobaData.broj_objekta} onChange={handleChange}>
                  <option value="">Odaberi broj objekta</option>
                  {brojObjektaOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="kat_sobe" className="form-label">
                  Kat Sobe:
                </label>
                <input type="number" className="form-control" id="kat_sobe" name="kat_sobe" value={sobaData.kat_sobe} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="broj_sobe" className="form-label">
                  Broj Sobe:
                </label>
                <input type="number" className="form-control" id="broj_sobe" name="broj_sobe" value={sobaData.broj_sobe} onChange={handleChange} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Izmijeni
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IzmjenaSobaPage;
