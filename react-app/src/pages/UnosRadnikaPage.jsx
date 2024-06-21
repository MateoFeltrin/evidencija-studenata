import { useState } from "react";
import axios from "axios";
import CollapsableNavbar from "../components/CollapsableNavbar";
import { IoArrowBackSharp } from "react-icons/io5";

import { Link } from "react-router-dom";

const UnosRadnikaPage = () => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    email_korisnika: "",
    lozinka: "",
    uloga: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      await axios.post("http://localhost:3000/unos-radnika", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      alert("Radnik uspješno unesen!");
      setFormData({
        email_korisnika: "",
        lozinka: "",
        uloga: "",
      });
    } catch (error) {
      console.error("Error submitting form data:", error);
      alert("Greška prilikom unosa radnika.");
    }
  };

  return (
    <div>
      <CollapsableNavbar />
      <div className="container">
        <div className="container mt-4">
          <Link to="/popisKorisnika" className="btn btn-sm btn-danger mb-5">
            <IoArrowBackSharp />
          </Link>
        </div>
        <h1 className="mt-4">Unos radnika</h1>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email_korisnika">
                  Email korisnika: <span className="text-danger">*</span>
                </label>
                <input type="email" className="form-control" id="email_korisnika" name="email_korisnika" value={formData.email_korisnika} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="lozinka">
                  Lozinka: <span className="text-danger">*</span>
                </label>
                <input type="password" className="form-control" id="lozinka" name="lozinka" value={formData.lozinka} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="uloga">
                  Uloga: <span className="text-danger">*</span>
                </label>
                <select className="form-control" id="uloga" name="uloga" value={formData.uloga} onChange={handleChange} required>
                  <option value="">Odaberi</option>
                  <option value="recepcionar">Recepcionar</option>
                  <option value="domar">Domar</option>
                  <option value="admin">Admin</option>
                {/* <option value="stanar">Stanar</option> */}
                 </select>
              </div>

              <button type="submit" className="btn btn-primary">
                Unesi korisnika
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnosRadnikaPage;
