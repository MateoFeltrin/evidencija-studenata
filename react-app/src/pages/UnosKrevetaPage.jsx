import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CollapsableNavbar from "../components/CollapsableNavbar";
import { IoArrowBackSharp } from "react-icons/io5";

import { Link } from 'react-router-dom';

const UnosKrevetaPage = () => {
  const [formData, setFormData] = useState({
    broj_kreveta: '',
    id_sobe: ''
  });

  const [sobaOptions, setSobaOptions] = useState([]);

  useEffect(() => {
    // Fetch data for dropdown options
    axios.get("http://localhost:3000/api/broj-sobe")
      .then(response => {
        setSobaOptions(response.data);
      })
      .catch(error => {
        console.error('Error fetching sobe:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add code here to submit formData to backend API
    console.log(formData);
    // Reset form fields
    setFormData({
      broj_kreveta: '',
      id_sobe: ''
    });
  };

  return (
    <div className="container">
      <CollapsableNavbar />
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
              <label htmlFor="broj_kreveta">Broj kreveta:</label>
              <input
                type="number"
                className="form-control"
                id="broj_kreveta"
                name="broj_kreveta"
                value={formData.broj_kreveta}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="id_sobe">Soba:</label>
              <select
                className="form-control"
                id="id_sobe"
                name="id_sobe"
                value={formData.id_sobe}
                onChange={handleChange}
                required
              >
                <option value="">Odaberi</option>
                {sobaOptions && sobaOptions.map(option => (
                  <option key={option.id_sobe} value={option.id_sobe}>
                    {option.id_sobe}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary">Unesi</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UnosKrevetaPage;
