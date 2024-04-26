import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { IoArrowBackSharp } from "react-icons/io5";

import CollapsableNavbar from "../components/CollapsableNavbar";

const IzmjenaStanaraPage = () => {
  const [oib, setOib] = useState("");
  const [jmbag, setJmbag] = useState("");
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [datumRodenja, setDatumRodenja] = useState("");
  const [adresaPrebivalista, setAdresaPrebivalista] = useState("");
  const [subvencioniranost, setSubvencioniranost] = useState(null);
  const [uciliste, setUciliste] = useState("");
  const [uplataTeretane, setUplataTeretane] = useState(null);
  const [komentar, setKomentar] = useState("");
  const [idKorisnika, setIdKorisnika] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetch("your/api/endpoint")
      .then((response) => response.json())
      .then((data) => {
        setOib(data.oib);
        setJmbag(data.jmbag);
        setIme(data.ime);
        setPrezime(data.prezime);
        setDatumRodenja(data.datum_rodenja);
        setAdresaPrebivalista(data.adresa_prebivalista);
        setSubvencioniranost(data.subvencioniranost);
        setUciliste(data.uciliste);
        setUplataTeretane(data.uplata_teretane);
        setKomentar(data.komentar);
        setIdKorisnika(data.id_korisnika);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="container-fluid">
      <CollapsableNavbar />
      <div className="container mt-4">
      <Link to="/popisSvihStanara" className="btn btn-sm btn-danger mb-5">
      <IoArrowBackSharp />    
            </Link>
        <h2>Izmjena stanara</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="oib" className="form-label">
                OIB:
              </label>
              <input
                type="number"
                className="form-control"
                id="oib"
                value={oib}
                onChange={(e) => setOib(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="jmbag" className="form-label">
                JMBAG:
              </label>
              <input
                type="number"
                className="form-control"
                id="jmbag"
                value={jmbag}
                onChange={(e) => setJmbag(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="ime" className="form-label">
                Ime:
              </label>
              <input
                type="text"
                className="form-control"
                id="ime"
                value={ime}
                onChange={(e) => setIme(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="prezime" className="form-label">
                Prezime:
              </label>
              <input
                type="text"
                className="form-control"
                id="prezime"
                value={prezime}
                onChange={(e) => setPrezime(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="datumRodenja" className="form-label">
                Datum Rođenja:
              </label>
              <input
                type="date"
                className="form-control"
                id="datumRodenja"
                value={datumRodenja}
                onChange={(e) => setDatumRodenja(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="adresaPrebivalista" className="form-label">
                Adresa Prebivališta:
              </label>
              <input
                type="text"
                className="form-control"
                id="adresaPrebivalista"
                value={adresaPrebivalista}
                onChange={(e) => setAdresaPrebivalista(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="subvencioniranost"
                checked={subvencioniranost}
                onChange={(e) => setSubvencioniranost(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="subvencioniranost">
                Subvencioniranost
              </label>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="uciliste" className="form-label">
                Učilište:
              </label>
              <input
                type="text"
                className="form-control"
                id="uciliste"
                value={uciliste}
                onChange={(e) => setUciliste(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="uplataTeretane"
                checked={uplataTeretane}
                onChange={(e) => setUplataTeretane(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="uplataTeretane">
                Uplata Teretane
              </label>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="komentar" className="form-label">
                Komentar:
              </label>
              <textarea
                className="form-control"
                id="komentar"
                rows="3"
                value={komentar}
                onChange={(e) => setKomentar(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="idKorisnika" className="form-label">
                ID Korisnika:
              </label>
              <input
                type="number"
                className="form-control"
                id="idKorisnika"
                value={idKorisnika}
                onChange={(e) => setIdKorisnika(e.target.value)}
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

export default IzmjenaStanaraPage;
