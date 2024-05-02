import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import UnosStanaraPage from "./pages/UnosStanaraPage";
import PopisKorisnikaPage from "./pages/PopisKorisnikaPage";
import PopisSvihStanaraPage from "./pages/PopisSvihStanaraPage";
import PopisVremenskogPerioda from "./pages/PopisVremenskogPeriodaPage";
import PopisBoravakaPage from "./pages/PopisBoravakaPage";
import PrijavaPage from "./pages/PrijavaPage";
import PopisObjekataPage from "./pages/PopisObjekataPage";
import PopisSobaPage from "./pages/PopisSobaPage";
import PopisKrevetaPage from "./pages/PopisKrevetaPage";
import PopisAktivnihKvarovaPage from "./pages/PopisAktivnihKvarovaPage";
import PopisSvihKvarovaPage from "./pages/PopisSvihKvarovaPage";
import UnosKvarovaPage from "./pages/UnosKvarovaPage";
import IzmjenaKvarovaPage from "./pages/IzmjenaKvarovaPage";
import UnosObjekataPage from "./pages/UnosObjekataPage";
import UnosKrevetaPage from "./pages/UnosKrevetaPage";
import UnosSobaPage from "./pages/UnosSobaPage";
import IzmjenaKrevetaPage from "./pages/IzmjenaKrevetaPage";
import IzmjenaObjekataPage from "./pages/IzmjenaObjekataPage";
import IzmjenaStanaraPage from "./pages/IzmjenaStanaraPage";
import IzmjenaBoravkaPage from "./pages/IzmjenaBoravkaPage";
import IzmjenaSobaPage from "./pages/IzmjenaSobaPage";
import IzmjenaRadnikaPage from "./pages/IzmjenaRadnikaPage";
import UnosRadnikaPage from "./pages/UnosRadnikaPage";
import UnosBoravkaPage from "./pages/UnosBoravkaPage";
import ForbiddenPage from "./pages/ForbiddenPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UnosStanaraPage />,
  },
  {
    path: "/unosStanara",
    element: <UnosStanaraPage />,
  },
  {
    path: "/popisKorisnika",
    element: <PopisKorisnikaPage />,
  },
  {
    path: "/popisSvihStanara",
    element: <PopisSvihStanaraPage />,
  },
  {
    path: "/popisVremenskogPeroida",
    element: <PopisVremenskogPerioda />,
  },
  {
    path: "/PopisBoravaka",
    element: <PopisBoravakaPage />,
  },
  {
    path: "/prijava",
    element: <PrijavaPage />,
  },
  {
    path: "/popisObjekata",
    element: <PopisObjekataPage />,
  },
  {
    path: "/popisSoba",
    element: <PopisSobaPage />,
  },
  {
    path: "/popisKreveta",
    element: <PopisKrevetaPage />,
  },
  {
    path: "/popisAktivnihKvarova",
    element: <PopisAktivnihKvarovaPage />,
  },
  {
    path: "/popisSvihKvarova",
    element: <PopisSvihKvarovaPage />,
  },
  {
    path: "/unosKvarova",
    element: <UnosKvarovaPage />,
  },
  {
    path: "/izmjenaKvarova",
    element: <IzmjenaKvarovaPage />,
  },
  {
    path: "/izmjenaRadnika/:id_korisnika",
    element: <IzmjenaRadnikaPage />,
  },
  {
    path: "/unosObjekata",
    element: <UnosObjekataPage />,
  },
  {
    path: "/unosBoravka",
    element: <UnosBoravkaPage />,
  },
  {
    path: "/unosSoba",
    element: <UnosSobaPage />,
  },
  {
    path: "/unosKreveta",
    element: <UnosKrevetaPage />,
  },
  {
    path: "/izmjenaKreveta/:id_kreveta",
    element: <IzmjenaKrevetaPage />,
  },
  {
    path: "/izmjenaObjekata/:broj_objekta",
    element: <IzmjenaObjekataPage />,
  },
  {
    path: "/izmjenaSoba/:id_sobe",
    element: <IzmjenaSobaPage />,
  },
  {
    path: "/izmjenaRadnika/:id_korisnika",
    element: <IzmjenaRadnikaPage />,
  },
  {
    path: "/izmjenaStanara/:id",
    element: <IzmjenaStanaraPage />,
  },
  {
    path: "/izmjenaBoravka/:id_boravka",
    element: <IzmjenaBoravkaPage />,
  },
  {
    path: "/unosRadnika",
    element: <UnosRadnikaPage />,
  },
  {
    path: "/forbidden",
    element: <ForbiddenPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
