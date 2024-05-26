import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import axios from "axios";

import CollapsableNavbar from "../components/CollapsableNavbar";

const IzmjenaStanaraPage = () => {
  const token = localStorage.getItem("token");
  const { id } = useParams();

  const [studentData, setStudentData] = useState({
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
  });
  const [error, setError] = useState(null); // State to hold error message

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/trenutni-stanari1/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      })
      .then((res) => {
        const data = res.data;
        setStudentData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please try again."); // Set error state
      });
  }, [id, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(studentData);
      console.log(token);
      const response = await axios.put(
        `http://localhost:3000/azuriranje-stanara/${id}`,
        studentData, // Data to send in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );
      alert("Podaci uspješno izmjenjeni!");
      // Redirect to the page where you display all students after successful update
      //  Router.push("/popisSvihStanara");
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Greška pri izmjeni, pogledajte jesu li unesena sva obavezna polja!");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setStudentData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  return (
    <div>
      <CollapsableNavbar />
      <div className="container-fluid">
        <div className="container mt-4">
          <Link to="/popisSvihStanara" className="btn btn-sm btn-danger mb-5">
            <IoArrowBackSharp />
          </Link>
          <h2>Izmjena stanara</h2>
          {error && <div className="text-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="oib" className="form-label">
                  OIB:
                </label>
                <input type="number" className="form-control" id="oib" name="oib" value={studentData.oib} onChange={handleChange} />
                {studentData.oib.length !== 11 && <div className="text-danger">OIB mora imati 11 znamenki.</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="jmbag" className="form-label">
                  JMBAG:
                </label>
                <input type="number" className="form-control" id="jmbag" name="jmbag" value={studentData.jmbag} onChange={handleChange} />
                {studentData.jmbag.length !== 10 && <div className="text-danger">JMBAG mora imati 10 znamenki.</div>}
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="ime" className="form-label">
                  Ime:
                </label>
                <input type="text" className="form-control" id="ime" name="ime" value={studentData.ime} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="prezime" className="form-label">
                  Prezime:
                </label>
                <input type="text" className="form-control" id="prezime" name="prezime" value={studentData.prezime} onChange={handleChange} />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="datum_rodenja" className="form-label">
                  Datum Rođenja:
                </label>
                <input type="date" className="form-control" id="datum_rodenja" name="datum_rodenja" value={studentData.datum_rodenja} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="adresa_prebivalista" className="form-label">
                  Adresa Prebivališta:
                </label>
                <input type="text" className="form-control" id="adresa_prebivalista" name="adresa_prebivalista" value={studentData.adresa_prebivalista} onChange={handleChange} />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="subvencioniranost" name="subvencioniranost" checked={studentData.subvencioniranost} onChange={handleChange} />
                <label className="form-check-label" htmlFor="subvencioniranost">
                  Subvencioniranost
                </label>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="uciliste" className="form-label">
                  Učilište:
                </label>
                <input type="text" className="form-control" id="uciliste" name="uciliste" value={studentData.uciliste} onChange={handleChange} />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="uplata_teretane" name="uplata_teretane" checked={studentData.uplata_teretane} onChange={handleChange} />
                <label className="form-check-label" htmlFor="uplata_teretane">
                  Uplata Teretane
                </label>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="komentar" className="form-label">
                  Komentar:
                </label>
                <textarea className="form-control" id="komentar" name="komentar" rows="3" value={studentData.komentar} onChange={handleChange}></textarea>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="id_korisnika" className="form-label">
                  ID Korisnika:
                </label>
                <input type="number" className="form-control" id="id_korisnika" name="id_korisnika" value={studentData.id_korisnika} onChange={handleChange} />
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

export default IzmjenaStanaraPage;
