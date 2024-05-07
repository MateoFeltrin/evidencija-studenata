import React, { useState, useEffect } from "react";
import CollapsableNavbar from "../components/CollapsableNavbar";
import { IoArrowBackSharp } from "react-icons/io5";
import axios from "axios";
import { Link } from "react-router-dom";

const UnosBoravakaPage = () => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    id_kreveta: "",
    oib: "",
    //id_korisnika: "",
    datum_useljenja: "",
    datum_iseljenja: "",
  });

  const [krevetaOptions, setKrevetaOptions] = useState([]);
  const [oibOptions, setOibOptions] = useState([]);
  //const [korisnikaOptions, setKorisnikaOptions] = useState([]);

  useEffect(() => {
    // Fetch data for dropdowns
    axios
      .get("http://localhost:3000/api/svi-kreveti", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      })
      .then((res) => {
        console.log("Kreveta Data:", res.data); // Log the data received from the API
        setKrevetaOptions(res.data);
      })
      .catch((err) => console.error("Error fetching kreveta data:", err));

    axios
      .get("http://localhost:3000/api/slobodni-stanari", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      })
      .then((res) => {
        console.log("stanari Data:", res.data); // Log the data received from the API
        setOibOptions(res.data);
      })
      .catch((err) => console.error("Error fetching oib data:", err));

    /*  axios
      .get("http://localhost:3000/api/svi-radnici", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      })
      .then((res) => {
        console.log("korisnik Data:", res.data); // Log the data received from the API
        setKorisnikaOptions(res.data);
      })
      .catch((err) => console.error("Error fetching korisnika data:", err));*/
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/unos-boravka", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      })
      .then((res) => {
        console.log("Boravak added successfully:", res.data);
        // Show window alert
        window.alert("Boravak je uspješno dodan!");
        // Clear form data
        setFormData({
          id_kreveta: "",
          oib: "",
          // id_korisnika: "",
          datum_useljenja: "",
          datum_iseljenja: "",
        });
      })
      .catch((err) => {
        console.error("Error adding boravak:", err);
        // Handle error
      });
  };

  return (
    <div>
      <CollapsableNavbar />
      <div className="container">
        <div className="container mt-3">
          <Link to="/popisBoravaka" className="btn btn-sm btn-danger mb-5">
            <IoArrowBackSharp />
          </Link>
        </div>
        <h1>Unos Boravaka</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Broj Kreveta: <span className="text-danger">*</span>
            </label>
            <select className="form-control" name="id_kreveta" value={formData.id_kreveta} onChange={handleChange}>
              <option value="">Odaberi broj Kreveta</option>
              {krevetaOptions.map((option) => (
                <option key={option.id_kreveta} value={option.id_kreveta}>
                  {option.broj_kreveta}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>
              Stanar: <span className="text-danger">*</span>
            </label>
            <select className="form-control" name="oib" value={formData.oib} onChange={handleChange}>
              <option value="">Odaberi stanara</option>
              {oibOptions.map((option) => (
                <option key={option.oib} value={option.oib}>
                  {option.ime} {option.prezime}
                </option>
              ))}
            </select>
          </div>
          {/* 
<div className="form-group">
    <label>
      Korisnik: <span className="text-danger">*</span>
    </label>
    <select className="form-control" name="id_korisnika" value={formData.id_korisnika} onChange={handleChange}>
      <option value="">Odaberi Korisnika</option>
      {korisnikaOptions.map((option) => (
        <option key={option.id_korisnika} value={option.id_korisnika}>
          {" "}
          {option.email_korisnika}
        </option>
      ))}
    </select>
  </div>
  */}
          <div className="form-group">
            <label>
              Datum Useljenja: <span className="text-danger">*</span>
            </label>
            <input type="date" className="form-control" name="datum_useljenja" value={formData.datum_useljenja} onChange={handleChange} />
          </div>
          {/*<div className="form-group">
            <label>Datum Iseljenja:</label>
            <input
            type="date"
            className="form-control"
            name="datum_iseljenja"
            value={formData.datum_iseljenja}
            onChange={handleChange}
            />
</div>*/}
          <button type="submit" className="btn btn-primary">
            Dodaj Boravak
          </button>
        </form>
      </div>
    </div>
  );
};

export default UnosBoravakaPage;
