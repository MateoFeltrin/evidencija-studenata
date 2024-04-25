import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CollapsableNavbar from "../components/CollapsableNavbar";

const UnosKrevetaPage = () => {
  const [formData, setFormData] = useState({
    broj_kreveta: '',
    id_kreveta: '', 
    id_korisnika: ''
  });

  const [krevetOptions, setKrevetOptions] = useState([]);
  const [korisnikOptions, setKorisnikOptions] = useState([]);

  useEffect(() => {
    // Fetch data for dropdown options
    axios.get("http://localhost:3000/api/broj-kreveta")
      .then(response => {
        setKrevetOptions(response.data);
      })
      .catch(error => {
        console.error('Error fetching kreveta:', error);
      });

    axios.get("http://localhost:3000/api/slobodni-stanari")
      .then(response => {
        setKorisnikOptions(response.data);
      })
      .catch(error => {
        console.error('Error fetching korisnici:', error);
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
      id_kreveta: '',
      id_korisnika: ''
    });
  };

  return (
    <div className="container">
      <CollapsableNavbar />
      <h1 className="mt-4">Dodaj boravak</h1>
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label htmlFor="id_kreveta">Krevet:</label>
          <select
            className="form-control"
            id="id_kreveta"
            name="id_kreveta"
            value={formData.id_kreveta}
            onChange={handleChange}
            required
          >
            <option value="">Odaberi</option>
            {krevetOptions && krevetOptions.map(option => (
              <option key={option.id_kreveta} value={option.id_kreveta}>
                {option.broj_kreveta} {/* Display broj kreveta */}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="id_korisnika">Korisnik:</label>
          <select
            className="form-control"
            id="id_korisnika"
            name="id_korisnika"
            value={formData.id_korisnika}
            onChange={handleChange}
            required
          >
            <option value="">Odaberi</option>
            {korisnikOptions && korisnikOptions.map(option => (
              <option key={option.id_korisnika} value={option.id_korisnika}>
                {option.ime} {option.prezime} {/* Display ime and prezime */}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Unesi</button>
      </form>
    </div>
  );
};

export default UnosKrevetaPage;