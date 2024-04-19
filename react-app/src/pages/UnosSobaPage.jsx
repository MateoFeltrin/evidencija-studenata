import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CollapsableNavbar from "../components/CollapsableNavbar";

const UnosSobaPage = () => {
  const [formData, setFormData] = useState({
    broj_objekta: '',
    kat_sobe: '',
    broj_sobe: ''
  });

  const [objektOptions, setObjektOptions] = useState([]);

  useEffect(() => {
    // Fetch data for dropdown options
    axios.get("http://localhost:3000/api/svi-objekti")
      .then(response => {
        setObjektOptions(response.data);
      })
      .catch(error => {
        console.error('Error fetching objekti:', error);
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
      broj_objekta: '',
      kat_sobe: '',
      broj_sobe: ''
    });
  };

  return (
    <div>
      <CollapsableNavbar />
      <h1>Dodaj sobu</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="broj_objekta">Objekt:</label>
          <select
            className="form-control"
            id="broj_objekta"
            name="broj_objekta"
            value={formData.broj_objekta}
            onChange={handleChange}
            required
          >
            <option value="">Odaberi</option>
            {objektOptions && objektOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.broj_objekta}
              </option>
            ))}
          </select>
        </div>
      
        <div className="form-group">
          <label htmlFor="kat_sobe">Kat sobe:</label>
          <input
            type="number"
            className="form-control"
            id="kat_sobe"
            name="kat_sobe"
            value={formData.kat_sobe}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="broj_sobe">Broj sobe:</label>
          <input
            type="number"
            className="form-control"
            id="broj_sobe"
            name="broj_sobe"
            value={formData.broj_sobe}
            onChange={handleChange}
            required
          />
        </div>
      
        <button type="submit" className="btn btn-primary">Unesi</button>
      </form>
    </div>
  );
};

export default UnosSobaPage;
