import React, { useState } from 'react';
import CollapsableNavbar from "../components/CollapsableNavbar";

const UnosStanaraPage = () => {
  const [formData, setFormData] = useState({
    oib: '',
    jmbag: '',
    ime: '',
    prezime: '',
    datum_rodenja: '',
    adresa_prebivalista: '',
    subvencioniranost: false,
    uciliste: '',
    uplata_teretane: false,
    komentar: '',
    id_korisnika: '',
    email_korisnika: '', 
    lozinka: '', 
    uloga: '' 
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can send the form data to your backend or perform any other actions
    console.log(formData);
  };

  return (
  <div>
<CollapsableNavbar />
  
    <div className="container">
    <h1>Unos novog stanara</h1>
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="oib" className="form-label">OIB</label>
        <input type="text" className="form-control" id="oib" name="oib" value={formData.oib} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label htmlFor="jmbag" className="form-label">JMBAG</label>
        <input type="text" className="form-control" id="jmbag" name="jmbag" value={formData.jmbag} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label htmlFor="ime" className="form-label">Ime</label>
        <input type="text" className="form-control" id="ime" name="ime" value={formData.ime} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label htmlFor="prezime" className="form-label">Prezime</label>
        <input type="text" className="form-control" id="prezime" name="prezime" value={formData.prezime} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label htmlFor="datum_rodenja" className="form-label">Datum rođenja</label>
        <input type="date" className="form-control" id="datum_rodenja" name="datum_rodenja" value={formData.datum_rodenja} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label htmlFor="adresa_prebivalista" className="form-label">Adresa prebivališta</label>
        <input type="text" className="form-control" id="adresa_prebivalista" name="adresa_prebivalista" value={formData.adresa_prebivalista} onChange={handleChange} required />
      </div>
      <div className="mb-3 form-check">
        <input type="checkbox" className="form-check-input" id="subvencioniranost" name="subvencioniranost" checked={formData.subvencioniranost} onChange={handleChange} />
        <label className="form-check-label" htmlFor="subvencioniranost">Subvencioniranost</label>
      </div>
      <div className="mb-3">
        <label htmlFor="uciliste" className="form-label">Učilište</label>
        <input type="text" className="form-control" id="uciliste" name="uciliste" value={formData.uciliste} onChange={handleChange} required />
      </div>
      <div className="mb-3 form-check">
        <input type="checkbox" className="form-check-input" id="uplata_teretane" name="uplata_teretane" checked={formData.uplata_teretane} onChange={handleChange} />
        <label className="form-check-label" htmlFor="uplata_teretane">Uplata teretane</label>
      </div>
      <div className="mb-3">
        <label htmlFor="komentar" className="form-label">Komentar</label>
        <textarea className="form-control" id="komentar" name="komentar" value={formData.komentar} onChange={handleChange}></textarea>
      </div>
      <div className="mb-3">
            <label htmlFor="email_korisnika" className="form-label">Email korisnika</label>
            <input type="email" className="form-control" id="email_korisnika" name="email_korisnika" value={formData.email_korisnika} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="lozinka" className="form-label">Lozinka</label>
            <input type="password" className="form-control" id="lozinka" name="lozinka" value={formData.lozinka} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="uloga" className="form-label">Uloga</label>
            <select className="form-control" id="uloga" name="uloga" value={formData.uloga} onChange={handleChange} required>
              <option value="">Odaberi ulogu</option>
              <option value="Stanar">Stanar</option>
              <option value="Recepcionar">Recepcionar</option>
              <option value="Admin">Admin</option>
              <option value="Domar">Domar</option>
            </select>
          </div>
      <button type="submit" className="btn btn-primary">Unesi</button>
    </form>
  </div>
  </div>
);
};

export default UnosStanaraPage;
