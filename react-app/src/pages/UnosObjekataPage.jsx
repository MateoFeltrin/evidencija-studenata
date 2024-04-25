import React, { useState } from 'react';
import CollapsableNavbar from "../components/CollapsableNavbar";

const UnosObjekataPage = () => {
  const [formData, setFormData] = useState({
    broj_objekta: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can send the form data to your backend or perform any other actions
    console.log(formData);
    // Reset form after submission
    setFormData({
      broj_objekta: ''
    });
  };

  return (
    <div>
      <CollapsableNavbar />
      <div className="container">
        <h1 className="mt-4">Unos objekata</h1>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="broj_objekta" className="form-label">Broj objekta</label>
                <input type="number" className="form-control" id="broj_objekta" name="broj_objekta" value={formData.broj_objekta} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary">Unesi</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnosObjekataPage;
