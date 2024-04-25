import { useState } from 'react';
import axios from 'axios';
import CollapsableNavbar from "../components/CollapsableNavbar";

const UnosRadnikaPage = () => {
  const [formData, setFormData] = useState({
    email_korisnika: '',
    lozinka: '',
    uloga: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add code here to submit formData to backend API
      const response = await axios.post("http://localhost:3000/api/unos-korisnika", formData);
      console.log(response.data);
      // Reset form fields
      setFormData({
        email_korisnika: '',
        lozinka: '',
        uloga: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <CollapsableNavbar />
      <div className="container">
        <h1 className="mt-4">Unos radnika</h1>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email_korisnika">Email korisnika:</label>
                <input
                  type="email"
                  className="form-control"
                  id="email_korisnika"
                  name="email_korisnika"
                  value={formData.email_korisnika}
                  onChange={handleChange}
                  required
                />
              </div>
            
              <div className="form-group">
                <label htmlFor="lozinka">Lozinka:</label>
                <input
                  type="password"
                  className="form-control"
                  id="lozinka"
                  name="lozinka"
                  value={formData.lozinka}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="uloga">Uloga:</label>
                <select
                  className="form-control"
                  id="uloga"
                  name="uloga"
                  value={formData.uloga}
                  onChange={handleChange}
                  required
                >
                  <option value="">Odaberi</option>
                  <option value="Recepcionar">Recepcionar</option>
                  <option value="Domar">Domar</option>
                  <option value="Admin">Admin</option>
                  <option value="Stanar">Stanar</option>
                </select>
              </div>
              
              <button type="submit" className="btn btn-primary">Unesi korisnika</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnosRadnikaPage;
