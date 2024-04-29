import React, { useState, useEffect } from 'react';
import CollapsableNavbar from "../components/CollapsableNavbar";
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Main style file
import 'react-date-range/dist/theme/default.css'; // Theme CSS file
import { Link } from 'react-router-dom';
import axios from 'axios';

const PopisVremenskogPerioda = () => {
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });
  const [boravciData, setBoravciData] = useState([]);

  useEffect(() => {
    fetchBoravciData();
  }, [selectionRange]); // Dohvati prilikom izmjene raspona datuma

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };

  const fetchBoravciData = async () => {
    try {
      const response = await axios.get(`/api/stanari?startDate=${selectionRange.startDate.toISOString()}&endDate=${selectionRange.endDate.toISOString()}`);
      setBoravciData(response.data);
    } catch (error) {
      console.error('Error fetching boravci data:', error);
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
            <DateRange
              editableDateInputs={true}
              onChange={handleSelect}
              moveRangeOnFirstSelection={false}
              ranges={[selectionRange]}
            />
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
