import React, { useState, useEffect } from "react";
import axios from "axios";
import CollapsableNavbar from "../components/CollapsableNavbar";
import { IoArrowBackSharp } from "react-icons/io5";

import { Link } from "react-router-dom";

const UnosKrevetaPage = () => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    broj_kreveta: "",
    broj_sobe: "",
    broj_objekta: "",
  });

  const [sobaOptions, setSobeOptions] = useState([]);
  const [objektOptions, setObjektOptions] = useState([]);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you can send the form data to your backend or perform any other actions
    console.log(formData);
    try {
      // Send POST request to backend API endpoint
      await axios.post("http://localhost:3000/unos-kreveta", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      alert("Form data submitted successfully!");
      // Clear form after successful submission
      setFormData({
        broj_kreveta: "",
        broj_sobe: "",
        broj_objekta: "",
      });
    } catch (error) {
      console.error("Error submitting form data:", error);
      alert("An error occurred while submitting form data.");
    }
  };

  return (
    <div>
      <CollapsableNavbar />
      <div className="container">
        <div className="container mt-3">
          <Link to="/popisKreveta" className="btn btn-sm btn-danger mb-5">
            <IoArrowBackSharp />
          </Link>
        </div>
        <h1 className="mt-4">Dodaj krevet</h1>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="broj_kreveta">
                  Broj kreveta: <span className="text-danger">*</span>
                </label>
                <input type="number" className="form-control" id="broj_kreveta" name="broj_kreveta" value={formData.broj_kreveta} onChange={handleChange} required />
              </div>
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
                  {sobaOptions &&
                    sobaOptions.map((option) => (
                      <option key={option.broj_sobe} value={option.broj_sobe}>
                        {option.broj_sobe}
                      </option>
                    ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary">
                Unesi
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnosKrevetaPage;
