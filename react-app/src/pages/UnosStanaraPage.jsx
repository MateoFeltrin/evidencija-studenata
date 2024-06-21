import React, { useState } from "react";
import CollapsableNavbar from "../components/CollapsableNavbar";
import { IoArrowBackSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import axios from "axios";

const UnosStanaraPage = () => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    oib: "",
    jmbag: "",
    ime: "",
    prezime: "",
    datum_rodenja: "",
    adresa_prebivalista: "",
    subvencioniranost: false,
    uciliste: "",
    uplata_teretane: false,
    komentar: "",
    id_korisnika: "",
    email_korisnika: "",
    lozinka: "",
    // uloga: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;

    // Custom validation for OIB
    if (name === "oib" && type === "text") {
      // Remove any non-numeric characters
      newValue = value.replace(/\D/g, "");
      // Limit to 11 characters
      newValue = newValue.slice(0, 11);
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.oib.length !== 11) {
      alert("OIB mora imati 11 znamenaka.");
      return;
    }
    console.log(formData);
    try {
      await axios.post("http://localhost:3000/unos-stanara", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      alert("Stanar uspješno unesen!");
      setFormData({
        oib: "",
        jmbag: "",
        ime: "",
        prezime: "",
        datum_rodenja: "",
        adresa_prebivalista: "",
        subvencioniranost: false,
        uciliste: "",
        uplata_teretane: false,
        komentar: "",
        id_korisnika: "",
        email_korisnika: "",
        lozinka: "",
        // uloga: ''
      });
    } catch (error) {
      console.error("Error submitting form data:", error);
      alert("Greška prilikom unosa stanara.");
    }
  };

  return (
    <div>
      <CollapsableNavbar />
      <div className="container mt-4">
        <Link to="/popisSvihStanara" className="btn btn-sm btn-danger mb-5">
          <IoArrowBackSharp />
        </Link>
        <h1 className="mt-1">Unos novog stanara</h1>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="oib" className="form-label">
                  Unesite OIB <span className="text-danger">*</span>
                </label>
                <input type="text" className="form-control" id="oib" name="oib" value={formData.oib} onChange={handleChange} required />
                {formData.oib.length !== 11 && <div className="text-danger">OIB mora imati 11 znamenki.</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="jmbag" className="form-label">
                  Unesite JMBAG <span className="text-danger">*</span>
                </label>
                <input type="text" className="form-control" id="jmbag" name="jmbag" value={formData.jmbag} onChange={handleChange} required />
                {formData.jmbag.length !== 10 && <div className="text-danger">JMBAG mora imati 10 znamenki.</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="ime" className="form-label">
                  Unesite Ime <span className="text-danger">*</span>
                </label>
                <input type="text" className="form-control" id="ime" name="ime" value={formData.ime} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="prezime" className="form-label">
                  Unesite Prezime <span className="text-danger">*</span>
                </label>
                <input type="text" className="form-control" id="prezime" name="prezime" value={formData.prezime} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="datum_rodenja" className="form-label">
                  Unesite Datum rođenja <span className="text-danger">*</span>
                </label>
                <input type="date" className="form-control" id="datum_rodenja" name="datum_rodenja" value={formData.datum_rodenja} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="adresa_prebivalista" className="form-label">
                  Unesite Adresa prebivališta <span className="text-danger">*</span>
                </label>
                <input type="text" className="form-control" id="adresa_prebivalista" name="adresa_prebivalista" value={formData.adresa_prebivalista} onChange={handleChange} required />
              </div>
              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="subvencioniranost" name="subvencioniranost" checked={formData.subvencioniranost} onChange={handleChange} />
                <label className="form-check-label" htmlFor="subvencioniranost">
                  Unesite Subvencioniranost
                </label>
              </div>
              <div className="mb-3">
                <label htmlFor="uciliste" className="form-label">
                  Unesite Učilište <span className="text-danger">*</span>
                </label>
                <input type="text" className="form-control" id="uciliste" name="uciliste" value={formData.uciliste} onChange={handleChange} required />
              </div>
              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="uplata_teretane" name="uplata_teretane" checked={formData.uplata_teretane} onChange={handleChange} />
                <label className="form-check-label" htmlFor="uplata_teretane">
                  Unesite Uplata teretane
                </label>
              </div>
              <div className="mb-3">
                <label htmlFor="komentar" className="form-label">
                  Unesite Komentar <span className="text-danger">*</span>
                </label>
                <textarea className="form-control" id="komentar" name="komentar" value={formData.komentar} onChange={handleChange}></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="email_korisnika" className="form-label">
                  Unesite Email korisnika <span className="text-danger">*</span>
                </label>
                <input type="email" className="form-control" id="email_korisnika" name="email_korisnika" value={formData.email_korisnika} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="lozinka" className="form-label">
                  Unesite Lozinka <span className="text-danger">*</span>
                </label>
                <input type="password" className="form-control" id="lozinka" name="lozinka" value={formData.lozinka} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary mb-3 mr-2">
                Unesi
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnosStanaraPage;
