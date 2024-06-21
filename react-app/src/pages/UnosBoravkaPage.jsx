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
    datum_useljenja: "",
    datum_iseljenja: "",
  });

  const [sobaOptions, setSobeOptions] = useState([]);
  const [objektOptions, setObjektOptions] = useState([]);
  const [krevetaOptions, setKrevetaOptions] = useState([]);
  const [oibOptions, setOibOptions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/broj-objekta", {
        headers: {
          Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("stanari Data:", res.data);
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

    if (name === "broj_objekta") {
      try {
        const response = await axios.get(`http://localhost:3000/api/broj-sobe?broj_objekta=${value}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSobeOptions(response.data);
        setKrevetaOptions([]); // Clear kreveta options when changing objekt
      } catch (error) {
        console.error("Error fetching sobe:", error);
      }
    }

    if (name === "broj_sobe") {
      try {
        let query = `http://localhost:3000/api/broj-kreveta?broj_objekta=${formData.broj_objekta}&broj_sobe=${value}`;
        const response = await axios.get(query, {
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
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Boravak added successfully:", res.data);
        window.alert("Boravak je uspješno dodan!");
        setFormData({
          id_kreveta: "",
          oib: "",
          datum_useljenja: "",
          datum_iseljenja: "",
        });
      })
      .catch((err) => {
        console.error("Error adding boravak:", err);
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
                  <option key={option.id} value={option.broj_objekta}>
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
                <option key={option.id_sobe} value={option.broj_sobe}>
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

          <div className="form-group">
            <label>
              Datum Useljenja: <span className="text-danger">*</span>
            </label>
            <input type="date" className="form-control" name="datum_useljenja" value={formData.datum_useljenja} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary">
            Dodaj Boravak
          </button>
        </form>
      </div>
    </div>
  );
};

export default UnosBoravakaPage;
