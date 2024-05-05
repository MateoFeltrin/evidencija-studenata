import React, { useState, useEffect } from "react";
import CollapsableNavbar from "../components/CollapsableNavbar";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS file
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PopisVremenskogPerioda = () => {
  const token = localStorage.getItem("token");
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [boravciData, setBoravciData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // Send a request to the backend server to verify the token and check the user's role
      axios
        .get("http://localhost:3000/verify-token?roles=admin,recepcionar", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        })
        .then((response) => {
          // If the response status is 200, proceed with fetching the data
          if (response.status === 200) {
            fetchBoravciData();
          } else {
            // If the user is not authorized, redirect to "/not-authorized" page
            navigate("/forbidden");
          }
        })
        .catch((error) => {
          // If there's an error (e.g., invalid token), redirect the user to the login page
          console.error("Error verifying token:", error);
          navigate("/forbidden");
        });
    } else {
      // If there's no token, redirect the user to the login page
      navigate("/prijava");
    }
  }, [navigate, selectionRange]);

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };

  const fetchBoravciData = async () => {
    try {
      const response = await axios.get(`/api/stanari?startDate=${selectionRange.startDate.toISOString()}&endDate=${selectionRange.endDate.toISOString()}`);
      setBoravciData(response.data);
    } catch (error) {
      console.error("Error fetching boravci data:", error);
    }
  };

  return (
    <div>
      <CollapsableNavbar />
      <div className="container">
        <div className="row justify-content-center mt-4">
          <div className="col-md-8">
            <h2 className="text-center mb-4">Popis stanara u određenom vremenskom periodu</h2>
            {/* Date range picker */}
            <DateRange editableDateInputs={true} onChange={handleSelect} moveRangeOnFirstSelection={false} ranges={[selectionRange]} />
            {/* Prikaz boravci data */}
            <div className="mt-4">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>OIB</th>
                      <th>Ime</th>
                      <th>Prezime</th>
                      <th>Datum useljenja</th>
                      <th>Datum iseljenja</th>
                    </tr>
                  </thead>
                  {/* <tbody>
  {boravciData && boravciData.map((stay, index) => (
    <tr key={index}>
      <td>{stay.ime}</td>
      <td>{stay.prezime}</td>
      <td>{new Date(stay.datum_useljenja).toDateString()}</td>
      <td>{stay.datum_iseljenja ? new Date(stay.datum_iseljenja).toDateString() : 'N/A'}</td>
    </tr>
  ))}
</tbody> */}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopisVremenskogPerioda;
