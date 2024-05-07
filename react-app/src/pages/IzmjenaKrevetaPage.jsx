import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import axios from "axios";

import CollapsableNavbar from "../components/CollapsableNavbar";

const IzmjenaKrevetaPage = () => {
  const token = localStorage.getItem("token");
  const { id_kreveta } = useParams();

  const [krevetData, setKrevetData] = useState({
    id_kreveta: "",
    broj_kreveta: "",
    id_sobe: "",
    zauzetost: false,
  });

  const [brojSobeOptions, setBrojSobeOptions] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/svi-kreveti1/${id_kreveta}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      })
      .then((res) => {
        const data = res.data;
        setKrevetData(data);
      })
      .catch((error) => console.error("Error fetching krevet data:", error));

    axios
      .get("http://localhost:3000/api/sve-sobe", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      })
      .then((res) => {
        const options = res.data.map((soba) => ({
          value: soba.id_sobe,
          label: soba.broj_sobe,
        }));
        setBrojSobeOptions(options);
        console.log("Broj sobe options:", options);
      })
      .catch((error) => console.error("Error fetching broj sobe options:", error));
  }, [id_kreveta]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:3000/azuriranje-kreveta/${id_kreveta}`, krevetData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      alert("Podaci uspješno izmjenjeni!");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setKrevetData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : newValue,
    }));
  };

  return (
    <div>
      <CollapsableNavbar />
      <div className="container-fluid">
        <div className="container mt-4">
          <Link to="/popisKreveta" className="btn btn-sm btn-danger mb-5">
            <IoArrowBackSharp />
          </Link>
          <h2>Izmjena kreveta</h2>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="id_kreveta" className="form-label">
                  ID Kreveta:
                </label>
                <input type="text" className="form-control" id="id_kreveta" name="id_kreveta" value={krevetData.id_kreveta} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="broj_kreveta" className="form-label">
                  Broj Kreveta:
                </label>
                <input type="number" className="form-control" id="broj_kreveta" name="broj_kreveta" value={krevetData.broj_kreveta} onChange={handleChange} />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="id_sobe" className="form-label">
                  Broj Sobe:
                </label>
                <select className="form-select" id="id_sobe" name="id_sobe" value={krevetData.id_sobe} onChange={handleChange}>
                  <option value="">Odaberi broj sobe</option>
                  {brojSobeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="zauzetost" name="zauzetost" checked={krevetData.zauzetost} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="zauzetost">
                    Zauzet
                  </label>
                </div>
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

export default IzmjenaKrevetaPage;
