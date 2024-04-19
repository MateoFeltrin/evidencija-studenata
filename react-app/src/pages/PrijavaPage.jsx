import { FaPenAlt } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import { TbDoorEnter } from "react-icons/tb";
import { TbDoorExit } from "react-icons/tb";
import { IoIosLogIn } from "react-icons/io";
import React, { useState } from 'react';
import CollapsableNavbar from "../components/CollapsableNavbar";

const PrijavaPage = () => {
  const [Email, setEmail] = useState('');
  const [Lozinka, setLozinka] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Email:', Email);
    console.log('Lozinka:', Lozinka);
  };

  return (
    <div>
      <CollapsableNavbar />
     
      <div className="container">
      <h1> Prijavi se</h1>
        <div className="row justify-content-center mt-5">
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="Email" className="form-label">Email:</label>
                <input type="text" className="form-control" id="Email" value={Email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="Lozinka" className="form-label">Lozinka</label>
                <input type="Lozinka" className="form-control" id="Lozinka" value={Lozinka} onChange={(e) => setLozinka(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrijavaPage;
