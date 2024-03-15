// Za importanje ikona otic ovdje https://react-icons.github.io/react-icons/search/#q=
import { FaPenAlt } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import { TbDoorEnter } from "react-icons/tb";
import { TbDoorExit } from "react-icons/tb";
import { IoIosLogIn } from "react-icons/io";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav-tabs">
            <a className="navbar-brand" href="#">
              Evidencija Studenata
            </a>
            <li className="nav-item">
              <a className="nav-link active icon-link" aria-current="page" href="#">
                <FaPenAlt />
                Unos studenta
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link icon-link" aria-current="page" href="#">
                <FaPenAlt />
                Promjena podataka studenta
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link icon-link" aria-current="page" href="#">
                <TbDoorEnter />
                Useljenje studenta
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link icon-link" aria-current="page" href="#">
                <TbDoorExit />
                Iseljenje studenta
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link icon-link" aria-current="page" href="#">
                <FaList />
                Popis svih trenutačnih stanara
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link icon-link" aria-current="page" href="#">
                <FaList />
                Popis stanara u vremenskom periodu
              </a>
            </li>
          </ul>
          <a className="nav-link icon-link" aria-current="page" href="#">
            <IoIosLogIn />
            Prijava
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
