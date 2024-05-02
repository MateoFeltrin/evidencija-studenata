import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import axios from "axios";

import CollapsableNavbar from "../components/CollapsableNavbar";

const IzmjenaBoravkaPage = () => {
  const { id_boravka } = useParams();

  const [boravakData, setBoravakData] = useState({
    id_boravka: "",
    id_kreveta: "",
    oib: "",
    id_korisnika: "",
    datum_useljenja: "",
    datum_iseljenja: "",
  });

  const [oibOptions, setOibOptions] = useState([]);
  const [id_korisnikaOptions, setIdKorisnikaOptions] = useState([]);
  const [id_krevetaOptions, setIdKrevetaOptions] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/svi-boravci1/${id_boravka}`)
      .then((res) => {
        const data = res.data;
        setBoravakData(data);
      })
      .catch((error) => console.error("Error fetching boravak data:", error));

    axios
      .get("http://localhost:3000/api/slobodni-stanari")
      .then((res) => {
        const options = res.data.map((stanar) => ({
          value: stanar.oib,
          label: `${stanar.ime} ${stanar.prezime}`,
        }));
        setOibOptions(options);
      })
      .catch((error) => console.error("Error fetching oib options:", error));

    axios
      .get("http://localhost:3000/api/svi-radnici")
      .then((res) => {
        const options = res.data.map((korisnik) => ({
          value: korisnik.id_korisnika,
          label: korisnik.email_korisnika,
        }));
        setIdKorisnikaOptions(options);
      })
      .catch((error) => console.error("Error fetching korisnik options:", error));

    axios
      .get("http://localhost:3000/api/svi-kreveti")
      .then((res) => {
        const options = res.data.map((krevet) => ({
          value: krevet.id_kreveta,
          label: krevet.broj_kreveta,
        }));
        setIdKrevetaOptions(options);
      })
      .catch((error) => console.error("Error fetching krevet options:", error));
  }, [id_boravka]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedDatumUseljenja = formatDateForServer(boravakData.datum_useljenja);
    const formattedDatumIseljenja = formatDateForServer(boravakData.datum_iseljenja);

    setBoravakData((prevState) => ({
      ...prevState,
      datum_useljenja: formattedDatumUseljenja,
      datum_iseljenja: formattedDatumIseljenja,
    }));

    try {
      await axios.put(`http://localhost:3000/azuriranje-boravka/${id_boravka}`, boravakData);
      alert("Podaci uspješno izmjenjeni!");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  // Function to format date for the server (dd-mm-yyyy to yyyy-mm-dd)
  const formatDateForServer = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBoravakData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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
              <label htmlFor="id_boravka" className="form-label">
                ID Boravka:
              </label>
              <input type="text" className="form-control" id="id_boravka" name="id_boravka" value={boravakData.id_boravka} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label htmlFor="id_kreveta" className="form-label">
                ID Kreveta:
              </label>
              <select className="form-select" id="id_kreveta" name="id_kreveta" value={boravakData.id_kreveta} onChange={handleChange}>
                <option value="">Odaberi broj kreveta</option>
                {id_krevetaOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="oib" className="form-label">
                Stanar:
              </label>
              <select className="form-select" id="oib" name="oib" value={boravakData.oib} onChange={handleChange}>
                <option value="">Odaberi OIB</option>
                {oibOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="id_korisnika" className="form-label">
                Korisnik:
              </label>
              <select className="form-select" id="id_korisnika" name="id_korisnika" value={boravakData.id_korisnika} onChange={handleChange}>
                <option value="">Odaberi korisnika</option>
                {id_korisnikaOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="datum_useljenja" className="form-label">
                Datum Useljenja:
              </label>
              <input type="date" className="form-control" id="datum_useljenja" name="datum_useljenja" value={boravakData.datum_useljenja} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label htmlFor="datum_iseljenja" className="form-label">
                Datum Iseljenja:
              </label>
              <input type="date" className="form-control" id="datum_iseljenja" name="datum_iseljenja" value={boravakData.datum_iseljenja} onChange={handleChange} />
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
