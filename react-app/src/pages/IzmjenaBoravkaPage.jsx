import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import CollapsableNavbar from "../components/CollapsableNavbar";

const IzmjenaBoravkaPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const initialBrojObjekta = queryParams.get("broj_objekta") || "";
  const initialBrojSobe = queryParams.get("broj_sobe") || "";
  const initialBrojKreveta = queryParams.get("broj_kreveta") || "";
  const initialOib = queryParams.get("oib") || "";
  const token = localStorage.getItem("token");
  const { id_boravka } = useParams();
  const decodedToken = jwtDecode(token);
  const id_korisnika = decodedToken.id;

  const [boravakData, setBoravakData] = useState({
    id_boravka: "",
    broj_kreveta: initialBrojKreveta,
    oib: initialOib,
    id_korisnika: id_korisnika,
    datum_useljenja: "",
    datum_iseljenja: "",
    broj_objekta: initialBrojObjekta,
    broj_sobe: initialBrojSobe,
  });

  const [oibOptions, setOibOptions] = useState([]);
  const [brojKrevetaOptions, setBrojKrevetaOptions] = useState([]);
  const [objektOptions, setObjektOptions] = useState([]);
  const [sobaOptions, setSobaOptions] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/svi-boravci1/${id_boravka}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      })
      .then((res) => {
        const data = res.data;
        setBoravakData((prevState) => ({
          ...prevState,
          ...data,
        }));
      })
      .catch((error) => console.error("Error fetching boravak data:", error));

    axios
      .get("http://localhost:3000/api/slobodni-stanari", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      })
      .then((res) => {
        const options = res.data.map((stanar) => ({
          value: stanar.oib,
          label: `${stanar.ime} ${stanar.prezime}`,
        }));
        setOibOptions(options);
      })
      .catch((error) => console.error("Error fetching oib options:", error));

    axios
      .get("http://localhost:3000/api/broj-objekta", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setObjektOptions(response.data);
      })
      .catch((error) => console.error("Error fetching objekt options:", error));

    if (initialBrojObjekta) {
      axios
        .get(`http://localhost:3000/api/broj-sobe?broj_objekta=${initialBrojObjekta}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setSobaOptions(response.data);
        })
        .catch((error) => console.error("Error fetching sobe for initialBrojObjekta:", error));

      if (initialBrojSobe) {
        console.log(initialBrojObjekta);
        console.log(initialBrojSobe);
        slobodniKreveti(initialBrojObjekta, initialBrojSobe, initialBrojKreveta);
      }
    }
  }, [id_boravka]);

  const slobodniKreveti = async (brojObjekta, brojSobe, brojKreveta) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/broj-kreveta?broj_objekta=${brojObjekta}&broj_sobe=${brojSobe}&broj_kreveta=${brojKreveta}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setBrojKrevetaOptions(response.data);
    } catch (error) {
      console.error("Error fetching available beds:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let formattedDatumIseljenja = null;
    const formattedDatumUseljenja = formatDateForServer(boravakData.datum_useljenja);
    if (boravakData.datum_iseljenja != null) {
      formattedDatumIseljenja = formatDateForServer(boravakData.datum_iseljenja);
    }

    setBoravakData((prevState) => ({
      ...prevState,
      datum_useljenja: formattedDatumUseljenja,
      datum_iseljenja: formattedDatumIseljenja,
    }));
    console.log(boravakData);
    try {
      console.log("Submitting update with data:", boravakData);
      await axios.put(`http://localhost:3000/azuriranje-boravka/${id_boravka}`, boravakData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      alert("Podaci uspješno izmjenjeni!");
    } catch (error) {
      alert("Greška pri izmjeni, pogledajte jesu li unesena sva polja!");
      console.error("Error updating data:", error);
    }
  };

  // Function to format date for the server (dd-mm-yyyy to yyyy-mm-dd)
  const formatDateForServer = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setBoravakData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "broj_objekta") {
      try {
        setBoravakData((prevState) => ({
          ...prevState,
          broj_sobe: "",
          broj_kreveta: "",
        }));

        const response = await axios.get(`http://localhost:3000/api/broj-sobe?broj_objekta=${value}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSobaOptions(response.data);
      } catch (error) {
        console.error("Error fetching sobe:", error);
      }
    }

    if (name === "broj_sobe") {
      try {
        setBoravakData((prevState) => ({
          ...prevState,
          broj_kreveta: "",
        }));

        slobodniKreveti(boravakData.broj_objekta, value);
      } catch (error) {
        console.error("Error fetching available beds:", error);
      }
    }
  };

  return (
    <div>
      <CollapsableNavbar />
      <div className="container-fluid">
        <div className="container mt-4">
          <Link to="/popisBoravaka" className="btn btn-sm btn-danger mb-5">
            <IoArrowBackSharp />
          </Link>
          <h2>Izmjena boravka</h2>
          {oibOptions.length > 0 && (
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="id_boravka" className="form-label">
                    ID Boravka:
                  </label>
                  <input disabled type="text" className="form-control" id="id_boravka" name="id_boravka" value={boravakData.id_boravka} onChange={handleChange} />
                </div>
                <div className="row mb-3">
                  <div className="col-md-3">
                    <label htmlFor="broj_objekta" className="form-label">
                      Objekt:
                    </label>
                    <select className="form-select" id="broj_objekta" name="broj_objekta" value={boravakData.broj_objekta} onChange={handleChange}>
                      <option value="">Odaberi Objekt</option>
                      {objektOptions.map((option) => (
                        <option key={option.id} value={option.broj_objekta}>
                          {option.broj_objekta}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="broj_sobe" className="form-label">
                      Soba:
                    </label>
                    <select className="form-select" id="broj_sobe" name="broj_sobe" value={boravakData.broj_sobe} onChange={handleChange}>
                      <option value="">Odaberi Sobu</option>
                      {sobaOptions.map((option) => (
                        <option key={option.id} value={option.broj_sobe}>
                          {option.broj_sobe}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="broj_kreveta" className="form-label">
                      Broj Kreveta:
                    </label>
                    <select className="form-select" id="broj_kreveta" name="broj_kreveta" value={boravakData.broj_kreveta} onChange={handleChange}>
                      <option value="">Odaberi broj kreveta</option>
                      {brojKrevetaOptions.map((option) => (
                        <option key={option.id} value={option.broj_kreveta}>
                          {option.broj_kreveta}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="oib" className="form-label">
                    Stanar:
                  </label>
                  <select className="form-select" id="oib" name="oib" value={boravakData.oib} onChange={handleChange}>
                    <option value="">Odaberi Stanara</option>
                    {oibOptions.map((option) => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default IzmjenaBoravkaPage;
