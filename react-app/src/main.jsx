import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import UnosStudenataPage from "./pages/UnosStudenataPage";
import PromjenaPodatakaPage from "./pages/PromjenaPodatakaPage";
import IseljenjeStudentaPage from "./pages/IseljenjeStudentaPage";
import PopisSvihStanaraPage from "./pages/PopisSvihStanaraPage";
import PopisVremenskogPerioda from "./pages/PopisVremenskogPeriodaPage";
import UseljenjeStudentaPage from "./pages/UseljenjeStudentaPage";
import PrijavaPage from "./pages/PrijavaPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UnosStudenataPage />,
  },
  {
    path: "/unosStudenata",
    element: <UnosStudenataPage />,
  },
  {
    path: "/promjenaPodataka",
    element: <PromjenaPodatakaPage />,
  },
  {
    path: "/iseljenjeStudenta",
    element: <IseljenjeStudentaPage />,
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
    path: "/useljenjeStudenta",
    element: <UseljenjeStudentaPage />,
  },
  {
    path: "/prijava",
    element: <PrijavaPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
