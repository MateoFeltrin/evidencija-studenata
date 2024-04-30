import React, { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import { IoArrowBackSharp } from "react-icons/io5";
import axios from "axios";

import CollapsableNavbar from "../components/CollapsableNavbar";

const IzmjenaObjektaPage = () => {
  const { broj_objekta } = useParams();
 
  const [objektData, setObjektData] = useState({
    broj_objekta: "",
    
  });

  useEffect(() => {
    axios.get(`http://localhost:3000/api/objekt/${broj_objekta}`)
      .then((res) => {
        const data = res.data;
        setObjektData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [broj_objekta]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:3000/azuriranje-objekta/${broj_objekta}`, objektData);
      alert('Podaci uspješno izmjenjeni!');
      // Redirect to the page where you display all objects after successful update
      // Example: history.push("/popisSvihObjekata");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setObjektData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : newValue
    }));
  };
  
  
  return (
    <div className="container-fluid">
      <CollapsableNavbar />
      <div className="container mt-4">
        <Link to="/popisObjekata" className="btn btn-sm btn-danger mb-5">
          <IoArrowBackSharp />
        </Link>
        <h2>Izmjena objekta</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="broj_objekta" className="form-label">Broj objekta:</label>
              <input type="number" className="form-control" id="broj_objekta" name="broj_objekta" value={objektData.broj_objekta} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Izmijeni</button>
        </form>
      </div>
    </div>
  );
};

export default IzmjenaObjektaPage;
