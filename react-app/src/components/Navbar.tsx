// Za importanje ikona otic ovdje https://react-icons.github.io/react-icons/search/#q=
import { FaPenAlt } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import { TbDoorEnter } from "react-icons/tb";
import { TbDoorExit } from "react-icons/tb";
import { IoIosLogIn } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav-tabs">
            <a className="navbar-brand" href="/">
              Evidencija Studenata
            </a>
            <li className="nav-item">
              <Link className={`nav-link icon-link ${location.pathname === "/unosStudenata" ? "active" : ""}`} aria-current="page" to="/unosStudenata">
                <FaPenAlt />
                Unos studenta
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link icon-link ${location.pathname === "/promjenaPodataka" ? "active" : ""}`} aria-current="page" to="/promjenaPodataka">
                <FaPenAlt />
                Promjena podataka studenta
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link icon-link ${location.pathname === "/useljenjeStudenta" ? "active" : ""}`} aria-current="page" to="/useljenjeStudenta">
                <TbDoorEnter />
                Useljenje studenta
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link icon-link ${location.pathname === "/iseljenjeStudenta" ? "active" : ""}`} aria-current="page" to="/iseljenjeStudenta">
                <TbDoorExit />
                Iseljenje studenta
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link icon-link ${location.pathname === "/popisSvihStanara" ? "active" : ""}`} aria-current="page" to="/popisSvihStanara">
                <FaList />
                Popis svih trenutačnih stanara
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link icon-link ${location.pathname === "/popisVremenskogPeroida" ? "active" : ""}`} aria-current="page" to="/popisVremenskogPeroida">
                <FaList />
                Popis stanara u vremenskom periodu
              </Link>
            </li>
          </ul>
          <Link className={`nav-link icon-link ${location.pathname === "/prijava" ? "active" : ""}`} aria-current="page" to="/prijava">
            <IoIosLogIn />
            Prijava
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
