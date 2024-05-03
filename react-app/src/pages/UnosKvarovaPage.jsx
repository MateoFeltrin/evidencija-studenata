import { useState, useEffect } from "react";
import axios from "axios";
import CollapsableNavbar from "../components/CollapsableNavbar";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const UnosKvarovaPage = () => {
  const [formData, setFormData] = useState({
    opis_kvara: "",
    id_sobe: "",
  });

  const [sobeOptions, setSobeOptions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch token from local storage
    const token = localStorage.getItem("token");

    if (token) {
      // Send a request to the backend server to verify the token and check the user's role
      axios
        .get("http://localhost:3000/verify-token?roles=stanar,domar,admin", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        })
        .then((response) => {
          // If the response status is 200, proceed with fetching the data
          if (response.status === 200) {
            axios
              .get("http://localhost:3000/api/broj-sobe")
              .then((response) => {
                setSobeOptions(response.data);
              })
              .catch((error) => {
                console.error("Error fetching sobe:", error);
              });
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
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Reset form fields
    setFormData({
      opis_kvara: "",
      id_sobe: "",
    });
  };

  return (
    <div className="container">
      <CollapsableNavbar />
      <div className="container mt-4">
        <Link to="/popisSvihKvarova" className="btn btn-sm btn-danger mb-5">
          <IoArrowBackSharp />
        </Link>
      </div>
      <h1 className="mt-4">Dodaj kvar</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="opis_kvara">Opis kvara: <span className="text-danger">*</span></label>
              <textarea className="form-control" id="opis_kvara" name="opis_kvara" value={formData.opis_kvara} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="broj_sobe">Broj sobe:<span className="text-danger">*</span> </label>
              <select
                className="form-control"
                id="broj_sobe"
                name="id_sobe" // Changed from "broj_sobe" to "id_sobe"
                value={formData.id_sobe}
                onChange={handleChange}
                required
              >
                <option value="">Odaberi</option>
                {sobeOptions &&
                  sobeOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.broj_sobe}
                    </option>
                  ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              Prijavi kvar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UnosKvarovaPage;
