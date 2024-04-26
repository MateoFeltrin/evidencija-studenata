import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import CollapsableNavbar from "../components/CollapsableNavbar";
import { IoArrowBackSharp } from "react-icons/io5";


const IzmjenaRadnikaPage = () => {
  const [idKorisnika, setIdKorisnika] = useState("");
  const [emailKorisnika, setEmailKorisnika] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [uloga, setUloga] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetch("your/api/endpoint")
      .then((response) => response.json())
      .then((data) => {
        setIdKorisnika(data.id_korisnika);
        setEmailKorisnika(data.email_korisnika);
        setLozinka(data.lozinka);
        setUloga(data.uloga);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="container-fluid">
      <CollapsableNavbar />
      <div className="container mt-4">
      <Link to="/popisKorisnika" className="btn btn-sm btn-danger mb-5">
      <IoArrowBackSharp />    
            </Link>
        <h2>Izmjena korisnika</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="idKorisnika" className="form-label">
                ID Korisnika:
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
            <div className="col-md-6 mb-3">
              <label htmlFor="emailKorisnika" className="form-label">
                Email Korisnika:
              </label>
              <input
                type="email"
                className="form-control"
                id="emailKorisnika"
                value={emailKorisnika}
                onChange={(e) => setEmailKorisnika(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="lozinka" className="form-label">
                Lozinka:
              </label>
              <input
                type="password"
                className="form-control"
                id="lozinka"
                value={lozinka}
                onChange={(e) => setLozinka(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="uloga" className="form-label">
                Uloga:
              </label>
              <input
                type="text"
                className="form-control"
                id="uloga"
                value={uloga}
                onChange={(e) => setUloga(e.target.value)}
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

export default IzmjenaRadnikaPage;
