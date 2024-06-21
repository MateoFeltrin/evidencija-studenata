import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import axios from "axios";
import { format } from "date-fns";

import CollapsableNavbar from "../components/CollapsableNavbar";

const IzmjenaKvarovaPage = () => {
  const token = localStorage.getItem("token");
  const { id_kvara } = useParams();

  const [kvarData, setKvarData] = useState({
    id_kvara: "",
    datum_prijave: "",
    opis_kvara: "",
    stanje_kvara: false,
    id_sobe: "",
    id_korisnika: "",
    oib: "",
  });

  const [additionalData, setAdditionalData] = useState({
    email_korisnika: "",
    broj_sobe: "",
    ime: "",
    prezime: "",
  });

  // Format the date using date-fns
  const formatDate = (dateString) => {
    if (dateString) {
      try {
        return format(new Date(dateString), "dd.MM.yyyy.");
      } catch (error) {
        console.error("Invalid date format:", error);
        return dateString;
      }
    }
    return "";
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/svi-kvarovi1/${id_kvara}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data;
        data.datum_prijave = formatDate(data.datum_prijave_kvara); // Format the date before setting state
        setKvarData(data);
        // Fetch additional data
        fetchAdditionalData(data.id_korisnika, data.id_sobe, data.oib);
      })
      .catch((error) => console.error("Error fetching kvar data:", error));
  }, [id_kvara, token]);

  const fetchAdditionalData = async (idKorisnika, idSobe, oib) => {
    try {
      // Fetch soba data
      const sobaRes = await axios.get(`http://localhost:3000/api/sve-sobe1/${idSobe}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { broj_sobe } = sobaRes.data;
      setAdditionalData((prevData) => ({
        ...prevData,
        broj_sobe,
      }));

      // Fetch ime and prezime data
      try {
        const imePrezimeRes = await axios.get(`http://localhost:3000/api/trenutni-stanari1/${oib}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { ime, prezime } = imePrezimeRes.data;
        setAdditionalData((prevData) => ({
          ...prevData,
          ime,
          prezime,
        }));
      } catch (error) {
        console.error("Error fetching ime and prezime data:", error);
      }

      // If idKorisnika is not null, fetch additional data for svi-radnici1
      if (idKorisnika) {
        const korisnikRes = await axios.get(`http://localhost:3000/api/svi-radnici1/${idKorisnika}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { email_korisnika } = korisnikRes.data;

        setAdditionalData((prevData) => ({
          ...prevData,
          email_korisnika,
        }));
      }
    } catch (error) {
      console.error("Error fetching additional data:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send original IDs to the backend
      await axios.put(`http://localhost:3000/azuriranje-podataka-kvara/${id_kvara}`, kvarData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Podaci uspješno izmjenjeni!");
    } catch (error) {
      alert("Greška pri izmjeni, pogledajte jesu li unesena sva polja!");
      console.error("Error updating data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setKvarData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  return (
    <div>
      <CollapsableNavbar />
      <div className="container-fluid">
        <div className="container mt-4">
          <Link to="/popisAktivnihKvarova" className="btn btn-sm btn-danger mb-5">
            <IoArrowBackSharp />
          </Link>
          <h2>Izmjena kvarova</h2>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="id_kvara" className="form-label">
                  ID Kvara:
                </label>
                <input type="text" className="form-control" id="id_kvara" name="id_kvara" value={kvarData.id_kvara} onChange={handleChange} disabled />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="datum_prijave" className="form-label">
                  Datum Prijave:
                </label>
                <input type="text" className="form-control" id="datum_prijave" name="datum_prijave" value={kvarData.datum_prijave} onChange={handleChange} disabled />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="opis_kvara" className="form-label">
                  Opis Kvara:
                </label>
                <input type="text" className="form-control" id="opis_kvara" name="opis_kvara" value={kvarData.opis_kvara} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="stanje_kvara" className="form-label">
                  Stanje Kvara:
                </label>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="stanje_kvara" name="stanje_kvara" checked={kvarData.stanje_kvara} onChange={handleChange} disabled />
                  <label className="form-check-label" htmlFor="stanje_kvara">
                    Popravljen
                  </label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="broj_sobe" className="form-label">
                  Broj Sobe:
                </label>
                <input type="number" className="form-control" id="broj_sobe" name="broj_sobe" value={additionalData.broj_sobe} onChange={handleChange} disabled />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="email_korisnika" className="form-label">
                  Email Korisnika:
                </label>
                <input type="email" className="form-control" id="email_korisnika" name="email_korisnika" value={additionalData.email_korisnika || ""} onChange={handleChange} disabled />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="ime" className="form-label">
                  Ime:
                </label>
                <input type="text" className="form-control" id="ime" name="ime" value={additionalData.ime} onChange={handleChange} disabled />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="prezime" className="form-label">
                  Prezime:
                </label>
                <input type="text" className="form-control" id="prezime" name="prezime" value={additionalData.prezime} onChange={handleChange} disabled />
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

export default IzmjenaKvarovaPage;
