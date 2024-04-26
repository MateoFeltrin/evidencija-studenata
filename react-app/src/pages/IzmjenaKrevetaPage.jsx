import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import CollapsableNavbar from "../components/CollapsableNavbar";
import { IoArrowBackSharp } from "react-icons/io5";

const IzmjenaKrevetaPage = () => {
  const [idKreveta, setIdKreveta] = useState("");
  const [brojKreveta, setBrojKreveta] = useState("");
  const [idSobe, setIdSobe] = useState("");
  const [zauzetost, setZauzetost] = useState(false); // Default zauzetost as false

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    // Fetch existing values from the server/database
    fetch("your/api/endpoint")
      .then((response) => response.json())
      .then((data) => {
        setIdKreveta(data.id_kreveta);
        setBrojKreveta(data.broj_kreveta);
        setIdSobe(data.id_sobe);
        setZauzetost(data.zauzetost);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="container-fluid">
      <CollapsableNavbar />
      <div className="container mt-4">
      <Link to="/popisKreveta" className="btn btn-sm btn-danger mb-5">
      <IoArrowBackSharp />    
            </Link>
        <h2>Izmjena kreveta</h2>
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="idKreveta" className="form-label">
                ID Kreveta:
              </label>
              <input
                type="text"
                className="form-control"
                id="idKreveta"
                value={idKreveta}
                onChange={(e) => setIdKreveta(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="brojKreveta" className="form-label">
                Broj Kreveta:
              </label>
              <input
                type="number"
                className="form-control"
                id="brojKreveta"
                value={brojKreveta}
                onChange={(e) => setBrojKreveta(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="idSobe" className="form-label">
                Broj Sobe:
              </label>
              <input
                type="number"
                className="form-control"
                id="idSobe"
                value={idSobe}
                onChange={(e) => setIdSobe(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="zauzetost"
                  checked={zauzetost}
                  onChange={(e) => setZauzetost(e.target.checked)}
                />
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
  );
};

export default IzmjenaKrevetaPage;
