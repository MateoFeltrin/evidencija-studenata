import { PiStudent } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa";
import { MdHandyman } from "react-icons/md";
import { FaRegBuilding } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import { FaBookReader } from "react-icons/fa";
import { IoIosLogIn } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TbDoor } from "react-icons/tb";
import { IoIosLogOut } from "react-icons/io";
import { jwtDecode } from "jwt-decode";
import { MdQuestionMark } from "react-icons/md";

const CollapsableNavbar = () => {
  // Function to check if the user is authenticated (if a token exists in local storage)
  const isAuthenticated = () => {
    // Check if the token exists in local storage
    const token = localStorage.getItem("token");
    return token !== null;
  };

  // Function to get the user's role from the token
  const getUserRole = () => {
    // Retrieve the token from local storage
    const token = localStorage.getItem("token");
    if (token) {
      // Decode the token to access its payload
      const decodedToken = jwtDecode(token);
      // Return the user's role (assuming the payload contains the 'uloga' property)
      return decodedToken.uloga;
    }
    // Return null if there is no token
    return null;
  };
  // Functions to check the user's role
  const isAdmin = () => {
    const role = getUserRole();
    return role === "admin";
  };

  const isStanar = () => {
    const role = getUserRole();
    return role === "stanar";
  };

  const isDomar = () => {
    const role = getUserRole();
    return role === "domar";
  };

  const isRecepcionar = () => {
    const role = getUserRole();
    return role === "recepcionar";
  };

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem("token");
    // Redirect the user to the PrijavaPage (login page)
    navigate("/prijava");
  };
  // Check if a token exists in local storage
  const tokenExists = localStorage.getItem("token");

  return (
    <nav className="navbar bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Evidencija Studenata
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              Evidencija Studenata
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              {(isAdmin() || isRecepcionar()) && (
                <li className="nav-item dropdown-center">
                  <button className={`nav-link dropdown-toggle icon-link ${location.pathname === "/popisSvihStanara" || location.pathname === "/popisVremenskogPeroida" || location.pathname === "/popisUnesenihStanara" ? "active" : ""}`} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <PiStudent />
                    Popisi studenata
                  </button>
                  <ul className="dropdown-menu">
                    <li className="nav-item-normal">
                      <div className="round-button btn btn-dark btn-floating">
                        <MdQuestionMark />
                        <div className="info-box">U ovoj tablici možete pregledati popis svih stanara koji trenutačno borave u domu, unjeti novog stanara u sustav, izmijeniti podatke stanara, izbrisati stanara i iseliti stanara</div>
                      </div>
                      <Link className="icon-link dropdown-item" aria-current="page" to="/popisSvihStanara">
                        <FaList />
                        Popis svih trenutačnih stanara
                      </Link>
                    </li>
                    <li className="nav-item-normal">
                      <div className="round-button btn btn-dark btn-floating">
                        <MdQuestionMark />
                        <div className="info-box">U ovoj tablici možete pregledati popis svih stanara koji koji su uneseni u sustav, unjeti novog stanara u sustav, izmijeniti podatke stanara i izbrisati stanara</div>
                      </div>
                      <Link className="icon-link dropdown-item" aria-current="page" to="/popisUnesenihStanara">
                        <FaList />
                        Popis unesenih stanara
                      </Link>
                    </li>
                    <li className="nav-item-normal">
                      <div className="round-button btn btn-dark btn-floating">
                        <MdQuestionMark />
                        <div className="info-box">U ovoj tablici možete pregledati popis stanara koji su boravili u vremenskom periodu vašeg izbora</div>
                      </div>
                      <Link className="icon-link dropdown-item" aria-current="page" to="/popisVremenskogPeroida">
                        <FaList />
                        Popis stanara vremenskog perioda
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
              {isAdmin() && (
                <li className="nav-item-normal">
                  <div className="round-button btn btn-dark btn-floating">
                    <MdQuestionMark />
                    <div className="info-box">
                      U ovoj tablici možete pregledati popis svih korisnika i njihovih korisničkih podataka (email, lozinka i uloga) u sustavu. Korisnici su i djelatnici i stanari. Možete unjeti novog radnika, izmijeniti podatke korisnika i izbrisati korisnika. Imajte na umu da se korisnik ne može izbrisati ako je radio neke akcije u sustavu kao na primjer useljenje stanara .
                    </div>
                  </div>
                  <Link className={`nav-link icon-link ${location.pathname === "/PopisKorisnika" ? "active" : ""}`} aria-current="page" to="/PopisKorisnika">
                    <FaRegUser />
                    Popis korisnika
                  </Link>
                </li>
              )}
              {(isAdmin() || isRecepcionar()) && (
                <li className="nav-item-normal">
                  <div className="round-button btn btn-dark btn-floating">
                    <MdQuestionMark />
                    <div className="info-box">U ovoj tablici možete pregledati popis svih stanara, useliti stanara (kojeg ste već unjeli u sustav), promijeniti podatke boravka, izbrisati stanara i iseliti stanara koji trenutačno boravi u domu.</div>
                  </div>
                  <Link className={`nav-link icon-link ${location.pathname === "/PopisBoravaka" ? "active" : ""}`} aria-current="page" to="/PopisBoravaka">
                    <FaBookReader />
                    Popis Boravaka
                  </Link>
                </li>
              )}
              {(isAdmin() || isDomar()) && (
                <li className="nav-item dropdown-center">
                  <button className={`nav-link dropdown-toggle icon-link ${location.pathname === "/popisSvihKvarova" || location.pathname === "/popisAktivnihKvarova" ? "active" : ""}`} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <MdHandyman />
                    Popis kvarova
                  </button>
                  <ul className="dropdown-menu">
                    <li className="nav-item-normal">
                      <div className="round-button btn btn-dark btn-floating">
                        <MdQuestionMark />
                        <div className="info-box">U ovoj tablici možete pregledati popis svih kvarova koji su zapisani u sustavu, dodati novi kvar, izmijneiti podatke kvara i izbrisati kvar.</div>
                      </div>
                      <Link className="icon-link dropdown-item" aria-current="page" to="/popisSvihKvarova">
                        <FaList />
                        Popis svih kvarova
                      </Link>
                    </li>
                    <li className="nav-item-normal">
                      <div className="round-button btn btn-dark btn-floating">
                        <MdQuestionMark />
                        <div className="info-box">U ovoj tablici možete pregledati popis svih kvarova koji još nisu popravljeni, dodati novi kvar, izmijneiti podatke kvara, izbrisati kvar i zabilježiti da je kvar popravljen.</div>
                      </div>
                      <Link className="icon-link dropdown-item" aria-current="page" to="/popisAktivnihKvarova">
                        <FaList />
                        Aktivni kvarovi
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
              {isAdmin() && (
                <li className="nav-item-normal">
                  <div className="round-button btn btn-dark btn-floating">
                    <MdQuestionMark />
                    <div className="info-box">U ovoj tablici možete pregledati popis svih objekata u sustavu, te dodati novi objekt, promijeniti podatke objekta i izbrisati postojeći objet u sustavu. Imajte na umu da ne možete izbrisati objekt ako postoji soba u sustavu koja je u tom objektu.</div>
                  </div>
                  <Link className={`nav-link icon-link ${location.pathname === "/popisObjekata" ? "active" : ""}`} aria-current="page" to="/popisObjekata">
                    <FaRegBuilding />
                    Popis objekata
                  </Link>
                </li>
              )}
              {isAdmin() && (
                <li className="nav-item-normal">
                  <div className="round-button btn btn-dark btn-floating">
                    <MdQuestionMark />
                    <div className="info-box">U ovoj tablici možete pregledati popis svih soba u sustavu, te dodati novu sobu, promijeniti podatke sobe i izbrisati postojeći sobu u sustavu. Imajte na umu da ne možete izbrisati sobu ako postoji krevet u sustavu koji je u toj sobi.</div>
                  </div>
                  <Link className={`nav-link icon-link ${location.pathname === "/popisSoba" ? "active" : ""}`} aria-current="page" to="/popisSoba">
                    <TbDoor />
                    Popis soba
                  </Link>
                </li>
              )}
              {isAdmin() && (
                <li className="nav-item-normal">
                  <div className="round-button btn btn-dark btn-floating">
                    <MdQuestionMark />
                    <div className="info-box">U ovoj tablici možete pregledati popis svih kreveta u sustavu, te dodati novi krevet u pojedinoj sobi, promijeniti podatke kreveta i izbrisati postojeći krevet u sustavu. Imajte na umu da ne možete izbrisati kevet ako postoji boravak zabilježen u njemu.</div>
                  </div>
                  <Link className={`nav-link icon-link ${location.pathname === "/popisKreveta" ? "active" : ""}`} aria-current="page" to="/popisKreveta">
                    <FaBed />
                    Popis kreveta
                  </Link>
                </li>
              )}
              {isStanar() && (
                <li>
                  <Link className={`nav-link icon-link ${location.pathname === "/unosKvarova" ? "active" : ""}`} aria-current="page" to="/unosKvarova">
                    <MdHandyman />
                    Prijava kvara
                  </Link>
                </li>
              )}
              {!isAuthenticated() && (
                <li>
                  <Link className={`nav-link icon-link ${location.pathname === "/prijava" ? "active" : ""}`} aria-current="page" to="/prijava">
                    <IoIosLogIn />
                    Prijava
                  </Link>
                </li>
              )}
              {tokenExists && (
                <li>
                  <button className="nav-link text-danger" onClick={handleLogout}>
                    <IoIosLogOut />
                    Odjava
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CollapsableNavbar;
