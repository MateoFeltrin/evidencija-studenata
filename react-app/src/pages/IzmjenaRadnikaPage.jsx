import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import CollapsableNavbar from "../components/CollapsableNavbar";
import { IoArrowBackSharp } from "react-icons/io5";
import axios from "axios";

const IzmjenaRadnikaPage = () => {
  const token = localStorage.getItem("token");
  const { id_korisnika } = useParams();

  const [korisnikData, setKorisnikData] = useState({
    id_korisnika: "",
    email_korisnika: "",
    lozinka: "",
    uloga: "",
  });

  useEffect(() => {
    console.log("ID Korisnika:", id_korisnika);
    axios
      .get(`http://localhost:3000/api/svi-radnici1/${id_korisnika}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      })
      .then((res) => {
        const data = res.data;
        console.log("Data received:", data);
        setKorisnikData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setKorisnikData({});
      });
  }, [id_korisnika]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:3000/azuriranje-korisnika/${id_korisnika}`, korisnikData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      alert("Podaci uspješno izmjenjeni!");
      // Redirect to the page where you display all users after successful update
      // Example: history.push("/popisKorisnika");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKorisnikData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      <CollapsableNavbar />
      <div className="container-fluid">
        <div className="container mt-4">
          <Link to="/popisKorisnika" className="btn btn-sm btn-danger mb-5">
            <IoArrowBackSharp />
          </Link>
          <h2>Izmjena korisnika</h2>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="id_korisnika" className="form-label">
                  ID Korisnika:
                </label>
                <input type="number" className="form-control" disabled id="id_korisnika" name="id_korisnika" value={korisnikData.id_korisnika} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="email_korisnika" className="form-label">
                  Email Korisnika:
                </label>
                <input type="email" className="form-control" id="email_korisnika" name="email_korisnika" value={korisnikData.email_korisnika} onChange={handleChange} />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="lozinka" className="form-label">
                  Lozinka:
                </label>
                <input type="password" className="form-control" id="lozinka" name="lozinka" value={korisnikData.lozinka} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="uloga" className="form-label">
                  Uloga:
                </label>
                <select className="form-select" id="uloga" name="uloga" value={korisnikData.uloga} onChange={handleChange}>
                  <option value="">Odaberi ulogu</option>
                  <option value="Recepcionar">Recepcionar</option>
                  <option value="Domar">Domar</option>
                  <option value="Admin">Admin</option>
                </select>
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

export default IzmjenaRadnikaPage;
