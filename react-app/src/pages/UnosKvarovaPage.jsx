import { useState, useEffect } from 'react';
import axios from 'axios';
import CollapsableNavbar from "../components/CollapsableNavbar";

const UnosKvarovaPage = () => {
  const [formData, setFormData] = useState({
    opis_kvara: '',
    id_sobe: '',
  });

  const [sobeOptions, setSobeOptions] = useState([]);

  useEffect(() => {
    // Fetch data for dropdown options
    axios.get("http://localhost:3000/api/broj-sobe")
      .then(response => {
        setSobeOptions(response.data);
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
      opis_kvara: '',
      id_sobe: '',
    });
  };

  return (
    <div className="container">
      <CollapsableNavbar />
      <h1 className="mt-4">Dodaj kvar</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="opis_kvara">Opis kvara:</label>
              <textarea
                className="form-control"
                id="opis_kvara"
                name="opis_kvara"
                value={formData.opis_kvara}
                onChange={handleChange}
                required
              />
            </div>
           
            <div className="form-group">
              <label htmlFor="broj_sobe">Broj sobe:</label>
              <select
                className="form-control"
                id="broj_sobe"
                name="id_sobe" // Changed from "broj_sobe" to "id_sobe"
                value={formData.id_sobe}
                onChange={handleChange}
                required
              >
                <option value="">Odaberi</option>
                {sobeOptions && sobeOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.broj_sobe}
                  </option>
                ))}
              </select>
            </div>
            
            <button type="submit" className="btn btn-primary">Prijavi kvar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UnosKvarovaPage;
