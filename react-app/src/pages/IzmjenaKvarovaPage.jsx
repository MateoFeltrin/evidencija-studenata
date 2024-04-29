import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { IoArrowBackSharp } from "react-icons/io5";

import CollapsableNavbar from "../components/CollapsableNavbar";

const IzmjenaKvarovaPage = () => {
  // State variables to manage form inputs
  const [idKvara, setIdKvara] = useState("");
  const [datumPrijave, setDatumPrijave] = useState("");
  const [opisKvara, setOpisKvara] = useState("");
  const [stanjeKvara, setStanjeKvara] = useState(false); // Default state for checkbox
  const [idSobe, setIdSobe] = useState("");
  const [idKorisnika, setIdKorisnika] = useState("");
  const [oib, setOib] = useState("");

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Code to handle form submission (e.g., send data to server)
    // You can access form values via state variables
  };

  useEffect(() => {
    // Fetch existing values from the server/database
    fetch("your/api/endpoint")
      .then((response) => response.json())
      .then((data) => {
        setIdKvara(data.id_kvara);
        setDatumPrijave(data.datum_prijave_kvara);
        setOpisKvara(data.opis_kvara);
        setStanjeKvara(data.stanje_kvara);
        setIdSobe(data.id_sobe);
        setIdKorisnika(data.id_korisnika);
        setOib(data.oib);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="container-fluid">
      <CollapsableNavbar />
      <div className="container mt-4">
      <Link to="/popisAktivnihKvarova" className="btn btn-sm btn-danger mb-5">
      <IoArrowBackSharp />    
            </Link>
        <h2>Izmjena kvarova</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="idKvara" className="form-label">
                ID Kvara:
              </label>
              <input
                type="text"
                className="form-control"
                disabled
                id="idKvara"
                value={idKvara}
                onChange={(e) => setIdKvara(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="datumPrijave" className="form-label">
                Datum Prijave:
              </label>
              <input
                type="date"
                className="form-control"
                id="datumPrijave"
                value={datumPrijave}
                onChange={(e) => setDatumPrijave(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="opisKvara" className="form-label">
                Opis Kvara:
              </label>
              <input
                type="text"
                className="form-control"
                id="opisKvara"
                value={opisKvara}
                onChange={(e) => setOpisKvara(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="stanjeKvara" className="form-label">
                Stanje Kvara:
              </label>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="stanjeKvara"
                  checked={stanjeKvara}
                  onChange={(e) => setStanjeKvara(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="stanjeKvara">
                  Popravljen
                </label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
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
            <div className="col-md-4 mb-3">
              <label htmlFor="idKorisnika" className="form-label">
                Domar:
              </label>
              <input
                type="number"
                className="form-control"
                id="idKorisnika"
                value={idKorisnika}
                onChange={(e) => setIdKorisnika(e.target.value)}
              />
            </div>
            <div className="col-md-4 mb-3">
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
          </div>
          <button type="submit" className="btn btn-primary">
            Izmijeni
          </button>
        </form>
      </div>
    </div>
  );
};

export default IzmjenaKvarovaPage;
