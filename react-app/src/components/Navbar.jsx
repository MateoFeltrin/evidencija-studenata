// Za importanje ikona otic ovdje https://react-icons.github.io/react-icons/search/#q=
import { FaPenAlt } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import { TbDoorEnter } from "react-icons/tb";
import { TbDoorExit } from "react-icons/tb";
import { IoIosLogIn } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { TbDoor } from "react-icons/tb";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary rounded">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav-tabs">
            <a className="navbar-brand center" href="/">
              Evidencija Studenata
            </a>
            <li class="nav-item dropdown-center">
            <Link class=" icon-link dropdown-item" aria-current="page" to="/popisSvihStanara">
                <FaPenAlt />
                Studenti
              </Link>
              <ul class="dropdown-menu">
                <li>
                  <Link class=" icon-link dropdown-item" aria-current="page" to="/unosStudenata">
                    <FaPenAlt />
                    Unos studenta
                  </Link>
                </li>
                <li>
                  <Link class=" icon-link dropdown-item" aria-current="page" to="/promjenaPodataka">
                    <FaPenAlt />
                    Promjena podataka studenta
                  </Link>
                </li>
              </ul>
            </li>
            <li class="nav-item dropdown-center">
              <button class={`nav-link dropdown-toggle icon-link ${location.pathname === "/useljenjeStudenta" || location.pathname === "/iseljenjeStudenta" ? "active" : ""}`} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <TbDoor />
                Useljenje i iseljenje
              </button>
              <ul class="dropdown-menu">
                <li>
                  <Link class=" icon-link dropdown-item" aria-current="page" to="/useljenjeStudenta">
                    <TbDoorEnter />
                    Useljenje studenta
                  </Link>
                </li>
                <li>
                  <Link class=" icon-link dropdown-item" aria-current="page" to="/iseljenjeStudenta">
                    <TbDoorExit />
                    Iseljenje studenta
                  </Link>
                </li>
              </ul>
            </li>
            <li class="nav-item dropdown-center">
              <button class={`nav-link dropdown-toggle icon-link ${location.pathname === "/popisSvihStanara" || location.pathname === "/popisVremenskogPeroida" ? "active" : ""}`} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <TbDoor />
                Popisi studenata
              </button>
              <ul class="dropdown-menu">
                <li>
                  <Link class=" icon-link dropdown-item" aria-current="page" to="/popisSvihStanara">
                    <FaList />
                    Popis svih trenutačnih stanara
                  </Link>
                </li>
                <li>
                  <Link class=" icon-link dropdown-item" aria-current="page" to="/popisVremenskogPeroida">
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
    </nav>
  );
};

export default Navbar;
