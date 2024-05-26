import { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API requests
import CollapsableNavbar from "../components/CollapsableNavbar";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

const saveTokenToLocalStorage = (token) => {
  localStorage.setItem("token", token);
};

const PrijavaPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token") != null) {
      const token = localStorage.getItem("token");
      // Decode the token to get the user's role
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.uloga;

      // Redirect the user based on their role
      if (userRole === "stanar") {
        navigate("/unosKvarova");
      } else if (userRole === "admin" || userRole === "recepcionar") {
        navigate("/popisSvihStanara");
      } else if (userRole === "domar") {
        navigate("/popisAktivnihKvarova");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the login endpoint
      const response = await axios.post("http://localhost:3000/login", {
        email_korisnika: email,
        lozinka: password,
      });

      if (response.data.success) {
        // If login is successful, save the token in local storage
        const token = response.data.token;
        saveTokenToLocalStorage(token);

        // Decode the token to get the user's role
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.uloga;

        // Redirect the user based on their role
        if (userRole === "stanar") {
          navigate("/unosKvarova");
        } else if (userRole === "admin" || userRole === "recepcionar") {
          navigate("/popisSvihStanara");
        } else if (userRole === "domar") {
          navigate("/popisAktivnihKvarova");
        }
      } else {
        // Display an error message if login fails
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      // Handle any other errors (e.g., network errors)
      console.error("Error during login:", error);
      setErrorMessage("Internal server error");
    }
  };

  return (
    <div>
      <CollapsableNavbar />
      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="card bg-dark text-white">
                <div className="card-body p-5 text-center">
                  <div className="mb-md-5 mt-md-4 pb-5">
                    <h2 className="fw-bold mb-2 text-uppercase">Prijava</h2>
                    <p className="text-white-50 mb-5">Molimo unesite svoje podatke za prijavu</p>

                    <form onSubmit={handleSubmit}>
                      <div className="form-outline form-white mb-4">
                        <input type="email" id="typeEmailX" className="form-control form-control-lg" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <label className="form-label" htmlFor="typeEmailX">
                          Email
                        </label>
                      </div>

                      <div className="form-outline form-white mb-4">
                        <input type="password" id="typePasswordX" className="form-control form-control-lg" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <label className="form-label" htmlFor="typePasswordX">
                          Lozinka
                        </label>
                      </div>

                      <button data-mdb-button-init data-mdb-ripple-init className="btn btn-outline-light btn-lg px-5" type="submit">
                        Prijavi se
                      </button>
                    </form>

                    {errorMessage && <div className="text-danger mt-3">{errorMessage}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrijavaPage;
