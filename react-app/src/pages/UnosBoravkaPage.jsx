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

  const [sobaOptions, setSobeOptions] = useState([]);
  const [objektOptions, setObjektOptions] = useState([]);
  const [krevetaOptions, setKrevetaOptions] = useState([]);
  const [oibOptions, setOibOptions] = useState([]);
  //const [korisnikaOptions, setKorisnikaOptions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/broj-objekta", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      })
      .then((response) => {
        setObjektOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sobe:", error);
      });
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
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // If the field changed is "broj_objekta", fetch associated rooms
    if (name === "broj_objekta") {
      try {
        const response = await axios.get(`http://localhost:3000/api/broj-sobe?broj_objekta=${value}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update the sobeOptions with the fetched room numbers
        setSobeOptions(response.data);
      } catch (error) {
        console.error("Error fetching sobe:", error);
      }
    }
    // If the field changed is "broj_objekta", fetch associated rooms
    if (name === "broj_sobe") {
      try {
        const response = await axios.get(`http://localhost:3000/api/broj-kreveta?id_sobe=${value}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setKrevetaOptions(response.data);
      } catch (error) {
        console.error("Error fetching kreveti:", error);
      }
    }
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
            <label htmlFor="broj_objekta">
              Objekt kreveta:<span className="text-danger">*</span>{" "}
            </label>
            <select className="form-control" id="broj_objekta" name="broj_objekta" value={formData.broj_objekta} onChange={handleChange} required>
              <option value="">Odaberi</option>
              {objektOptions &&
                objektOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.broj_objekta}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="broj_sobe">
              Soba kreveta: <span className="text-danger">*</span>{" "}
            </label>
            <select className="form-control" id="broj_sobe" name="broj_sobe" value={formData.broj_sobe} onChange={handleChange} required>
              <option value="">Odaberi</option>
              {sobaOptions.map((option) => (
                <option key={option.id_sobe} value={option.id_sobe}>
                  {option.broj_sobe}
                </option>
              ))}
            </select>
          </div>
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
