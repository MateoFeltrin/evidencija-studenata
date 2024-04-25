import React, { useState, useEffect } from "react";
import { FaPenAlt, FaList } from "react-icons/fa";
import { TbDoorEnter, TbDoorExit } from "react-icons/tb";
import { IoIosLogIn } from "react-icons/io";
import Navbar from "../components/Navbar";
import CollapsableNavbar from "../components/CollapsableNavbar";

const IzmjenaObjekataPage = () => {
  const [brojObjekta, setBrojObjekta] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    fetch("your/api/endpoint")
      .then((response) => response.json())
      .then((data) => {
        setBrojObjekta(data.broj_objekta);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="container-fluid">
      <CollapsableNavbar />
      <div className="container mt-4">
        <h2>Izmjena objekta</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
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
          <button type="submit" className="btn btn-primary">
            Izmijeni
          </button>
        </form>
      </div>
    </div>
  );
};

export default IzmjenaObjekataPage;
