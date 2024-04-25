import React, { useState, useEffect } from "react";
import { FaPenAlt, FaList } from "react-icons/fa";
import { TbDoorEnter, TbDoorExit } from "react-icons/tb";
import { IoIosLogIn } from "react-icons/io";
import Navbar from "../components/Navbar";
import CollapsableNavbar from "../components/CollapsableNavbar";

const IzmjenaSobaPage = () => {
  const [idSobe, setIdSobe] = useState("");
  const [brojObjekta, setBrojObjekta] = useState("");
  const [katSobe, setKatSobe] = useState("");
  const [brojSobe, setBrojSobe] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetch("your/api/endpoint")
      .then((response) => response.json())
      .then((data) => {
        setIdSobe(data.id_sobe);
        setBrojObjekta(data.broj_objekta);
        setKatSobe(data.kat_sobe);
        setBrojSobe(data.broj_sobe);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="container-fluid">
      <CollapsableNavbar />
      <div className="container mt-4">
        <h2>Izmjena sobe</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="idSobe" className="form-label">
                ID Sobe:
              </label>
              <input
                type="number"
                className="form-control"
                id="idSobe"
                value={idSobe}
                onChange={(e) => setIdSobe(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="brojObjekta" className="form-label">
                Broj Objekta:
              </label>
              <input
                type="number"
                className="form-control"
                id="brojObjekta"
                value={brojObjekta}
                onChange={(e) => setBrojObjekta(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="katSobe" className="form-label">
                Kat Sobe:
              </label>
              <input
                type="number"
                className="form-control"
                id="katSobe"
                value={katSobe}
                onChange={(e) => setKatSobe(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="brojSobe" className="form-label">
                Broj Sobe:
              </label>
              <input
                type="number"
                className="form-control"
                id="brojSobe"
                value={brojSobe}
                onChange={(e) => setBrojSobe(e.target.value)}
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

export default IzmjenaSobaPage;
