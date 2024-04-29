import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { IoArrowBackSharp } from "react-icons/io5";

import CollapsableNavbar from "../components/CollapsableNavbar";

const IzmjenaBoravkaPage = () => {
  const [idBoravka, setIdBoravka] = useState("");
  const [idKreveta, setIdKreveta] = useState("");
  const [oib, setOib] = useState("");
  const [idKorisnika, setIdKorisnika] = useState("");
  const [datumUseljenja, setDatumUseljenja] = useState("");
  const [datumIseljenja, setDatumIseljenja] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetch("your/api/endpoint")
      .then((response) => response.json())
      .then((data) => {
        setIdBoravka(data.id_boravka);
        setIdKreveta(data.id_kreveta);
        setOib(data.oib);
        setIdKorisnika(data.id_korisnika);
        setDatumUseljenja(data.datum_useljenja);
        setDatumIseljenja(data.datum_iseljenja);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="container-fluid">
      <CollapsableNavbar />
      <div className="container mt-4">
      <Link to="/popisBoravaka" className="btn btn-sm btn-danger mb-5">
      <IoArrowBackSharp />    
            </Link>
        <h2>Izmjena boravka</h2>
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="idBoravka" className="form-label">
                ID Boravka:
              </label>
              <input
                type="number"
                className="form-control"
                disabled
                id="idBoravka"
                value={idBoravka}
                onChange={(e) => setIdBoravka(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="idKreveta" className="form-label">
                Krevet:
              </label>
              <input
                type="number"
                className="form-control"
                id="idKreveta"
                value={idKreveta}
                onChange={(e) => setIdKreveta(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="oib" className="form-label">
                Stanar:
              </label>
              <input
                type="text"
                className="form-control"
                id="oib"
                value={oib}
                onChange={(e) => setOib(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="idKorisnika" className="form-label">
                Recepcioner:
              </label>
              <input
                type="number"
                className="form-control"
                disabled
                id="idKorisnika"
                value={idKorisnika}
                onChange={(e) => setIdKorisnika(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="datumUseljenja" className="form-label">
                Datum Useljenja:
              </label>
              <input
                type="date"
                className="form-control"
                id="datumUseljenja"
                value={datumUseljenja}
                onChange={(e) => setDatumUseljenja(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="datumIseljenja" className="form-label">
                Datum Iseljenja:
              </label>
              <input
                type="date"
                className="form-control"
                id="datumIseljenja"
                value={datumIseljenja}
                onChange={(e) => setDatumIseljenja(e.target.value)}
              />
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

export default IzmjenaBoravkaPage;
