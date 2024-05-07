import React, { useState } from "react";
import CollapsableNavbar from "../components/CollapsableNavbar";
import { IoArrowBackSharp } from "react-icons/io5";
import axios from "axios";
import { Link } from "react-router-dom";

const UnosObjekataPage = () => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    broj_objekta: "",
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
    // Here you can send the form data to your backend or perform any other actions
    console.log(formData);
    try {
      // Send POST request to backend API endpoint
      await axios.post("http://localhost:3000/unos-objekta", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      alert("Form data submitted successfully!");
      // Clear form after successful submission
      setFormData({
        broj_objekta: "",
        // Clear other form fields here
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
        <div className="container mt-4">
          <Link to="/popisObjekata" className="btn btn-sm btn-danger mb-5">
            <IoArrowBackSharp />
          </Link>
        </div>
        <h1 className="mt-4">Unos objekata</h1>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="broj_objekta" className="form-label">
                  Broj objekta <span className="text-danger">*</span>
                </label>
                <input type="number" className="form-control" id="broj_objekta" name="broj_objekta" value={formData.broj_objekta} onChange={handleChange} required />
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

export default UnosObjekataPage;
