/* 
Za importanje ikona otic ovdje https://react-icons.github.io/react-icons/search/#q= 

Stranica za biljezenje da je kvar popravljen
*/
import { FaPenAlt } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import { TbDoorEnter } from "react-icons/tb";
import { TbDoorExit } from "react-icons/tb";
import { IoIosLogIn } from "react-icons/io";
import Navbar from "../components/Navbar";
import CollapsableNavbar from "../components/CollapsableNavbar";

const IzmjenaKvarovaPage = () => {
  return (
    <div>
      <CollapsableNavbar />
      <div> Iseljenje Studenta</div>
    </div>
  );
};

export default IzmjenaKvarovaPage;
