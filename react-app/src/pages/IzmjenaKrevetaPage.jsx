import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import axios from "axios";
import CollapsableNavbar from "../components/CollapsableNavbar";

const IzmjenaKrevetaPage = () => {
  const token = localStorage.getItem("token");
  const { id_kreveta } = useParams();
  const navigate = useNavigate();

  const [krevetData, setKrevetData] = useState({
    id_kreveta: "",
    broj_kreveta: "",
    id_sobe: "",
    zauzetost: false,
    broj_objekta: "",
  });

  const [brojSobeOptions, setBrojSobeOptions] = useState([]);
  const [objektOptions, setObjektOptions] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/svi-kreveti1/${id_kreveta}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data;
        setKrevetData({
          ...data,
          broj_objekta: data.soba.broj_objekta,
        });
        fetchObjektOptions(data.soba.broj_objekta);
        fetchSobeOptions(data.soba.broj_objekta);
      })
      .catch((error) => console.error("Error fetching krevet data:", error));
  }, [id_kreveta, token]);

  const fetchObjektOptions = (selectedObjekt) => {
    axios
      .get("http://localhost:3000/api/broj-objekta", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const options = response.data.map((obj) => ({
          value: obj.id,
          label: obj.broj_objekta,
        }));
        setObjektOptions(options);
        if (selectedObjekt) {
          fetchSobeOptions(selectedObjekt);
        }
      })
      .catch((error) => {
        console.error("Error fetching objekt options:", error);
      });
  };

  const fetchSobeOptions = (broj_objekta) => {
    axios
      .get(`http://localhost:3000/api/broj-sobe?broj_objekta=${broj_objekta}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const options = response.data.map((soba) => ({
          value: soba.id_sobe,
          label: soba.broj_sobe,
        }));
        setBrojSobeOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching sobe:", error);
      });
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setKrevetData({
      ...krevetData,
      [name]: value,
    });

    if (name === "broj_objekta") {
      fetchSobeOptions(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:3000/azuriranje-kreveta/${id_kreveta}`, krevetData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Podaci uspješno izmjenjeni!");
      navigate("/popisKreveta");
    } catch (error) {
      alert("Greška pri izmjeni, pogledajte jesu li unesena sva polja!");
      console.error("Error updating data:", error);
    }
  };

  return (
    <div>
      <CollapsableNavbar />
      <div className="container-fluid">
        <div className="container mt-4">
          <Link to="/popisKreveta" className="btn btn-sm btn-danger mb-5">
            <IoArrowBackSharp />
          </Link>
          <h2>Izmjena kreveta</h2>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="id_kreveta" className="form-label">
                  ID Kreveta:
                </label>
                <input type="text" className="form-control" id="id_kreveta" name="id_kreveta" value={krevetData.id_kreveta} onChange={handleChange} readOnly />
              </div>
              <div className="col-md-6">
                <label htmlFor="broj_kreveta" className="form-label">
                  Broj Kreveta:
                </label>
                <input type="number" className="form-control" id="broj_kreveta" name="broj_kreveta" value={krevetData.broj_kreveta} onChange={handleChange} />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="broj_objekta" className="form-label">
                  Broj Objekta:
                </label>
                <select className="form-select" id="broj_objekta" name="broj_objekta" value={krevetData.broj_objekta} onChange={handleChange}>
                  <option value="">Odaberi broj objekta</option>
                  {objektOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="id_sobe" className="form-label">
                  Broj Sobe:
                </label>
                <select className="form-select" id="id_sobe" name="id_sobe" value={krevetData.id_sobe} onChange={handleChange}>
                  <option value="">Odaberi broj sobe</option>
                  {brojSobeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="zauzetost" name="zauzetost" checked={krevetData.zauzetost} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="zauzetost">
                    Zauzet
                  </label>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Izmijeni
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IzmjenaKrevetaPage;
