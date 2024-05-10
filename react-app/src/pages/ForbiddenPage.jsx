import { useState } from "react";
import axios from "axios"; // Import axios for API requests
import CollapsableNavbar from "../components/CollapsableNavbar";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const ForbiddenPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
                    <h2 className="fw-bold mb-2 text-uppercase">Zabranjena stranica!</h2>
                    <p className="text-white-50 mb-5">Nemate pravo pristupiti ovoj stranici</p>
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

export default ForbiddenPage;
