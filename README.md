# Evidencija Studenata

Kako je sad JSX umjesto TSX mozda ce trebat neke stvari dodatno izmjeniti \
Ako sta ne radi _npm install_ \
U backendu ce mozda trebat _npm install express_ \
Instalirati _Prettier - Code formatter_ ekstenziju za VS code tako da kod bude konzistentan i promijeniti u extension settings postavku _Print Width_ na 600 (cisto da linije budu duze nego sta je defaultno). Takoder ukljuciti format on save postavku VS code-u

## Backend API

U _\evidencija-studenata\backend-api_ nalazi se backend API, koji se pokrece node server.js naredbom \
test.json je JSON file za testiranje _(ne bitno)_

## Frontend

Za pokretanje frontenda pokrenuti naredbu _npm run dev_ dok se nalazis u folderu _react-app_ \

### Logika fronte je slijedeca:

- [main.jsx](react-app\src\main.jsx) (ovi linkovi bas ne rade trenutacno) se pokrece prilikom pokretanja app, tu postoji router array koji ima putanju u url-u i element koji se otvara (elementi su iznad importani). \
  Taj router array se koristi ispod u render funkciji
- U [pages](react-app\src\pages) se nalaze stranice (ovo su cisto neke pocetne koje ce vjj trebat)
- U [components](react-app\src\components) se nalaze komponente koje stranice koriste \
  Na primjer [Navbar.jsx](react-app\src\components\Navbar.jsx) koji koristi svaka stranica za navigaciju
- U [Navbar.jsx](react-app\src\components\Navbar.jsx) se u _link_ elementu linka na path deklariran u [main.tsx](react-app\src\main.tsx) u router array-u
