/* 
Za importanje ikona otic ovdje https://react-icons.github.io/react-icons/search/#q= 

Stranica za popis aktivnih kvarova
*/
import { FaPenAlt } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import { TbDoorEnter } from "react-icons/tb";
import { TbDoorExit } from "react-icons/tb";
import { IoIosLogIn } from "react-icons/io";
import Navbar from "../components/Navbar";
import CollapsableNavbar from "../components/CollapsableNavbar";

const PopisAktivnihKvarovaPage = () => {
  return (
    <div>
      <CollapsableNavbar />
      <div> Iseljenje Studenta</div>
    </div>
  );
};

export default PopisAktivnihKvarovaPage;