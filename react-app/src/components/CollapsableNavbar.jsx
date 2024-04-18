// Za importanje ikona otic ovdje https://react-icons.github.io/react-icons/search/#q=
import { FaPenAlt } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import { TbDoorEnter } from "react-icons/tb";
import { TbDoorExit } from "react-icons/tb";
import { IoIosLogIn } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { TbDoor } from "react-icons/tb";

const CollapsableNavbar = () => {
  const location = useLocation();

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
              <li className="nav-item dropdown-center">
                <button className={`nav-link dropdown-toggle icon-link ${location.pathname === "/unosStudenata" || location.pathname === "/izmjenaStanara" ? "active" : ""}`} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <FaPenAlt />
                  Studenti
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link className=" icon-link dropdown-item" aria-current="page" to="/unosStanara">
                      <FaPenAlt />
                      Unos studenta
                    </Link>
                  </li>
                  <li>
                    <Link className=" icon-link dropdown-item" aria-current="page" to="/izmjenaStanara">
                      <FaPenAlt />
                      Promjena podataka studenta
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown-center">
                <button className={`nav-link dropdown-toggle icon-link ${location.pathname === "/useljenjeStanara" || location.pathname === "/iseljenjeStanara" ? "active" : ""}`} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <TbDoor />
                  Useljenje i iseljenje
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link className=" icon-link dropdown-item" aria-current="page" to="/useljenjeStanara">
                      <TbDoorEnter />
                      Useljenje studenta
                    </Link>
                  </li>
                  <li>
                    <Link className=" icon-link dropdown-item" aria-current="page" to="/iseljenjeStanara">
                      <TbDoorExit />
                      Iseljenje studenta
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown-center">
                <button className={`nav-link dropdown-toggle icon-link ${location.pathname === "/popisSvihStanara" || location.pathname === "/popisVremenskogPeroida" ? "active" : ""}`} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <TbDoor />
                  Popisi studenata
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link className=" icon-link dropdown-item" aria-current="page" to="/popisSvihStanara">
                      <FaList />
                      Popis svih trenutačnih stanara
                    </Link>
                  </li>
                  <li>
                    <Link className=" icon-link dropdown-item" aria-current="page" to="/popisVremenskogPeroida">
                      <FaList />
                      Popis stanara u vremenskom periodu
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
            <Link className={`nav-link icon-link ${location.pathname === "/prijava" ? "active" : ""}`} aria-current="page" to="/prijava">
              <IoIosLogIn />
              Prijava
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CollapsableNavbar;
