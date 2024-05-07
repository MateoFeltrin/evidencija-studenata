import { useState, useEffect } from "react";
import axios from "axios";
import CollapsableNavbar from "../components/CollapsableNavbar";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const UnosKvarovaPage = () => {
  const token = localStorage.getItem("token");

  // Get the current date in yyyy-mm-dd format
  const currentDate = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    opis_kvara: "",
    broj_objekta: "",
    broj_sobe: "",
    datum_prijave_kvara: currentDate, // Set current date
  });

  const [sobeOptions, setSobeOptions] = useState([]);
  const [objektOptions, setObjektOptions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
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
              .get("http://localhost:3000/api/broj-objekta", {
                headers: {
                  Authorization: `Bearer ${token}`, // Include the token in the headers
                },
              })
              .then((response) => {
                setObjektOptions(response.data);
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

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // If the field changed is "broj_objekta", fetch associated rooms
    if (name === "broj_objekta") {
      try {
        const response = await axios.get(`http://localhost:3000/api/broj-sobe?broj_objekta=${value}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update the sobeOptions with the fetched room numbers
        setSobeOptions(response.data);
      } catch (error) {
        console.error("Error fetching sobe:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you can send the form data to your backend or perform any other actions
    console.log(formData);
    try {
      // Send POST request to backend API endpoint
      await axios.post("http://localhost:3000/unos-kvara", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      alert("Form data submitted successfully!");
      // Clear form after successful submission
      setFormData({
        opis_kvara: "",
        broj_objekta: "",
        broj_sobe: "",
        datum_prijave_kvara: currentDate,
      });
    } catch (error) {
      console.error("Error submitting form data:", error);
      alert("An error occurred while submitting form data.");
    }
  };

  return (
    <div>
      <CollapsableNavbar />
      <div className="container">
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
                <label htmlFor="opis_kvara">
                  Opis kvara: <span className="text-danger">*</span>
                </label>
                <textarea className="form-control" id="opis_kvara" name="opis_kvara" value={formData.opis_kvara} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="broj_objekta">
                  Objekta sobe:<span className="text-danger">*</span>{" "}
                </label>
                <select className="form-control" id="broj_objekta" name="broj_objekta" value={formData.broj_objekta} onChange={handleChange} required>
                  <option value="">Odaberi</option>
                  {objektOptions &&
                    objektOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.broj_objekta}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="broj_sobe">
                  Sobne sobe: <span className="text-danger">*</span>
                </label>
                <select className="form-control" id="broj_sobe" name="broj_sobe" value={formData.broj_sobe} onChange={handleChange} required>
                  <option value="">Odaberi</option>
                  {sobeOptions &&
                    sobeOptions.map((option) => (
                      <option key={option.broj_sobe} value={option.broj_sobe}>
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
    </div>
  );
};

export default UnosKvarovaPage;
